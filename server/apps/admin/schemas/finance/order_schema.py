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
from typing import Union, List, Dict, Any, Optional
from fastapi import Query
from pydantic import BaseModel, Field


class OrderSearchIn(BaseModel):
    """ 订单搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    user: Union[str, None] = Query(default=None, description="用户信息(用户ID、昵称、手机号)")
    order_sn: Union[str, None] = Query(default=None, description="订单编号")
    pay_way: Union[str, int, None] = Query(default=None, description="支付方式: [2=微信, 3=支付宝]")
    pay_status: Union[str, int, None] = Query(default=None, description="支付状态: [0=未支付, 1=已支付, 2=已取消]")
    start_time: Union[int, str, None] = Query(default=None, description="开始时间")
    end_time: Union[int, str, None] = Query(default=None, description="结束时间")


"""---------------❤︎华丽分割线❤︎---------------"""



class OrderGoodsItem(BaseModel):
    """ 订单商品项 """
    sub_order_id: int = Field(description="子订单ID")
    commodity_id: int = Field(description="商品ID")
    title: str = Field(description="商品标题")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: List[str] = Field(default_factory=list, description="商品图片")
    price: float = Field(description="商品价格")
    fee: Union[float, None] = Field(default=0.0, description="商品运费")
    quantity: int = Field(description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格信息")
    delivery_type: int = Field(description="配送方式: [1=到店自提, 2=配送]")
    delivery_status: int = Field(default=0, description="配送状态: [0=未发货, 1=待配送, 2=配送中, 3=已配送]")
    logistics_company: Optional[str] = Field(None, max_length=50, description="物流公司")
    logistics_no: Optional[str] = Field(None, max_length=50, description="物流单号")


class OrderListVo(BaseModel):
    """ 订单列表Vo """
    id: int = Field(description="订单ID")
    user_id: int = Field(description="用户ID")
    user_account: str = Field(description="用户昵称")
    order_sn: str = Field(description="订单编号")
    total_amount: float = Field(description="订单总金额")
    actual_pay_amount: float = Field(description="实际支付金额")
    order_type: int = Field(description="订单类型: [1=充值订单, 2=商品订单， 3=购买会员]")
    pay_status: int = Field(description="支付状态: [0=待支付, 1=已支付, 2=已取消]")
    pay_time: str = Field(default="", description="支付时间")
    create_time: str = Field(description="创建时间")
    receiver_name: str = Field(default="", description="收货人姓名")
    receiver_phone: str = Field(default="", description="收货人手机号")
    receiver_address: str = Field(default="", description="收货地址")
    remark: str = Field(default="", description="订单备注")
    goods_list: List[OrderGoodsItem] = Field(default_factory=list, description="商品列表")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "user_account": "user123",
                "order_sn": "20230308212828123456",
                "total_amount": 99.99,
                "actual_pay_amount": 99.99,
                "order_type": 2,
                "pay_status": 0,
                "pay_time": "",
                "create_time": "2023-03-08 21:28:28",
                "receiver_name": "张三",
                "receiver_phone": "13800138000",
                "receiver_address": "广东省深圳市南山区科技园",
                "remark": "尽快发货",
                "goods_list": [
                    {
                        "sub_order_id": 1,
                        "commodity_id": 1,
                        "title": "示例商品",
                        # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                        "image": ["https://www.xx.com/images/product.jpg"],
                        "price": 99.99,
                        "fee": 10.00,
                        "quantity": 1,
                        "sku": {"颜色": "红色", "尺寸": "M"},
                        "delivery_type": 1,
                        "delivery_status": 1,
                        "logistics_company": "顺丰速运",
                        "logistics_no": "SF1234567890"
                    }
                ]
            }
        }