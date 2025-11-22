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
from typing import Dict, Any
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.service.finance.order_service import OrderService
from apps.admin.schemas.finance.order_schema import OrderSearchIn,WorkOrderHandleIn

router = APIRouter(prefix="/order", tags=["订单"])


@router.get("/lists", summary="获取订单列表")
@response_json
async def order_lists(params: OrderSearchIn = Depends()) -> R:
    """
    获取订单列表
    
    Args:
        params (OrderSearchIn): 订单搜索参数
    
    Returns:
        R: 包含订单列表数据的响应
    """
    result = await OrderService.lists(params)
    return result

@router.post("/delivery", summary="发货订单", response_model=R)
@response_json
async def delivery_order(sub_order_id: int, logistics_company: str, logistics_no: str) :
    """
    发货订单
    
    Args:
        sub_order_id (int): 子订单ID
        logistics_company (str): 物流公司
        logistics_no (str): 物流单号
    
    Returns:
        R: 发货成功的响应
    """
    return await OrderService.delivery_order(sub_order_id, logistics_company, logistics_no)


@router.post("/after_sales/handle", summary="处理售后", response_model=R)
@response_json
async def handle_after_sales(
    params: WorkOrderHandleIn
):
    """
    处理售后接口
    
    Args:
        params (WorkOrderHandleIn): 售后处理参数
    
    Returns:
        R: 处理结果响应
    """
    return await OrderService.handle_after_sales(params)
