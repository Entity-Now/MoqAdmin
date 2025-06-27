class WarehouseCardSearchIn(BaseModel):
    """ warehouse_card搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    id: Union[int, None] = Query(default=None, description="主键")
    commodity_id: Union[int, None] = Query(default=None, description="关联商品ID")
    title: Union[str, None] = Query(default=None, description="卡号 / 卡密内容")
    password: Union[str, None] = Query(default='', description="卡密密码（如无可留空）")
    is_used: Union[int, None] = Query(default=0, description="是否已使用: [0=否, 1=是]")
    order_id: Union[int, None] = Query(default=0, description="关联订单ID（使用后记录）")
    use_time: Union[int, None] = Query(default=0, description="使用时间（时间戳）")
    card_type: Union[int, None] = Query(default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: Union[int, None] = Query(default=0, description="共享库存数量，仅在 card_type=1 时有效")
    is_delete: Union[int, None] = Query(default=0, description="是否删除")
    create_time: Union[int, None] = Query(default=0, description="创建时间")


class WarehouseCardCreate(BaseModel):
    id: int = Field(..., description="主键")
    commodity_id: int = Field(..., description="关联商品ID")
    title: str = Field(..., description="卡号 / 卡密内容")
    password: str = Field(default='', description="卡密密码（如无可留空）")
    is_used: int = Field(default=0, description="是否已使用: [0=否, 1=是]")
    order_id: int = Field(default=0, description="关联订单ID（使用后记录）")
    use_time: int = Field(default=0, description="使用时间（时间戳）")
    card_type: int = Field(default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: int = Field(default=0, description="共享库存数量，仅在 card_type=1 时有效")
    is_delete: int = Field(default=0, description="是否删除")
    create_time: int = Field(default=0, description="创建时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "commodity_id": 0,
                "title": '',
                "password": '',
                "is_used": 0,
                "order_id": 0,
                "use_time": 0,
                "card_type": 0,
                "stock": 0,
                "is_delete": 0,
                "create_time": 0,
            }
        }

class WarehouseCardUpdate(BaseModel):
    id: int = Field(..., description="主键")
    commodity_id: int = Field(..., description="关联商品ID")
    title: str = Field(..., description="卡号 / 卡密内容")
    password: str = Field(default='', description="卡密密码（如无可留空）")
    is_used: int = Field(default=0, description="是否已使用: [0=否, 1=是]")
    order_id: int = Field(default=0, description="关联订单ID（使用后记录）")
    use_time: int = Field(default=0, description="使用时间（时间戳）")
    card_type: int = Field(default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: int = Field(default=0, description="共享库存数量，仅在 card_type=1 时有效")
    is_delete: int = Field(default=0, description="是否删除")
    create_time: int = Field(default=0, description="创建时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "commodity_id": 0,
                "title": '',
                "password": '',
                "is_used": 0,
                "order_id": 0,
                "use_time": 0,
                "card_type": 0,
                "stock": 0,
                "is_delete": 0,
                "create_time": 0,
            }
        }

class WarehouseCardDetail(BaseModel):
    id: int = Field(..., description="主键")
    commodity_id: int = Field(..., description="关联商品ID")
    title: str = Field(..., description="卡号 / 卡密内容")
    password: str = Field(default='', description="卡密密码（如无可留空）")
    is_used: int = Field(default=0, description="是否已使用: [0=否, 1=是]")
    order_id: int = Field(default=0, description="关联订单ID（使用后记录）")
    use_time: int = Field(default=0, description="使用时间（时间戳）")
    card_type: int = Field(default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock: int = Field(default=0, description="共享库存数量，仅在 card_type=1 时有效")
    is_delete: int = Field(default=0, description="是否删除")
    create_time: int = Field(default=0, description="创建时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "commodity_id": 0,
                "title": '',
                "password": '',
                "is_used": 0,
                "order_id": 0,
                "use_time": 0,
                "card_type": 0,
                "stock": 0,
                "is_delete": 0,
                "create_time": 0,
            }
        }

class WarehouseCardDelete(BaseModel):
    id: int = Field(..., description="主键ID")
