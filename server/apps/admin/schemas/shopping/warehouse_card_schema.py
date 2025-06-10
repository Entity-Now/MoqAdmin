from pydantic import BaseModel, Field
from typing import Union, Optional
from fastapi import Query

class WarehouseCardSearchIn(BaseModel):
    """ 库存搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    title: Union[str, None] = Query(default=None, description="库存标题")
    is_used: Union[int, str, None] = Query(default=None, description="是否使用: [0=否, 1=是]")


class WarehouseCardCreate(BaseModel):
    commodity_id: int = Field(..., description="关联商品ID")
    title: str = Field(..., description="卡号 / 内容")
    password: str = Field(default="", description="卡密密码")
    card_type: int = Field(default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: int = Field(default=0, description="共享库存数量，仅在 card_type=1 时有效")

    class Config:
        json_schema_extra = {
            "example": {
                "commodity_id": 101,
                "title": "XYZ-123-456",
                "password": "abcd1234",
                "card_type": 0,
                "stock": 0
            }
        }

class WarehouseCardUpdate(BaseModel):
    id: int = Field(..., gt=0, description="库存ID")
    title: str = Field(..., description="卡号 / 内容")
    password: Optional[str] = Field(None, description="卡密密码（可为空）")
    is_used: Optional[int] = Field(None, description="是否已使用")
    order_id: Optional[int] = Field(None, description="订单ID")
    use_time: Optional[str] = Field(None, description="使用时间戳")
    card_type: Optional[int] = Field(None, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: Optional[int] = Field(None, description="共享库存数量")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 301,
                "title": "XYZ-123-456",
                "password": "1234",
                "is_used": 1,
                "order_id": 12345,
                "use_time": '2025-06-10 09:09:28',
                "card_type": 0,
                "stock": 0
            }
        }

class WarehouseCardDetail(WarehouseCardUpdate):
    commodity_id: int = Field(..., description="关联商品ID")
    title: str = Field(..., description="卡号 / 内容")
    create_time: str = Field(..., description="创建时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 301,
                "commodity_id": 101,
                "title": "ABC-XYZ",
                "password": "1234",
                "is_used": 1,
                "order_id": 12345,
                "use_time": '2025-06-10 09:09:28',
                "card_type": 0,
                "stock": 0,
                "create_time": '2025-06-10 09:09:28'
            }
        }
