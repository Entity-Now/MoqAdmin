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

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "电子产品"
            }
        }


class CommodityListsVo(BaseModel):
    """ 商品列表Vo """
    id: int = Field(description="商品ID")
    category: str = Field(default="", description="所属类目")
    image: str = Field(description="商品图片")
    title: str = Field(description="商品标题")
    intro: str = Field(description="商品简介")
    price: float = Field(description="商品价格")
    stock: int = Field(description="库存数量")
    sales: int = Field(description="销量")
    browse: int = Field(description="浏览量")
    collect: int = Field(description="收藏量")
    is_recommend: int = Field(description="是否推荐: [0=否, 1=是]")
    is_topping: int = Field(description="是否置顶: [0=否, 1=是]")
    create_time: str = Field(description="创建时间")
    update_time: str = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "category": "电子产品",
                "image": "https://www.xx.com/images/product.jpg",
                "title": "示例商品",
                "intro": "这是一个示例商品的简介",
                "price": 99.99,
                "stock": 100,
                "sales": 50,
                "browse": 1000,
                "collect": 20,
                "is_recommend": 1,
                "is_topping": 0,
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28",
            }
        }


class CommodityPagesVo(BaseModel):
    """ 商品页面Vo """
    lists: List[CommodityListsVo] = Field(description="商品列表")
    total: int = Field(description="总条数")
    page: int = Field(description="当前页码")
    size: int = Field(description="每页条数")

    class Config:
        json_schema_extra = {
            "example": {
                "lists": [CommodityListsVo.model_config["json_schema_extra"]["example"]],
                "total": 100,
                "page": 1,
                "size": 10
            }
        }


class CommodityDetailVo(BaseModel):
    """ 商品详情Vo """
    id: int = Field(description="商品ID")
    category: str = Field(description="所属类目")
    image: str = Field(description="商品图片")
    title: str = Field(description="商品标题")
    intro: str = Field(description="商品简介")
    content: str = Field(description="商品内容")
    price: float = Field(description="商品价格")
    stock: int = Field(description="库存数量")
    sales: int = Field(description="销量")
    deliveryType: int = Field(description="发货方式")
    browse: int = Field(description="浏览量")
    collect: int = Field(description="收藏量")
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
                "image": "https://www.xx.com/images/product.jpg",
                "title": "示例商品",
                "intro": "这是一个示例商品的简介",
                "content": "<p>这是商品的详细内容</p>",
                "price": 99.99,
                "stock": 100,
                "sales": 50,
                "deliveryType": 0,
                "browse": 1000,
                "collect": 20,
                "is_collect": 0,
                "is_recommend": 1,
                "is_topping": 0,
                "create_time": "2023-03-08 21:28:28",
                "update_time": "2023-03-08 21:28:28"
            }
        }