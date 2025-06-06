from pydantic import BaseModel, Field

class WarehouseCardCreate(BaseModel):
    commodity_id: int = Field(..., description="关联商品ID")
    code: str = Field(..., description="卡号 / 内容")
    password: str = Field(default="", description="卡密密码")
    
    class Config:
        json_schema_extra = {
            "example": {
                "commodity_id": 101,
                "code": "XYZ-123-456",
                "password": "abcd1234"
            }
        }

class WarehouseCardUpdate(BaseModel):
    id: int = Field(..., gt=0, description="库存ID")
    password: str | None = Field(None, description="卡密密码（可为空）")
    is_used: int | None = Field(None, description="是否已使用")
    order_id: int | None = Field(None, description="订单ID")
    use_time: int | None = Field(None, description="使用时间戳")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 301,
                "commodity_id": 101,
                "code": "ABC-XYZ",
                "password": "1234",
                "is_used": 1,
                "order_id": 12345,
                "use_time": 1710002000,
            }
        }

class WarehouseCardDetail(WarehouseCardUpdate):
    """ 卡密详情 """
    create_time: int = Field(..., description="创建时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 301,
                "commodity_id": 101,
                "code": "ABC-XYZ",
                "password": "1234",
                "is_used": 1,
                "order_id": 12345,
                "use_time": 1710002000,
                "create_time": 1710000000
            }
        }
