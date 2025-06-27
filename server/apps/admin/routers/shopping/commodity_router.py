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
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.schemas.shopping import commodity_schema as schema
from apps.admin.service.shopping.commodity_service import CommodityService as service

router = APIRouter(prefix="/shop_commodity", tags=["商品"])



@router.get("/lists", summary="商品列表", response_model=R[schema.CommodityDetail])
@response_json
async def lists(params: schema.CommoditySearchIn = Depends()):
    return await service.list(params)

@router.get("/selects", summary="商品Items", response_model=R)
@response_json
async def selects():
    return await service.selected()

@router.post("/add", summary="商品新增", response_model=R)
@response_json
async def add(params: schema.CommodityCreate):
    await service.add(params)


@router.post("/edit", summary="商品编辑", response_model=R)
@response_json
async def add(params: schema.CommodityUpdate):
    await service.edit(params)


@router.post("/delete", summary="商品删除", response_model=R)
@response_json
async def delete(params: schema.CommodityDeleteIn):
    await service.delete(params.id)
