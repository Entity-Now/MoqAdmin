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
from fastapi import APIRouter
from hypertext import R, response_json
from apps.admin.schemas.setting import seo_schema as schema
from apps.admin.service.setting.seo_service import SeoService

router = APIRouter(prefix="/seo", tags=["SEO配置"])


@router.get("/baidu/detail", summary="百度SEO配置详情", response_model=R[schema.BaiduParam])
@response_json
async def baidu_detail():
    """
    获取百度SEO配置详情
    
    Returns:
        百度SEO配置信息
    """
    return await SeoService.get_baidu_config()


@router.post("/baidu/save", summary="保存百度SEO配置", response_model=R)
@response_json
async def baidu_save(params: schema.BaiduParam):
    """
    保存百度SEO配置
    
    Args:
        params: 百度SEO配置参数
    """
    await SeoService.save_baidu_config(params)


@router.post("/baidu/submit", summary="提交URL到百度", response_model=R[schema.BaiduSubmitVo])
@response_json
async def baidu_submit(params: schema.BaiduParam):
    """
    提交URL到百度搜索引擎
    
    Args:
        params: 百度SEO配置参数
        
    Returns:
        提交结果
    """
    return await SeoService.baidu_submit(params)


@router.get("/bing/detail", summary="Bing SEO配置详情", response_model=R[schema.BingParam])
@response_json
async def bing_detail():
    """
    获取Bing SEO配置详情
    
    Returns:
        Bing SEO配置信息
    """
    return await SeoService.get_bing_config()


@router.post("/bing/save", summary="保存Bing SEO配置", response_model=R)
@response_json
async def bing_save(params: schema.BingParam):
    """
    保存Bing SEO配置
    
    Args:
        params: Bing SEO配置参数
    """
    await SeoService.save_bing_config(params)


@router.post("/bing/submit", summary="提交URL到Bing", response_model=R[schema.BingSubmitVo])
@response_json
async def bing_submit(params: schema.BingParam):
    """
    提交URL到Bing搜索引擎
    
    Args:
        params: Bing SEO配置参数
        
    Returns:
        提交结果
    """
    return await SeoService.bing_submit(params)
