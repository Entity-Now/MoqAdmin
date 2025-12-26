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
import requests
from exception import AppException
from kernels.utils import RequestUtil
from common.utils.config import ConfigUtil
from apps.admin.schemas.setting import seo_schema as schema
from apps.api.service.seo_service import SeoService as ApiSeoService


class SeoService:
    """ SEO配置服务类 """


    @classmethod
    async def get_baidu_config(cls) -> schema.BaiduParam:
        """
        获取百度SEO配置详情。

        Returns:
            schema.BaiduParam: 百度SEO配置参数。

        Author:
            zero
        """
        baidu = await ConfigUtil.get("baidu") or {}
        return schema.BaiduParam(
            site=baidu.get("site", ""),
            token=baidu.get("token", "")
        )

    @classmethod
    async def save_baidu_config(cls, post: schema.BaiduParam):
        """
        保存百度SEO配置。

        Args:
            post (schema.BaiduParam): 百度SEO配置参数。

        Author:
            zero
        """
        await ConfigUtil.set("baidu", "site", post.site)
        await ConfigUtil.set("baidu", "token", post.token)

    @classmethod
    async def baidu_submit(cls, post: schema.BaiduParam) -> schema.BaiduSubmitVo:
        """
        提交URL到百度搜索引擎（分批提交，每批2000个URL）。

        Args:
            post (schema.BaiduParam): 百度SEO配置参数。

        Returns:
            schema.BaiduSubmitVo: 提交结果（汇总所有批次）。

        Raises:
            AppException: 提交失败时抛出异常。

        Author:
            zero
        """
        BATCH_SIZE = 2000  # 百度每批提交2000个URL
        
        try:
            api_url = f"http://data.zz.baidu.com/urls?site={post.site}&token={post.token}"
            headers = {
                "User-Agent": "curl/7.12.1",
                "Content-Type": "text/plain"
            }
            
            # 生成提交的链接列表（文本格式，每行一个URL）
            urls_text = await ApiSeoService.generate_sitemap(
                RequestUtil.domain,
                'text'
            )
            
            # 将文本转换为URL列表
            url_list = [url.strip() for url in urls_text.split('\n') if url.strip()]
            total_urls = len(url_list)
            
            # 初始化汇总结果
            total_remain = 0
            total_success = 0
            all_not_same_site = []
            all_not_valid = []
            
            # 分批提交
            batch_count = (total_urls + BATCH_SIZE - 1) // BATCH_SIZE  # 向上取整
            
            for i in range(batch_count):
                start_idx = i * BATCH_SIZE
                end_idx = min((i + 1) * BATCH_SIZE, total_urls)
                batch_urls = url_list[start_idx:end_idx]
                
                # 将URL列表转换为文本格式（每行一个URL）
                batch_data = '\n'.join(batch_urls)
                
                # 提交当前批次到百度
                response = requests.post(api_url, headers=headers, data=batch_data.encode('utf-8'))
                
                if response.status_code != requests.codes.ok:
                    raise AppException(
                        f"百度SEO提交失败 (批次 {i+1}/{batch_count}): "
                        f"HTTP {response.status_code}, 错误内容：{response.text}"
                    )
                
                result = response.json()
                
                # 汇总结果
                total_remain = result.get('remain', 0)  # 剩余配额取最后一次的值
                total_success += result.get('success', 0)
                all_not_same_site.extend(result.get('not_same_site', []))
                all_not_valid.extend(result.get('not_valid', []))
            
            # 返回汇总结果
            return schema.BaiduSubmitVo(
                remain=total_remain,
                success=total_success,
                not_same_site=all_not_same_site,
                not_valid=all_not_valid
            )
            
        except requests.RequestException as e:
            raise AppException(f"百度SEO提交网络请求失败: {str(e)}")
        except ValueError as e:
            raise AppException(f"百度SEO响应解析失败: {str(e)}")
        except Exception as e:
            raise AppException(f"百度SEO提交失败: {str(e)}")
        
    @classmethod
    async def get_bing_config(cls) -> schema.BingParam:
        """
        获取Bing SEO配置详情。

        Returns:
            schema.BingParam: Bing SEO配置参数。

        Author:
            zero
        """
        bing = await ConfigUtil.get("bing") or {}
        return schema.BingParam(
            siteUrl=bing.get("siteUrl", ""),
            apikey=bing.get("apikey", "")
        )

    @classmethod
    async def save_bing_config(cls, post: schema.BingParam):
        """
        保存Bing SEO配置。

        Args:
            post (schema.BingParam): Bing SEO配置参数。

        Author:
            zero
        """
        await ConfigUtil.set("bing", "siteUrl", post.siteUrl)
        await ConfigUtil.set("bing", "apikey", post.apikey)

    @classmethod
    async def bing_submit(cls, post: schema.BingParam) -> schema.BingSubmitVo:
        """
        提交URL到Bing搜索引擎（分批提交，每批500个URL）。

        Args:
            post (schema.BingParam): Bing SEO配置参数。

        Returns:
            schema.BingSubmitVo: 提交结果（汇总所有批次）。

        Raises:
            AppException: 提交失败时抛出异常。

        Author:
            zero
        """
        BATCH_SIZE = 500  # Bing每批提交500个URL
        
        try:
            api_url = f"https://www.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey={post.apikey}"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Content-Type": "application/json; charset=utf-8"
            }
            
            # 生成提交的链接列表（文本格式）
            urls_text = await ApiSeoService.generate_sitemap(
                RequestUtil.domain,
                'text'
            )
            
            # 将文本转换为URL列表
            url_list = [url.strip() for url in urls_text.split('\n') if url.strip()]
            total_urls = len(url_list)
            
            # 初始化汇总结果
            all_results = []
            
            # 分批提交
            batch_count = (total_urls + BATCH_SIZE - 1) // BATCH_SIZE  # 向上取整
            
            for i in range(batch_count):
                start_idx = i * BATCH_SIZE
                end_idx = min((i + 1) * BATCH_SIZE, total_urls)
                batch_urls = url_list[start_idx:end_idx]
                
                # 构建请求数据
                payload = {
                    "siteUrl": post.siteUrl,
                    "urlList": batch_urls
                }
                
                # 提交当前批次到Bing
                response = requests.post(api_url, headers=headers, data=json.dumps(payload))
                
                if response.status_code != requests.codes.ok:
                    raise AppException(
                        f"Bing SEO提交失败 (批次 {i+1}/{batch_count}): "
                        f"HTTP {response.status_code}, 错误内容：{response.text}"
                    )
                
                result = response.json()
                all_results.append({
                    'batch': i + 1,
                    'count': len(batch_urls),
                    'result': result
                })
            
            # 返回汇总结果（包含所有批次信息）
            return schema.BingSubmitVo(d={
                'total_batches': batch_count,
                'total_urls': total_urls,
                'batches': all_results
            })
            
        except requests.RequestException as e:
            raise AppException(f"Bing SEO提交网络请求失败: {str(e)}")
        except ValueError as e:
            raise AppException(f"Bing SEO响应解析失败: {str(e)}")
        except Exception as e:
            raise AppException(f"Bing SEO提交失败: {str(e)}")
    