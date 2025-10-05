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
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import Query
from .commodity_schema import CommodityListsVo


class MiniHomePagesVo(BaseModel):
    """ MiniHome页面数据Vo """
    banner: List["BannerListVo"] = Field(description="轮播图数据")
    goods: List[CommodityListsVo] = Field(description="推荐商品数据")
    quickEnter: List["BannerListVo"] = Field(description="快速入口数据")


class BannerListVo(BaseModel):
    """ 轮播列表Vo """
    title: str = Field(description="轮播标题")
    image: str = Field(description="轮播图片")
    target: str = Field(description="跳转方式")
    url: Optional[str] = Field(default=None, description="跳转链接")
    button: Optional[str] = Field(default=None, max_length=50, description="按钮文字")
    desc: Optional[str] = Field(default=None, description="轮播描述")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "this is title",
                "image": "https://www.xxx.com//banner.jpg",
                "target": "_blank",
                "url": "https://www.xxx.com",
                "button": "",
                "desc": "",
            }
        }


class GoodsListIn(BaseModel):
    """ 商品列表请求参数 """
    page: int = Query(default=1, gt=0, description="页码")
    size: int = Query(default=10, gt=0, description="每页条数")
    type: Optional[str] = Query(default="recommend", description="推荐类型: [recommend=推荐, topping=置顶, ranking=排行]")

    class Config:
        json_schema_extra = {
            "example": {
                "page": 1,
                "size": 10,
                "type": "recommend"
            }
        }


class GoodsListVo(BaseModel):
    """ 商品列表响应Vo """
    list: List[CommodityListsVo] = Field(description="商品列表数据")
    total: int = Field(description="总条数")
    page: int = Field(description="当前页码")
    size: int = Field(description="每页条数")