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
from typing import List
from fastapi import APIRouter, Query, Depends
from hypertext import R, response_json
from apps.api.schemas import minihome_schema as schema
from apps.api.service.minihome_service import MiniHomeService

router = APIRouter(prefix="/minihome", tags=["MiniHome接口"])


@router.get("/pages", summary="MiniHome页面数据", response_model=R[schema.MiniHomePagesVo])
@response_json
async def pages():
    """
    获取MiniHome页面数据，包括轮播图和推荐商品
    
    Returns:
        R[schema.MiniHomePagesVo]: 页面数据响应
    """
    return await MiniHomeService.pages()


@router.get("/goods", summary="推荐商品列表", response_model=R[schema.PagingResult[schema.CommodityListsVo]])
@response_json
async def goods(params: schema.GoodsListIn = Depends()):
    """
    获取推荐商品列表，支持分页和类型筛选
    
    Args:
        params (schema.GoodsListIn): 请求参数
        
    Returns:
        R[schema.GoodsListVo]: 商品列表响应
    """
    return await MiniHomeService.goods_list(params)


@router.get("/search", summary="搜索商品", response_model=R[schema.PagingResult[schema.CommodityListsVo]])
@response_json
async def search(params: schema.GoodsListIn = Depends()):
    """
    搜索商品，支持关键词、分类、价格范围筛选
    
    Args:
        params (schema.GoodsListIn): 搜索参数
        
    Returns:
        R[schema.PagingResult[schema.CommodityListsVo]]: 搜索结果响应
    """
    return await MiniHomeService.search_goods(params)


@router.get("/guess-categories", summary="猜你想搜分类列表", response_model=R[List[schema.GuessCategoryVo]])
@response_json
async def guess_categories(limit: int = Query(default=10, ge=1, le=50, description="返回分类数量")):
    """
    获取随机分类列表，用于"猜你想搜"功能
    
    Args:
        limit (int): 返回分类的数量，取值范围1-50
        
    Returns:
        R[List[schema.GuessCategoryVo]]: 随机分类列表响应
    """
    return await MiniHomeService.guess_categories(limit)


@router.get("/categories", summary="商品分类列表", response_model=R[List[schema.CategoryVo]])
@response_json
async def categories():
    """
    获取商品分类列表，包括一级分类和二级分类
    
    Returns:
        R[List[schema.CategoryVo]]: 商品分类列表响应
    """
    return await MiniHomeService.categories()