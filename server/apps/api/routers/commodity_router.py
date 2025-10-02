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
from fastapi import APIRouter, Request, Depends
from hypertext import R, response_json, PagingResult
from apps.api.schemas import commodity_schema as schema
from apps.api.schemas.commodity_schema import CommodityCategoryVo
from apps.api.schemas.index_schema import BannerListVo
from apps.api.service.commodity_service import CommodityService


router = APIRouter(prefix="/commodity", tags=["商品管理"])


@router.get("/category", summary="商品分类列表", response_model=R[List[CommodityCategoryVo]])
@response_json
async def category():
    """
    商品分类列表
    """
    return await CommodityService.category()


@router.get("/lists", summary="商品列表", response_model=R[PagingResult[schema.CommodityListsVo]])
@response_json
async def lists(params: schema.CommoditySearchIn = Depends()):
    """
    商品列表
    """
    return await CommodityService.lists(params)


@router.get("/pages", summary="商品页面", response_model=R[schema.CommodityPagesVo])
@response_json
async def pages():
    """
    商品页面
    """
    return await CommodityService.pages()


@router.get("/detail", summary="商品详情", response_model=R[schema.CommodityDetailVo])
@response_json
async def detail(params: schema.CommodityDetailIn = Depends()):
    """
    商品详情
    """
    return await CommodityService.detail(params.id)


@router.get("/related", summary="相关商品", response_model=R[List[schema.CommodityListsVo]])
@response_json
async def related(params: schema.CommodityRelatedIn = Depends()):
    """
    相关商品
    """
    return await CommodityService.related(params.id)


@router.post("/collect", summary="商品收藏", response_model=R)
@response_json
async def collect(post: schema.CommodityCollectIn):
    """
    商品收藏
    """
    return await CommodityService.collect(post.id)