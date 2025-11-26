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
import os
from pathlib import Path
from typing import List
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
                    results.append({
                        'link': href,
                        'name': name
                    })

            # 保存到文件
            data_dir = Path('./data')
            data_dir.mkdir(exist_ok=True)
            
            output_file = data_dir / 'category_links.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)

            return schema.GrabResultVo(
                total=len(results),
                data=results,
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

            return schema.GrabResultVo(
                total=len(data),
                data=data,
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
                            import re
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
                                        all_goods.append({
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

            return schema.GrabResultVo(
                total=len(all_goods),
                data=all_goods,
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

            return schema.GrabResultVo(
                total=len(data),
                data=data,
                file_path=str(output_file)
            )

        except json.JSONDecodeError:
            raise AppException("数据文件格式错误")
        except Exception as e:
            raise AppException(f"读取数据失败: {str(e)}")
