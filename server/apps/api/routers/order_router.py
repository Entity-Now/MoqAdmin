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
from fastapi import APIRouter, Depends, Query, Request
from typing import Optional
from hypertext import R, response_json
from apps.api.service.order_service import OrderService
from apps.api.schemas import order_schema as schema


router = APIRouter(prefix="/order", tags=["订单服务"])


@router.post("/create", summary="创建订单", response_model=R)
@response_json
async def create_order(
    request: Request,
    params: schema.OrderCreateIn
):
    """
    创建订单接口
    
    支持两种方式创建订单：
    1. 单个商品创建：通过commodity_id和quantity参数
    2. 购物车创建：通过is_from_cart=true和cart_ids参数
    
    必须提供address_id参数指定收货地址
    """
    user_id: int = request.state.user_id
    terminal: int = request.state.terminal
    return await OrderService.create(user_id, terminal, params)


@router.get("/detail", summary="获取订单详情", response_model=R)
@response_json
async def get_order_detail(
    request: Request,
    order_id: int = Query(..., gt=0, description="订单ID")
):
    """
    获取订单详情接口
    
    通过订单ID查询订单的详细信息，包括订单状态、商品列表、收货信息等
    """
    user_id: int = request.state.user_id
    return await OrderService.detail(user_id, order_id)


@router.get("/lists", summary="获取订单列表", response_model=R)
@response_json
async def get_order_lists(
    request: Request,
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    status: Optional[int] = Query(None, description="订单状态"),
    query_type: Optional[str] = Query(None, description="查询类型"),
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=50, description="每页数量")
):
    """
    获取订单列表接口
    
    查询当前用户的所有订单列表，支持分页和订单状态筛选
    """
    user_id: int = request.state.user_id
    return await OrderService.lists(user_id, keyword, status, query_type, page, size)    



@router.post("/delete", summary="删除订单", response_model=R)
@response_json
async def delete_order(
    request: Request,
    order_id: int = Query(..., gt=0, description="订单ID")
):
    """
    删除订单接口
    
    删除已完成或已取消的订单
    """
    user_id: int = request.state.user_id
    return await OrderService.delete(user_id, order_id)