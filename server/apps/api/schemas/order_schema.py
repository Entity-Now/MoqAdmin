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
from typing import Union, List, Dict, Any, Optional
from pydantic import BaseModel, Field


class OrderCreateIn(BaseModel):
    """ 创建订单参数 """
    commodity_id: Optional[int] = Field(None, gt=0, description="商品ID")
    quantity: Optional[int] = Field(None, gt=0, description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格")
    address_id: Optional[int] = Field(None, gt=0, description="地址ID")
    remark: Optional[str] = Field(None, max_length=200, description="订单备注")
    is_from_cart: bool = Field(False, description="是否来自购物车")
    cart_ids: Optional[List[int]] = Field(None, description="购物车ID列表")


class OrderGoodsItem(BaseModel):
    """ 订单商品项 """
    commodity_id: int = Field(description="商品ID")
    title: str = Field(description="商品标题")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: List[str] = Field(description="商品图片")
    price: float = Field(description="商品价格")
    fee: Union[float, None] = Field(None, description="商品运费")
    quantity: int = Field(description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格")


class OrderPlaceVo(BaseModel):
    """ 下单结果Vo """
    order_id: int = Field(description="订单ID")
    order_sn: str = Field(description="订单编号")
    total_amount: float = Field(description="订单总金额")
    actual_pay_amount: float = Field(description="实际支付金额")

    class Config:
        json_schema_extra = {
            "example": {
                "order_id": 1,
                "order_sn": "20230308212828123456",
                "total_amount": 99.99,
                "actual_pay_amount": 99.99
            }
        }


class OrderDetailVo(BaseModel):
    """ 订单详情Vo """
    id: int = Field(description="订单ID")
    order_sn: str = Field(description="订单编号")
    total_amount: float = Field(description="订单总金额")
    actual_pay_amount: float = Field(description="实际支付金额")
    order_type: int = Field(description="订单类型: [1=充值订单, 2=商品订单， 3=购买会员]")
    pay_status: int = Field(description="支付状态: [0=待支付, 1=已支付, 2=已取消]")
    pay_time: str = Field(description="支付时间")
    create_time: str = Field(description="创建时间")
    receiver_name: str = Field(description="收货人姓名")
    receiver_phone: str = Field(description="收货人手机号")
    receiver_address: str = Field(description="收货地址")
    remark: str = Field(description="订单备注")
    goods_list: List[OrderGoodsItem] = Field(description="商品列表")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
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
                        "commodity_id": 1,
                        "title": "示例商品",
                        # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                        "image": ["https://www.xx.com/images/product.jpg"],
                        "price": 99.99,
                        "fee": 10.00,
                        "quantity": 1,
                        "sku": {"颜色": "红色", "尺寸": "M"}
                    }
                ]
            }
        }


class OrderListVo(BaseModel):
    """ 订单列表Vo """
    id: int = Field(description="订单ID")
    order_sn: str = Field(description="订单编号")
    total_amount: float = Field(description="订单总金额")
    actual_pay_amount: float = Field(description="实际支付金额")
    pay_status: int = Field(description="支付状态: [0=待支付, 1=已支付, 2=已取消]")
    goods_count: int = Field(description="商品数量")
    create_time: str = Field(description="创建时间")
    goods_list: List[OrderGoodsItem] = Field(description="商品列表")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "order_sn": "20230308212828123456",
                "total_amount": 99.99,
                "actual_pay_amount": 99.99,
                "pay_status": 0,
                "goods_count": 1,
                "create_time": "2023-03-08 21:28:28",
                "goods_list": [
                    {
                        "commodity_id": 1,
                        "title": "示例商品",
                        # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                        "image": ["https://www.xx.com/images/product.jpg"],
                        "price": 99.99,
                        "fee": 10.00,
                        "quantity": 1,
                        "sku": {"颜色": "红色", "尺寸": "M"}
                    }
                ]
            }
        }