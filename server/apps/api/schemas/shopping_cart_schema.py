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
from fastapi import Query


class ShoppingCartAddIn(BaseModel):
    """ 加入购物车参数 """
    commodity_id: int = Field(..., gt=0, description="商品ID")
    quantity: int = Field(..., gt=0, description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格")


class ShoppingCartDeleteIn(BaseModel):
    """ 删除购物车参数 """
    ids: List[int] = Field(..., description="购物车ID列表")


class ShoppingCartUpdateIn(BaseModel):
    """ 更新购物车参数 """
    id: int = Field(..., gt=0, description="购物车ID")
    quantity: int = Field(..., gt=0, description="购买数量")


class ShoppingCartSelectIn(BaseModel):
    """ 选择购物车商品参数 """
    ids: List[int] = Field(..., description="购物车ID列表")
    is_selected: int = Field(..., ge=0, le=1, description="是否选中: [0=否, 1=是]")


class ShoppingCartVo(BaseModel):
    """ 购物车Vo """
    id: int = Field(description="购物车ID")
    commodity_id: int = Field(description="商品ID")
    title: str = Field(description="商品标题")
    image: str = Field(description="商品图片")
    price: float = Field(description="商品价格")
    quantity: int = Field(description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格")
    is_selected: int = Field(default=1, description="是否选中: [0=否, 1=是]")
    create_time: str = Field(description="添加时间")
    update_time: str = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "commodity_id": 1,
                "title": "示例商品",
                "image": "https://www.xx.com/images/product.jpg",
                "price": 99.99,
                "quantity": 1,
                "sku": {"颜色": "红色", "尺寸": "M"},
                "is_selected": 1,
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28"
            }
        }


class ShoppingCartDetailVo(BaseModel):
    """ 购物车详情Vo """
    id: int = Field(description="购物车ID")
    commodity_id: int = Field(description="商品ID")
    title: str = Field(description="商品标题")
    image: str = Field(description="商品图片")
    price: float = Field(description="商品价格")
    stock: int = Field(description="商品库存")
    sales: int = Field(description="商品销量")
    quantity: int = Field(description="购买数量")
    sku: Optional[Dict[str, Any]] = Field(None, description="规格")
    is_selected: int = Field(default=1, description="是否选中: [0=否, 1=是]")
    create_time: str = Field(description="添加时间")
    update_time: str = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "commodity_id": 1,
                "title": "示例商品",
                "image": "https://www.xx.com/images/product.jpg",
                "price": 99.99,
                "stock": 100,
                "sales": 50,
                "quantity": 1,
                "sku": {"颜色": "红色", "尺寸": "M"},
                "is_selected": 1,
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28"
            }
        }


class ShoppingCartListVo(BaseModel):
    """ 购物车列表Vo """
    total_count: int = Field(description="购物车总数量")
    selected_count: int = Field(description="已选中数量")
    selected_price: float = Field(description="已选中商品总价")
    items: List[ShoppingCartDetailVo] = Field(description="购物车商品列表")

    class Config:
        json_schema_extra = {
            "example": {
                "total_count": 10,
                "selected_count": 5,
                "selected_price": 499.95,
                "items": [
                    ShoppingCartDetailVo.model_config["json_schema_extra"]["example"]
                ]
            }
        }