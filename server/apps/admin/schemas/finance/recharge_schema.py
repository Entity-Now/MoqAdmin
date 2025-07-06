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
from decimal import Decimal
from typing import Union
from fastapi import Query
from pydantic import BaseModel, Field


class RechargeSearchIn(BaseModel):
    """ 充值记录搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    user: Union[str, None] = Query(default=None, description="用户信息")
    order_sn: Union[str, None] = Query(default=None, description="充值单号")
    pay_way: Union[str, int, None] = Query(default=None, description="支付方式: [2=微信, 3=支付宝]")
    pay_status: Union[str, int, None] = Query(default=None, description="支付状态: [0=未支付, 1=已支付]")
    start_time: Union[int, str, None] = Query(default=None, description="开始时间")
    end_time: Union[int, str, None] = Query(default=None, description="结束时间")


"""---------------❤︎华丽分割线❤︎---------------"""


class RechargeListVo(BaseModel):
    """ 充值记录列表Vo """
    id: int = Field(description="ID")
    order_sn: str = Field(description="单号")
    order_type: int = Field(description="订单类型: [1=充值, 2=商品, 3=退款]")
    transaction_id: str = Field(description="支付流水号")
    paid_amount: Decimal = Field(description="订单金额")
    give_amount: Decimal = Field(description="赠送金额")
    pay_way: str = Field(description="支付方式")
    terminal: int = Field(description="来源平台: [1=小程序, 2=公众号, 3=H5, 4=PC, 5=安卓, 6=苹果]")
    pay_status: int = Field(description="支付状态: [0=未支付, 1=已支付]")
    delivery_type: int = Field(description="发货方式: [0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货]")
    delivery_status: int = Field(description="发货状态: [0=未发货, 1=已发货, 2=失败, 3=已收货]")
    ip: str = Field(description="用户IP地址")
    remark: str = Field(default="", description="订单备注")
    create_time: str = Field(description="创建时间")
    pay_time: str = Field(description="支付时间")
    user: dict = Field(default="用户信息")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 2,
                "order_sn": "B918447816245681",
                "paid_amount": 0.01,
                "give_amount": 0.0,
                "pay_way": "微信支付",
                "pay_status": 1,
                "create_time": "2023-09-18 21:46:21",
                "pay_time": "2023-09-18 21:46:24",
                "user": {
                    "sn": "80965941",
                    "avatar": "http://0.0.0.0:8100/xiao.png",
                    "mobile": "13800138000",
                    "nickname": "xiao"
                }
            }
        }
