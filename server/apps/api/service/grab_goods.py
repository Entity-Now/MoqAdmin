# +----------------------------------------------------------------------
# | WaitAdmin(fastapi)快速开发后台管理系统
# +----------------------------------------------------------------------
# | 欢迎阅读学习程序代码,建议反馈是我们前进的动力
# | 程序完全开源可支持商用,允许去除界面版权信息
# | gitee:   https://gitee.com/wafts/waitadmin-python
# | github:  https://github.com/topwait/waitadmin-python
# | 官方网站: https://www.waitadmin.cn
# | WaitAdmin团队版权所有并拥有最终解释权
# +----------------------------------------------------------------------
# | Author: WaitAdmin Team <2474369941@qq.com>
# +----------------------------------------------------------------------
import json
import re
import os
from pathlib import Path
from typing import List
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
import requests
from bs4 import BeautifulSoup
from exception import AppException
from apps.api.schemas import grab_goods_schema as schema


class GrabGoodsService:
    """ 商品抓取服务类 """

    @classmethod
    async def grab_category_links(cls, url: str = "https://youki0131.x.yupoo.com/categories") -> schema.GrabResultVo:
        """
        抓取网页分类链接

        Args:
            url (str): 目标网页URL

        Returns:
            schema.GrabResultVo: 抓取结果Vo

        Raises:
            AppException: 抓取失败时抛出异常

        Author:
            zero
        """
        try:
            # 发送HTTP请求
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            response.encoding = response.apparent_encoding

            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 查找目标元素
            category_div = soup.find('div', class_='showheader__category_new')
            if not category_div:
                raise AppException("未找到目标元素: div.showheader__category_new")

            # 提取所有a标签
            links = category_div.find_all('a')
            if not links:
                raise AppException("未找到任何链接")

            # 构建结果数据
            results = []
            for link in links:
                href = link.get('href', '')
                name = link.get_text(strip=True)
                
                # 过滤空数据
                if href and name:
                    # 提取 id：从 href 中用 "/" 分割，取最后一段的数字部分
                    # 示例："/categories/4178939" -> "4178939"
                    href_parts = href.split('/')
                    last_part = href_parts[-1] if href_parts else ''
                    # 提取数字部分
                    id_match = re.search(r'(\d+)', last_part)
                    item_id = id_match.group(1) if id_match else ''
                    
                    results.append({
                        'id': item_id,
                        'parentId': '',
                        'code': '',
                        'link': href,
                        'name': name
                    })

            # 保存到文件
            data_dir = Path('./data')
            data_dir.mkdir(exist_ok=True)
            
            output_file = data_dir / 'category_links.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)

            # 将字典列表转换为 CategoryLinkVo 对象列表
            category_vos = [schema.CategoryLinkVo(**item) for item in results]

            return schema.GrabResultVo(
                total=len(category_vos),
                data=category_vos,
                file_path=str(output_file)
            )

        except requests.RequestException as e:
            raise AppException(f"网络请求失败: {str(e)}")
        except Exception as e:
            raise AppException(f"抓取失败: {str(e)}")

    @classmethod
    async def get_saved_links(cls) -> schema.GrabResultVo:
        """
        获取已保存的链接数据

        Returns:
            schema.GrabResultVo: 抓取结果Vo

        Raises:
            AppException: 文件不存在或读取失败时抛出异常

        Author:
            zero
        """
        try:
            output_file = Path('./data/category_links.json')
            
            if not output_file.exists():
                raise AppException("数据文件不存在，请先执行抓取操作")

            with open(output_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 将字典列表转换为 CategoryLinkVo 对象列表
            category_vos = [schema.CategoryLinkVo(**item) for item in data]

            return schema.GrabResultVo(
                total=len(category_vos),
                data=category_vos,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("数据文件格式错误")
        except Exception as e:
            raise AppException(f"读取数据失败: {str(e)}")

    @classmethod
    async def grab_goods_links(cls) -> schema.GrabResultVo:
        """
        抓取商品链接
        
        从已保存的分类链接中读取数据，循环抓取每个分类下的所有商品链接。
        支持分页抓取，自动识别总页数并遍历所有页面。

        Returns:
            schema.GrabResultVo: 抓取结果Vo

        Raises:
            AppException: 抓取失败时抛出异常

        Author:
            zero
        """
        try:
            # 1. 读取已保存的分类链接
            category_file = Path('./data/category_links.json')
            if not category_file.exists():
                raise AppException("分类链接文件不存在，请先执行分类链接抓取")

            with open(category_file, 'r', encoding='utf-8') as f:
                categories = json.load(f)

            if not categories:
                raise AppException("分类链接数据为空")

            # 2. 准备抓取
            base_url = "https://youki0131.x.yupoo.com"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            all_goods = []

            # 3. 循环抓取每个分类
            for category in categories:
                category_link = category.get('link', '')
                category_id = category.get('id', '')  # 获取当前分类的 id
                if not category_link:
                    continue

                # 4. 获取该分类的总页数
                first_page_url = f"{base_url}{category_link}?page=1"
                try:
                    response = requests.get(first_page_url, headers=headers, timeout=30)
                    response.raise_for_status()
                    response.encoding = response.apparent_encoding
                    
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 查找总页数
                    total_pages = 1  # 默认1页
                    pagination_form = soup.find('form', class_='pagination__jumpwrap')
                    if pagination_form:
                        page_span = pagination_form.find('span')
                        if page_span:
                            # 提取"共x页"中的数字
                            page_text = page_span.get_text(strip=True)
                            match = re.search(r'共(\d+)页', page_text)
                            if match:
                                total_pages = int(match.group(1))

                    # 5. 遍历所有页面抓取商品链接
                    for page in range(1, total_pages + 1):
                        page_url = f"{base_url}{category_link}?page={page}"
                        
                        try:
                            page_response = requests.get(page_url, headers=headers, timeout=30)
                            page_response.raise_for_status()
                            page_response.encoding = page_response.apparent_encoding
                            
                            page_soup = BeautifulSoup(page_response.text, 'html.parser')
                            
                            # 查找所有商品容器
                            goods_divs = page_soup.find_all('div', class_='categories__children')
                            
                            for goods_div in goods_divs:
                                # 获取第一个a标签
                                first_link = goods_div.find('a')
                                if first_link:
                                    href = first_link.get('href', '')
                                    title = first_link.get('title', '')
                                    
                                    # 过滤空数据
                                    if href and title:
                                        # 提取 id：从 href 中忽略查询参数，用 "/" 分割路径，取最后一段的数字部分
                                        # 示例："/albums/207821233?uid=1&isSubCate=false" -> "/albums/207821233" -> "207821233"
                                        # 先去除查询参数（? 及之后的部分）
                                        path_only = href.split('?')[0]
                                        # 用 "/" 分割，取最后一段
                                        path_parts = path_only.split('/')
                                        last_part = path_parts[-1] if path_parts else ''
                                        # 提取数字部分
                                        id_match = re.search(r'(\d+)', last_part)
                                        item_id = id_match.group(1) if id_match else ''
                                        
                                        all_goods.append({
                                            'id': item_id,
                                            'parentId': category_id,  # 使用当前分类的 id 作为 parentId
                                            'code': '',
                                            'link': href,
                                            'name': title
                                        })
                        
                        except requests.RequestException as e:
                            # 单页失败不影响整体，记录并继续
                            print(f"抓取页面失败 {page_url}: {str(e)}")
                            continue

                except requests.RequestException as e:
                    # 单个分类失败不影响整体，记录并继续
                    print(f"抓取分类失败 {category_link}: {str(e)}")
                    continue

            # 6. 保存到文件
            data_dir = Path('./data')
            data_dir.mkdir(exist_ok=True)
            
            output_file = data_dir / 'goods_links.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(all_goods, f, ensure_ascii=False, indent=2)

            # 将字典列表转换为 CategoryLinkVo 对象列表
            goods_vos = [schema.CategoryLinkVo(**item) for item in all_goods]

            return schema.GrabResultVo(
                total=len(goods_vos),
                data=goods_vos,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("分类链接文件格式错误")
        except Exception as e:
            raise AppException(f"抓取商品链接失败: {str(e)}")

    @classmethod
    async def get_saved_goods_links(cls) -> schema.GrabResultVo:
        """
        获取已保存的商品链接数据

        Returns:
            schema.GrabResultVo: 抓取结果Vo

        Raises:
            AppException: 文件不存在或读取失败时抛出异常

        Author:
            zero
        """
        try:
            output_file = Path('./data/goods_links.json')
            
            if not output_file.exists():
                raise AppException("商品链接文件不存在，请先执行商品链接抓取")

            with open(output_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 将字典列表转换为 CategoryLinkVo 对象列表
            goods_vos = [schema.CategoryLinkVo(**item) for item in data]

            return schema.GrabResultVo(
                total=len(goods_vos),
                data=goods_vos,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("数据文件格式错误")
        except Exception as e:
            raise AppException(f"读取数据失败: {str(e)}")

    @classmethod
    def _fetch_single_goods_detail(cls, item, base_url: str, headers: dict) -> schema.GoodsDetailVo:
        """
        抓取单个商品详情(用于多线程调用)
        
        Args:
            item: 商品链接信息
            base_url: 基础URL
            headers: 请求头
            
        Returns:
            schema.GoodsDetailVo: 商品详情对象,失败时返回None
        """
        item_link = item.link
        if not item_link:
            return None

        # 拼接完整URL
        full_url = f"{base_url}{item_link}"
        
        try:
            # 发送请求,明确指定UTF-8编码
            response = requests.get(full_url, headers=headers, timeout=30)
            response.raise_for_status()
            # 强制使用UTF-8编码解析响应内容
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 5.1 提取面包屑最后一个A标签信息
            breadcrumb_title = None
            breadcrumb_div = soup.find('div', class_='yupoo-crumbs showalbumheader__header')
            if breadcrumb_div:
                all_links = breadcrumb_div.find_all('a')
                if all_links:
                    last_link = all_links[-1]
                    breadcrumb_title = last_link.get('title', '').strip()
            
            # 5.2 提取商品标题
            goods_title = None
            title_elem = soup.find(class_='showalbumheader__gallerytitle')
            if title_elem:
                goods_title = title_elem.get_text(strip=True)
            
            # 5.3 提取主图（从 div.showalbumheader__gallerycover 的第一个 img 的 src）
            main_image = None
            gallery_cover = soup.find('div', class_='showalbumheader__gallerycover')
            if gallery_cover:
                first_img = gallery_cover.find('img')
                if first_img:
                    main_image = first_img.get('src', '')
            
            # 5.4 提取商品副标题(货号、尺码)
            article_no = None
            sizes = None
            subtitle_div = soup.find('div', class_='showalbumheader__gallerysubtitle htmlwrap__main')
            if subtitle_div:
                subtitle_text = subtitle_div.get_text()
                
                # 提取货号:支持 "货号:" 或 "官方货号:" 后的数字+字母+特殊符号(不含汉字)
                # 例如: "货号: CI1173-400原厂原档案开发" -> "CI1173-400"
                article_patterns = [
                    r'官方货号[：:]\s*([A-Za-z0-9\-_\.]+)',  # 官方货号: 或 官方货号:
                    r'货号[：:]\s*([A-Za-z0-9\-_\.]+)',      # 货号: 或 货号:
                ]
                
                for pattern in article_patterns:
                    article_match = re.search(pattern, subtitle_text)
                    if article_match:
                        article_no = article_match.group(1).strip()
                        break
                
                # 提取尺码:支持多种格式
                # 1. 尺码: 或 尺码: (中文)
                # 2. size: 或 size : (英文,带冒号)
                # 3. size 或 Size (英文,无冒号)
                # 4. 尺码 (中文,无冒号)
                sizes_patterns = [
                    r'尺码\s*[：:]\s*([^\n]+)',  # 尺码: 或 尺码:
                    r'\bsize\s*[：:]\s*([^\n]+)',  # size: 或 size :
                    r'\bsize\s+([^\n]+)',  # size (无冒号,后面有空格)
                    r'尺码\s+([^\n]+)',  # 尺码 (无冒号,后面有空格)
                ]
                
                for pattern in sizes_patterns:
                    sizes_match = re.search(pattern, subtitle_text, re.IGNORECASE)
                    if sizes_match:
                        sizes = sizes_match.group(1).strip()
                        break
            
            # 5.5 提取商品图片（按DOM顺序，优先使用data-origin-src）
            image_urls = []
            album_parent = soup.find('div', class_='showalbum__parent')
            if album_parent:
                img_tags = album_parent.find_all('img')
                for img in img_tags:
                    # 优先使用 data-origin-src，如果不存在则使用 src
                    src = img.get('data-origin-src') or img.get('src', '')
                    if src:
                        image_urls.append(src)
            
            # 6. 封装结果
            detail = schema.GoodsDetailVo(
                id=item.id,
                parentId=item.parentId,
                code=item.code,
                mainImage=main_image,
                imageUrls=image_urls,
                articleNo=article_no,
                sizes=sizes,
                breadcrumbTitle=breadcrumb_title,
                goodsTitle=goods_title
            )
            
            # 打印日志
            print(f"✓ 抓取完成: id={item.id}, 标题={goods_title}, 尺码={sizes}")
            return detail
        
        except requests.RequestException as e:
            print(f"✗ 抓取商品详情失败 {full_url}: {str(e)}")
            return None
        except Exception as e:
            print(f"✗ 处理商品详情失败 {full_url}: {str(e)}")
            return None

    @classmethod
    async def grab_goods_details(cls) -> schema.GoodsDetailResultVo:
        """
        抓取商品详情(多线程优化版)
        
        从已保存的商品链接中读取数据,使用多线程并发抓取每个商品的详细信息。
        包括:图片、货号、尺码、面包屑标题、商品标题等。
        
        优化特性:
        1. 使用多线程并发请求(10个工作线程)
        2. 强制UTF-8编码避免中文乱码
        3. 支持多种尺码格式匹配(size:, 尺码:, 有/无冒号等)

        Returns:
            schema.GoodsDetailResultVo: 抓取结果Vo

        Raises:
            AppException: 抓取失败时抛出异常

        Author:
            zero
        """
        try:
            # 1. 获取已保存的商品链接数据
            goods_links_result = await cls.get_saved_goods_links()
            goods_list = goods_links_result.data
            
            if not goods_list:
                raise AppException("商品链接数据为空")

            # 2. 准备抓取
            base_url = "https://youki0131.x.yupoo.com"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
            }
            
            print(f"开始抓取 {len(goods_list)} 个商品详情(线程数: 10)...")
            
            # 3. 使用线程池并发抓取
            all_details = []
            with ThreadPoolExecutor(max_workers=1) as executor:
                # 提交所有抓取任务
                future_to_item = {
                    executor.submit(cls._fetch_single_goods_detail, item, base_url, headers): item
                    for item in goods_list
                }
                
                # 收集抓取结果
                completed = 0
                for future in as_completed(future_to_item):
                    try:
                        detail = future.result()
                        if detail:
                            all_details.append(detail)
                        completed += 1
                        
                        # 显示进度
                        if completed % 10 == 0:
                            print(f"进度: {completed}/{len(goods_list)}")
                    except Exception as e:
                        print(f"任务执行异常: {str(e)}")
            
            print(f"抓取完成: 成功 {len(all_details)}/{len(goods_list)}")

            # 4. 保存到文件
            data_dir = Path('./data')
            data_dir.mkdir(exist_ok=True)
            
            output_file = data_dir / 'goods_details.json'
            # 将 Pydantic 模型转换为字典以便 JSON 序列化
            details_dict = [detail.model_dump() for detail in all_details]
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(details_dict, f, ensure_ascii=False, indent=2)
            
            print(f"保存商品详情完成,共 {len(all_details)} 个商品")
            return schema.GoodsDetailResultVo(
                total=len(all_details),
                data=all_details,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("商品链接文件格式错误")
        except Exception as e:
            raise AppException(f"抓取商品详情失败: {str(e)}")

    @classmethod
    async def get_saved_goods_details(cls) -> schema.GoodsDetailResultVo:
        """
        获取已保存的商品详情数据

        Returns:
            schema.GoodsDetailResultVo: 抓取结果Vo

        Raises:
            AppException: 文件不存在或读取失败时抛出异常

        Author:
            zero
        """
        try:
            output_file = Path('./data/goods_details.json')
            
            if not output_file.exists():
                raise AppException("商品详情文件不存在，请先执行商品详情抓取")

            with open(output_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 将字典列表转换为 Pydantic 模型列表
            details = [schema.GoodsDetailVo(**item) for item in data]

            return schema.GoodsDetailResultVo(
                total=len(details),
                data=details,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("数据文件格式错误")
        except Exception as e:
            raise AppException(f"读取数据失败: {str(e)}")

    @classmethod
    def _extract_sizes_from_article_no(cls, article_no: str) -> tuple:
        """
        从 articleNo 中提取尺码信息
        
        Args:
            article_no: 货号字符串，可能包含 Size 信息
            
        Returns:
            tuple: (清理后的货号, 尺码列表)
        """
        if not article_no:
            return article_no, None
        
        # 不区分大小写查找 size 关键字（支持多种格式：Size :, size:, Size, size 等）
        size_pattern = re.compile(r'\bsize\s*[：:]?\s*', re.IGNORECASE)
        match = size_pattern.search(article_no)
        
        if match:
            # 提取 Size 之前的部分作为清理后的货号
            cleaned_article_no = article_no[:match.start()].strip()
            
            # 提取 Size 之后的所有内容作为尺码
            sizes_str = article_no[match.end():].strip()
            
            # 将尺码字符串分割为数组（按空格分割）
            sizes_list = sizes_str.split() if sizes_str else []
            
            return cleaned_article_no, sizes_list
        
        return article_no, None

    @classmethod
    def _download_single_image(cls, image_url: str, item_id: str, parent_id: str, idx: int, image_dir: Path) -> str:
        """
        下载单张图片（用于多线程调用）
        
        Args:
            image_url: 图片URL
            item_id: 商品ID
            parent_id: 父级ID
            idx: 图片索引
            image_dir: 图片保存目录
            
        Returns:
            str: 本地访问路径或原URL（失败时）
        """
        try:
            # 1. 处理图片URL（补全协议头）
            download_url = image_url
            if not download_url.startswith('http'):
                download_url = 'https:' + download_url if download_url.startswith('//') else download_url
            
            # 2. 获取图片后缀
            url_path = download_url.split('?')[0]
            ext_match = re.search(r'\.(jpg|jpeg|png|gif|webp|bmp)$', url_path.lower())
            ext = ext_match.group(0) if ext_match else '.jpg'
            
            # 3. 构建文件名：{item.id}_{item.parentId}_{图片索引}.{后缀}
            filename = f"{item_id}_{parent_id}_{idx}{ext}"
            file_path = image_dir / filename
            
            # 4. 准备完整的请求头（避免403错误）
            headers = {
                'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'referer': 'https://youki0131.x.yupoo.com/',
                'sec-ch-ua': '"Chromium";v="142", "Microsoft Edge";v="142", "Not_A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0'
            }
            
            # 5. 下载图片
            response = requests.get(download_url, headers=headers, timeout=30, verify=False)
            response.raise_for_status()
            
            # 6. 保存图片到本地
            with open(file_path, 'wb') as f:
                f.write(response.content)
            
            # 7. 构建本地访问路径
            local_url = f"/static/goods_image/{filename}"
            print(f"✓ 下载成功: {filename}")
            return local_url
            
        except requests.RequestException as e:
            print(f"✗ 下载图片失败 {image_url}: {str(e)}")
            return image_url
        except Exception as e:
            print(f"✗ 处理图片失败 {image_url}: {str(e)}")
            return image_url

    @classmethod
    async def save_goods_details_locally(cls) -> schema.GoodsDetailResultVo:
        """
        保存商品详情到本地（多线程优化版）
        
        下载商品详情中的网络图片到本地，并替换 imageUrls 为本地路径。
        最终将修改后的数据保存到 local_goods_detail.json 文件。
        
        优化特性：
        1. 使用多线程并发下载图片（10个工作线程）
        2. 从 articleNo 中提取 sizes 信息
        3. 补全 imageUrls 协议头
        4. 使用完整请求头避免403错误

        Returns:
            schema.GoodsDetailResultVo: 保存结果Vo

        Raises:
            AppException: 保存失败时抛出异常

        Author:
            zero
        """
        try:
            # 1. 获取已保存的商品详情数据
            goods_details_result = await cls.get_saved_goods_details()
            goods_list = goods_details_result.data
            
            if not goods_list:
                raise AppException("商品详情数据为空")

            # 2. 准备图片保存目录
            image_dir = Path('./public/static/goods_image')
            image_dir.mkdir(parents=True, exist_ok=True)

            # 3. 数据处理和图片下载任务准备
            processed_details = []
            download_tasks = []  # 存储所有下载任务
            task_mapping = {}    # 任务索引映射
            
            print(f"开始处理 {len(goods_list)} 个商品...")
            
            # 4. 遍历商品，处理数据并准备下载任务
            for item_idx, item in enumerate(goods_list):
                # 4.1 处理 articleNo 和 sizes
                article_no = item.articleNo if item.articleNo else None
                sizes = item.sizes
                
                # 如果 sizes 为空且 articleNo 包含 size 信息，则提取
                if not sizes and article_no:
                    cleaned_article_no, extracted_sizes = cls._extract_sizes_from_article_no(article_no)
                    if extracted_sizes:
                        article_no = cleaned_article_no
                        sizes = extracted_sizes
                
                # 4.2 处理 mainImage
                main_image_url = None
                if item.mainImage and not item.mainImage.startswith('http'):
                    main_image_url = 'https:' + item.mainImage if item.mainImage.startswith('//') else item.mainImage
                elif item.mainImage:
                    main_image_url = item.mainImage
                
                # 4.3 补全 imageUrls 协议头
                processed_image_urls = []
                for img_url in item.imageUrls:
                    if img_url and not img_url.startswith('http'):
                        processed_image_urls.append('https:' + img_url if img_url.startswith('//') else img_url)
                    else:
                        processed_image_urls.append(img_url)
                
                # 4.4 准备主图下载任务（如果存在）
                if main_image_url:
                    task_key = (item_idx, 'main')  # 使用 'main' 标识主图
                    download_tasks.append((main_image_url, item.id, item.parentId, 'main', image_dir))
                    task_mapping[len(download_tasks) - 1] = task_key
                
                # 4.5 准备图片列表下载任务
                for idx, image_url in enumerate(processed_image_urls):
                    task_key = (item_idx, idx)
                    download_tasks.append((image_url, item.id, item.parentId, idx, image_dir))
                    task_mapping[len(download_tasks) - 1] = task_key
                
                # 4.6 暂存处理后的数据（imageUrls 和 mainImage 稍后更新）
                processed_details.append({
                    'item': item,
                    'article_no': article_no,
                    'sizes': sizes,
                    'image_urls': processed_image_urls,
                    'local_image_urls': [None] * len(processed_image_urls),
                    'main_image_url': main_image_url,
                    'local_main_image': None
                })
            
            # 5. 使用线程池并发下载图片（10个工作线程），保持原始顺序
            print(f"开始多线程下载 {len(download_tasks)} 张图片（线程数: 10）...")
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                # 提交所有下载任务
                future_to_task = {
                    executor.submit(cls._download_single_image, *task): task_idx
                    for task_idx, task in enumerate(download_tasks)
                }
                
                # 收集下载结果（使用索引映射保持原始顺序）
                completed = 0
                for future in as_completed(future_to_task):
                    task_idx = future_to_task[future]
                    item_idx, img_idx = task_mapping[task_idx]
                    
                    try:
                        local_url = future.result()
                        # 区分主图和普通图片
                        if img_idx == 'main':
                            # 主图
                            processed_details[item_idx]['local_main_image'] = local_url
                        else:
                            # 使用索引直接赋值，保持原始图片顺序
                            processed_details[item_idx]['local_image_urls'][img_idx] = local_url
                        completed += 1
                        if completed % 10 == 0:
                            print(f"进度: {completed}/{len(download_tasks)}")
                    except Exception as e:
                        print(f"任务执行异常: {str(e)}")
                        # 保留原URL，同样使用索引保持顺序
                        if img_idx == 'main':
                            processed_details[item_idx]['local_main_image'] = processed_details[item_idx]['main_image_url']
                        else:
                            processed_details[item_idx]['local_image_urls'][img_idx] = processed_details[item_idx]['image_urls'][img_idx]
            
            print(f"图片下载完成: {completed}/{len(download_tasks)}")
            
            # 6. 创建最终的商品详情对象列表
            final_details = []
            for detail_data in processed_details:
                item = detail_data['item']
                processed_detail = schema.GoodsDetailVo(
                    id=item.id,
                    parentId=item.parentId,
                    code=item.code,
                    mainImage=detail_data['local_main_image'],  # 使用下载后的本地路径
                    imageUrls=detail_data['local_image_urls'],
                    articleNo=detail_data['article_no'],
                    sizes=detail_data['sizes'],
                    breadcrumbTitle=item.breadcrumbTitle if item.breadcrumbTitle else None,
                    goodsTitle=item.goodsTitle if item.goodsTitle else None
                )
                final_details.append(processed_detail)

            # 7. 保存到文件
            data_dir = Path('./data')
            data_dir.mkdir(exist_ok=True)
            
            output_file = data_dir / 'local_goods_detail.json'
            # 将 Pydantic 模型转换为字典以便 JSON 序列化
            details_dict = [detail.model_dump() for detail in final_details]
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(details_dict, f, ensure_ascii=False, indent=2)
            
            print(f"保存商品详情完成，共 {len(final_details)} 个商品")

            return schema.GoodsDetailResultVo(
                total=len(final_details),
                data=final_details,
                file_path=str(output_file)
            )

        except Exception as e:
            raise AppException(f"保存商品详情到本地失败: {str(e)}")
