from pydantic import BaseModel, Field

class CommodityCreate(BaseModel):
    cid: int = Field(..., description="类目ID")
    title: str = Field(..., max_length=100, description="商品标题")
    price: float = Field(..., description="价格")
    stock: int = Field(..., description="库存")
    deliveryType: int = Field(..., description="发货方式: [0=快递, 1=自提, 2=人工发, 3=自动发]")
    delivery: int = Field(default=0, description="发货状态")
    image: str = Field(default="", description="封面图")
    intro: str = Field(default="", description="简介")
    link: str = Field(default="", description="商品链接")
    sort: int = Field(default=0, description="排序值")
    is_topping: int = Field(default=0, description="是否置顶")
    is_recommend: int = Field(default=0, description="是否推荐")
    is_show: int = Field(default=1, description="是否显示")
    config: dict = Field(default_factory=dict, description="动态配置")

    class Config:
        json_schema_extra = {
            "example": {
                "cid": 1,
                "title": "无线蓝牙耳机",
                "price": 199.99,
                "stock": 50,
                "deliveryType": 0,
                "image": "http://example.com/image.jpg",
                "intro": "高清降噪，持久续航",
                "link": "http://example.com/product/1",
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black", "version": "pro"}
            }
        }

class CommodityUpdate(BaseModel):
    id: int = Field(..., gt=0, description="商品ID")
    cid: int | None = Field(None, description="类目ID")
    title: str | None = Field(None, max_length=100, description="商品标题")
    price: float | None = Field(None, description="价格")
    stock: int | None = Field(None, description="库存")
    deliveryType: int | None = Field(None, description="发货方式")
    delivery: int | None = Field(None, description="发货状态")
    image: str | None = Field(None, description="封面图")
    intro: str | None = Field(None, description="简介")
    link: str | None = Field(None, description="商品链接")
    sort: int | None = Field(None, description="排序值")
    is_topping: int | None = Field(None, description="是否置顶")
    is_recommend: int | None = Field(None, description="是否推荐")
    is_show: int | None = Field(None, description="是否显示")
    config: dict | None = Field(None, description="动态配置")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "cid": 1,
                "title": "无线蓝牙耳机",
                "price": 199.99,
                "stock": 50,
                "deliveryType": 0,
                "image": "http://example.com/image.jpg",
                "intro": "高清降噪，持久续航",
                "link": "http://example.com/product/1",
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black", "version": "pro"}
            }
        }

class CommodityDetail(CommodityUpdate):
    """ 商品详情 """
    create_time: int = Field(..., description="创建时间")
    update_time: int = Field(..., description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 101,
                "cid": 1,
                "title": "蓝牙耳机",
                "price": 199.99,
                "stock": 50,
                "sales": 100,
                "deliveryType": 0,
                "delivery": 0,
                "image": "https://example.com/earbuds.jpg",
                "intro": "高清降噪",
                "link": "https://example.com/product/101",
                "browse": 300,
                "collect": 80,
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black"},
                "create_time": 1710000000,
                "update_time": 1710001000
            }
        }
