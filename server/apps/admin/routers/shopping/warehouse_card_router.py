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
from fastapi import APIRouter, Depends, Query
from typing import Dict
from hypertext import R, response_json
from apps.admin.schemas.shopping import warehouse_card_schema as schema
from apps.admin.service.shopping.warehouse_card_service import WarehouseCardService as service

router = APIRouter(prefix="/shop_warehouse_card", tags=["仓库"])



@router.get("/lists", summary="仓库列表", response_model=R[schema.WarehouseCardDetail])
@response_json
async def lists(params: schema.WarehouseCardSearchIn = Depends()):
    return await service.list(params)

@router.get("/sku_stock", summary="查询规格库存", response_model=R[Dict[str, int]])
@response_json
async def sku_stock(cid: int = Query(..., gt=0, description="库存ID")):
    return await service.sku_stock(cid)



@router.get("/selects", summary="仓库Items", response_model=R)
@response_json
async def selects():
    return await service.selected()

@router.post("/add", summary="仓库新增", response_model=R)
@response_json
async def add(params: schema.WarehouseCardCreate):
    await service.add(params)


@router.post("/edit", summary="仓库编辑", response_model=R)
@response_json
async def add(params: schema.WarehouseCardUpdate):
    await service.edit(params)


@router.post("/delete", summary="仓库删除", response_model=R)
@response_json
async def delete(params: schema.WarehouseCardDeleteIn):
    await service.delete(params.id)
