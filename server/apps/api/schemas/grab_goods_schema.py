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
from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from fastapi import Query


class GrabCategoryIn(BaseModel):
    """ 抓取分类参数 """
    url: str = Field(default="https://youki0131.x.yupoo.com/categories", description="目标网页URL")

    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://youki0131.x.yupoo.com/categories"
            }
        }


class CategoryLinkVo(BaseModel):
    """ 分类链接Vo """
    id: Optional[str] = Field(None, description="ID")
    parentId: Optional[str] = Field(None, description="父ID")
    code: Optional[str] = Field(None, description="编码")
    link: str = Field(description="链接地址")
    name: str = Field(description="链接名称")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123456",
                "parentId": "123456",
                "code": "123456",
                "link": "/albums/123456",
                "name": "分类名称"
            }
        }


class GrabResultVo(BaseModel):
    """ 抓取结果Vo """
    total: int = Field(description="抓取数量")
    data: List[CategoryLinkVo] = Field(description="抓取数据")
    file_path: str = Field(description="保存文件路径")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 10,
                "data": [
                    {
                        "id": "123456",
                        "parentId": "123456",
                        "code": "123456",
                        "link": "/albums/123456",
                        "name": "分类名称1"
                    },
                    {
                        "id": "789012",
                        "parentId": "789012",
                        "code": "789012",
                        "link": "/albums/789012",
                        "name": "分类名称2"
                    }
                ],
                "file_path": "./data/category_links.json"
            }
        }


class GoodsDetailVo(BaseModel):
    """ 商品详情Vo """
    id: Optional[str] = Field(description="ID")
    parentId: Optional[str] = Field(default=None, description="父ID")
    code: Optional[str] = Field(default=None, description="编码")
    mainImage: Optional[str] = Field(default=None, description="主图")
    imageUrls: List[str] = Field(description="图片URL数组")
    articleNo: Optional[str] = Field(default=None, description="货号")
    sizes: Optional[str] = Field(default=None, description="尺码")
    breadcrumbTitle: Optional[str] = Field(default=None, description="面包屑标题")
    goodsTitle: Optional[str] = Field(default=None, description="商品标题")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123456",
                "parentId": "123456",
                "code": "123456",
                "mainImage": "https://example.com/image1.jpg",
                "imageUrls": [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg"
                ],
                "articleNo": "553558 030",
                "sizes": "35.5 36 36.5 37.5 38 38.5 39 40",
                "breadcrumbTitle": "Air Jordan 1",
                "goodsTitle": "Air Jordan 1 Low Light Smoke Grey"
            }
        }


class GoodsDetailResultVo(BaseModel):
    """ 商品详情抓取结果Vo """
    total: int = Field(description="抓取数量")
    data: List[GoodsDetailVo] = Field(description="商品详情数据")
    file_path: str = Field(description="保存文件路径")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 5,
                "data": [
                    {
                        "id": "123456",
                        "parentId": "123456",
                        "code": "123456",
                        "mainImage": "https://example.com/image1.jpg",
                        "imageUrls": ["https://example.com/image1.jpg"],
                        "articleNo": "553558 030",
                        "sizes": "35.5 36 36.5 37.5 38",
                        "breadcrumbTitle": "Air Jordan 1",
                        "goodsTitle": "Air Jordan 1 Low Light Smoke Grey"
                    }
                ],
                "file_path": "./data/goods_details.json"
            }
        }
