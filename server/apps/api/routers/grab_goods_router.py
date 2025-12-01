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
from apps.api.schemas import grab_goods_schema as schema
from apps.api.service.grab_goods import GrabGoodsService

router = APIRouter(prefix="/grab", tags=["商品抓取接口"])


@router.post("/category_links", summary="抓取分类链接", response_model=R[schema.GrabResultVo])
@response_json
async def grab_category_links(params: schema.GrabCategoryIn):
    """
    抓取指定网页的分类链接
    
    从目标网页中提取 div.showheader__category_new 下的所有 a 标签，
    并将结果保存到 JSON 文件中。
    """
    return await GrabGoodsService.grab_category_links(params.url)


@router.get("/category_links", summary="获取已保存的分类链接", response_model=R[schema.GrabResultVo])
@response_json
async def get_saved_links():
    """
    获取已保存的分类链接数据
    
    读取之前抓取并保存的分类链接数据。
    """
    return await GrabGoodsService.get_saved_links()


@router.post("/goods_links", summary="抓取商品链接", response_model=R[schema.GrabResultVo])
@response_json
async def grab_goods_links():
    """
    抓取商品链接
    
    从已保存的分类链接中读取数据，循环抓取每个分类下的所有商品链接。
    支持分页抓取，自动识别总页数并遍历所有页面。
    """
    return await GrabGoodsService.grab_goods_links()


@router.get("/goods_links", summary="获取已保存的商品链接", response_model=R[schema.GrabResultVo])
@response_json
async def get_saved_goods_links():
    """
    获取已保存的商品链接数据
    
    读取之前抓取并保存的商品链接数据。
    """
    return await GrabGoodsService.get_saved_goods_links()


@router.post("/goods_details", summary="抓取商品详情", response_model=R[schema.GoodsDetailResultVo])
@response_json
async def grab_goods_details():
    """
    抓取商品详情
    
    从已保存的商品链接中读取数据，循环抓取每个商品的详细信息。
    包括：图片、货号、尺码、面包屑标题、商品标题等。
    """
    return await GrabGoodsService.grab_goods_details()


@router.get("/goods_details", summary="获取已保存的商品详情", response_model=R[schema.GoodsDetailResultVo])
@response_json
async def get_saved_goods_details():
    """
    获取已保存的商品详情数据
    
    读取之前抓取并保存的商品详情数据。
    """
    return await GrabGoodsService.get_saved_goods_details()


@router.post("/saved_goods_details", summary="保存商品详情到本地", response_model=R[schema.GoodsDetailResultVo])
@response_json
async def saved_goods_details():
    """
    保存商品详情到本地
    
    下载商品详情中的网络图片到本地（./public/static/goods_image），
    并将 imageUrls 替换为本地路径，最终保存到 local_goods_detail.json 文件。
    
    图片命名规则：{item.id}_{item.parentId}_{item.code}_{图片索引}.{原图片后缀}
    本地路径格式：/static/goods_image/{文件名}
    """
    return await GrabGoodsService.save_goods_details_locally()
