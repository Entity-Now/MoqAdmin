from pydantic import BaseModel, Field
from typing import Union, Optional, Dict
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
    sku: Optional[Dict[str, str]] = Field(None, description="规格，JSON格式，例如：{'颜色': '红色', '尺寸': 'S'}")



    class Config:
        json_schema_extra = {
            "example": {
                "commodity_id": 101,
                "title": "XYZ-123-456",
                "password": "abcd1234",
                "card_type": 0,
                "stock": 0,
                "sku": {"颜色": "红色", "尺寸": "S"}
            }
        }

class WarehouseCardUpdate(BaseModel):
    id: int = Field(..., gt=0, description="库存ID")
    title: str = Field(..., description="卡号 / 内容")
    password: Optional[str] = Field(None, description="卡密密码（可为空）")
    card_type: Optional[int] = Field(None, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: Optional[int] = Field(None, description="共享库存数量")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 301,
                "title": "XYZ-123-456",
                "password": "1234",
                "card_type": 0,
                "stock": 0
            }
        }

class WarehouseCardDetail(WarehouseCardCreate):
    commodity_id: int = Field(..., description="关联商品ID")
    is_used: int = Field(..., description="是否已使用: [0=否, 1=是]")
    order_id: int = Field(..., description="关联订单ID（使用后记录）")
    create_time: str = Field(description="创建时间")
    # 规格
    sku: Optional[Dict[str, str]] = Field(None, description="规格，JSON格式，例如：{'颜色': '红色', '尺寸': 'S'}")

    class Config:
        # 定义一个json_schema_extra字典，用于存储示例数据
        json_schema_extra = {
            "example": {
                "id": 301,
                "commodity_id": 101,
                "title": "ABC-XYZ",
                "password": "1234",
                "is_used": 1,
                "order_id": 12345,
                "card_type": 0,
                "stock": 0,
                "create_time": '2025-06-10 09:09:28',
                "sku": {"颜色": "红色", "尺寸": "S"}
            }
        }

class WarehouseCardDeleteIn(BaseModel):
    """ 仓库删除参数 """
    id: int = Field(gt=0, description="仓库ID", examples=[1])

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1
            }
        }