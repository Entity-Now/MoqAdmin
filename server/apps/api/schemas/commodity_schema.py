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
from pydantic import BaseModel, Field, validator
from fastapi import Query


class CommoditySearchIn(BaseModel):
    """ 商品搜索参数 """
    page: int = Query(default=1, gt=0, description="页码")
    size: int = Query(default=10, gt=0, description="每页条数")
    categoryId: Union[int, None] = Query(default=None, description="所属分类")
    keyword: Union[str, None] = Query(default=None, description="搜索关键词")
    minPrice: Union[int, None] = Query(default=None, description="最低价格")
    maxPrice: Union[int, None] = Query(default=None, description="最高价格")


class CommodityDetailIn(BaseModel):
    """ 商品详情参数 """
    id: int = Query(..., gt=0, description="商品ID")


class CommodityCollectIn(BaseModel):
    """ 商品收藏参数 """
    id: int = Field(..., gt=0, description="商品ID")


class CommodityRelatedIn(BaseModel):
    """ 相关商品参数 """
    id: int = Query(..., gt=0, description="商品ID")


"""---------------❤︎华丽分割线❤︎---------------"""


class CommodityCategoryVo(BaseModel):
    """ 商品分类VO """
    id: int = Field(description="分类ID")
    name: str = Field(description="分类名称")
    image: Union[str, None] = Field(None, description="分类图片")
    parent_id: int = Field(description="父分类ID")
    # 可空，默认值为空列表
    children: List["CommodityCategoryVo"] = Field(default=[], description="子分类列表")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "电子产品",
                "image": "https://example.com/image.jpg",
                "parent_id": 0,
                "children": []
            }
        }


class CommodityListsVo(BaseModel):
    """ 商品列表Vo """
    id: int = Field(description="商品ID")
    category: str = Field(default="", description="所属类目")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: List[str] = Field(description="商品图片")
    title: str = Field(description="商品标题")
    intro: str = Field(description="商品简介")
    price: float = Field(description="商品价格")
    original_price: Union[float, None] = Field(None, description="原价")
    fee: Union[float, None] = Field(None, description="运费")
    stock: int = Field(description="库存数量")
    sales: int = Field(description="销量")
    browse: int = Field(description="浏览量")
    collect: int = Field(description="收藏量")
    config: Union[Dict[str, Any], None] = Field(None, description="动态配置")
    # 规格，JSON格式，例如：{"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]}
    sku: Union[Dict[str, Any], None] = Field(None, description="规格")
    is_recommend: int = Field(description="是否推荐: [0=否, 1=是]")
    is_topping: int = Field(description="是否置顶: [0=否, 1=是]")
    create_time: str = Field(description="创建时间")
    update_time: str = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "category": "电子产品",
                # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                "image": ["https://www.xx.com/images/product.jpg"],
                "title": "示例商品",
                "intro": "这是一个示例商品的简介",
                "price": 99.99,
                "original_price": 199.99,
                "fee": 10.0,
                "stock": 100,
                "sales": 50,
                "browse": 1000,
                "collect": 20,
                "is_recommend": 1,
                "is_topping": 0,    
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28",
                "config": None,
                "sku": None,
            }
        }


class CommodityPagesVo(BaseModel):
    """ 商品页面Vo """
    adv: List[Dict[str, str]] = Field(description="轮播广告")
    topping: List[CommodityListsVo] = Field(description="推荐商品")
    ranking: List[CommodityListsVo] = Field(description="排名商品") 

    class Config:
        json_schema_extra = {
            "example": {
                "adv": [
                    {
                        "title": "this is banner title",
                        "image": "https://www.xxx.com/ad.jpg",
                        "target": "_blank",
                        "url": "https://www.xxx.com"
                    }
                ],
                "topping": CommodityListsVo.model_config["json_schema_extra"]["example"],
                "ranking": CommodityListsVo.model_config["json_schema_extra"]["example"]
            }
        }


class CommodityDetailVo(BaseModel):
    """ 商品详情Vo """
    id: int = Field(description="商品ID")
    category: str = Field(description="所属类目")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    image: List[str] = Field(description="商品图片")
    title: str = Field(description="商品标题")
    intro: str = Field(description="商品简介")
    price: float = Field(description="商品价格")
    original_price: Union[float, None] = Field(None, description="原价")
    fee: Union[float, None] = Field(None, description="运费")
    stock: int = Field(description="库存数量")
    sales: int = Field(description="销量")
    deliveryType: int = Field(description="发货方式")
    browse: int = Field(description="浏览量")
    collect: int = Field(description="收藏量")
    config: Union[Dict[str, Any], None] = Field(None, description="动态配置")
    # 规格，JSON格式，例如：{"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]}
    sku: Union[Dict[str, Any], None] = Field(None, description="规格")
    is_collect: int = Field(description="是否收藏: [0=否, 1=是]")
    is_recommend: int = Field(description="是否推荐: [0=否, 1=是]")
    is_topping: int = Field(description="是否置顶: [0=否, 1=是]")
    create_time: str = Field(description="创建时间")
    update_time: str = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "category": "电子产品",
                # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                "image": ["https://www.xx.com/images/product.jpg"],
                "title": "示例商品",
                "intro": "这是一个示例商品的简介",
                "price": 99.99,
                "original_price": 199.99,
                "fee": 10.0,
                "stock": 100,
                "sales": 50,
                "deliveryType": 0,
                "browse": 1000,
                "collect": 20,
                "is_collect": 0,
                "is_recommend": 1,
                "is_topping": 0,
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28",
                "config": None,
                "sku": None,
            }
        }