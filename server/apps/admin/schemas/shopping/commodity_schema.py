from pydantic import BaseModel, Field
from typing import Union, Dict, Any
from fastapi import Query

class CommoditySearchIn(BaseModel):
    """ 商品搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    cid: Union[int, None] = Query(default=None, description="类目ID")
    code: Union[str, None] = Query(default=None, description="商品编码")
    title: Union[str, None] = Query(default=None, description="商品标题")
    is_disable: Union[int, str, None] = Query(default=None, description="是否禁用: [0=否, 1=是]")
    
class CommodityCreate(BaseModel):
    cid: int = Field(..., description="类目ID")
    code: str = Field(..., max_length=50, description="商品编码")
    title: str = Field(..., max_length=250, description="商品标题")
    price: float = Field(..., description="价格")
    original_price: Union[float, None] = Field(None, description="原价")
    stock: int = Field(..., description="库存")
    sales: Union[int, None] = Field(None, description="销量")
    browse: Union[int, None] = Field(None, description="浏览")
    collect: Union[int, None] = Field(None, description="收藏")
    deliveryType: int = Field(..., description="发货方式: [0=快递, 1=自提, 2=人工发, 3=自动发]")
    main_image: Union[str, None] = Field(None, description="主图")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: list = Field(default_factory=list, description="封面图")
    intro: str = Field(default="", description="简介")
    link: str = Field(default="", description="商品链接")
    sort: int = Field(default=0, description="排序值")
    is_topping: int = Field(default=0, description="是否置顶")
    is_recommend: int = Field(default=0, description="是否推荐")
    is_show: int = Field(default=1, description="是否显示")
    config: Union[Dict[str, Any], None] = Field(default_factory=dict, description="动态配置")
    # 规格，JSON格式，例如：{"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]}
    sku: Union[Dict[str, Any], None] = Field(default_factory=dict, description="规格")
    use_sku_stock: int = Field(default=0, description="是否使用规格库存: [0=否, 1=是]")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cid": 1,
                "code": "123",
                "title": "无线蓝牙耳机",
                "price": 199.99,
                "original_price": 299.99,
                "stock": 50,
                "deliveryType": 0,
                "main_image": "http://example.com/image.jpg",
                "image": ["http://example.com/image.jpg"],
                "intro": "高清降噪，持久续航",
                "link": "http://example.com/product/1",
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black", "version": "pro"},
                "sku": {"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]},
                "use_sku_stock": 1
            }
        }

class CommodityUpdate(BaseModel):
    id: int = Field(..., gt=0, description="商品ID")
    code: Union[str, None] = Field(None, max_length=50, description="商品编码")
    cid: Union[int, None] = Field(None, description="类目ID")
    title: Union[str, None] = Field(None, max_length=250, description="商品标题")
    price: Union[float, None] = Field(None, description="价格")
    original_price: Union[float, None] = Field(None, description="原价")
    fee: Union[float, None] = Field(None, description="运费")
    stock: Union[int, None] = Field(None, description="库存")
    sales: Union[int, None] = Field(None, description="销量")
    browse: Union[int, None] = Field(None, description="浏览")
    collect: Union[int, None] = Field(None, description="收藏")
    deliveryType: Union[int, None] = Field(None, description="发货方式")
    main_image: Union[str, None] = Field(None, description="主图")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: Union[list, None] = Field(None, description="封面图")
    intro: Union[str, None] = Field(None, description="简介")
    link: Union[str, None] = Field(None, description="商品链接")
    sort: Union[int, None] = Field(None, description="排序值")
    is_topping: Union[int, None] = Field(None, description="是否置顶")
    is_recommend: Union[int, None] = Field(None, description="是否推荐")
    is_show: Union[int, None] = Field(None, description="是否显示")
    config: Union[Dict[str, Any], None] = Field(None, description="动态配置")
    # 规格，JSON格式，例如：{"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]}
    sku: Union[Dict[str, Any], None] = Field(None, description="规格")
    use_sku_stock: Union[int, None] = Field(None, description="是否使用规格库存: [0=否, 1=是]")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "code": "123",
                "cid": 1,
                "title": "无线蓝牙耳机",
                "price": 199.99,
                "original_price": 299.99,
                "fee": 10.0,
                "stock": 50,
                "deliveryType": 0,
                "main_image": "http://example.com/image.jpg",
                # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                "image": ["http://example.com/image.jpg"],
                "intro": "高清降噪，持久续航",
                "link": "http://example.com/product/1",
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black", "version": "pro"},
                "sku": {"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]},
                "use_sku_stock": 1
            }
        }

class CommodityDetail(CommodityUpdate):
    """ 商品详情 """
    create_time: str = Field(..., description="创建时间")
    update_time: str = Field(..., description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 101,
                "code": "123",
                "cid": 1,
                "title": "蓝牙耳机",
                "price": 199.99,
                "original_price": 299.99,
                "fee": 10.0,
                "stock": 50,
                "sales": 100,
                "deliveryType": 0,
                "main_image": "http://example.com/image.jpg",
                # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                "image": ["https://example.com/earbuds.jpg"],
                "intro": "高清降噪",
                "link": "https://example.com/product/101",
                "browse": 300,
                "collect": 80,
                "sort": 10,
                "is_topping": 0,
                "is_recommend": 1,
                "is_show": 1,
                "config": {"color": "black", "version": "pro"},
                "sku": {"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]},
                "use_sku_stock": 1,
                "create_time": '2025-06-10 09:09:28',
                "update_time": '2025-06-10 09:09:28'
            }
        }

class CommodityDeleteIn(BaseModel):
    """ 商品删除参数 """
    id: int = Field(gt=0, description="商品ID", examples=[1])

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1
            }
        }