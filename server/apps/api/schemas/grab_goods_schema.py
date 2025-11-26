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
from typing import List, Dict
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
    link: str = Field(description="链接地址")
    name: str = Field(description="链接名称")

    class Config:
        json_schema_extra = {
            "example": {
                "link": "/albums/123456",
                "name": "分类名称"
            }
        }


class GrabResultVo(BaseModel):
    """ 抓取结果Vo """
    total: int = Field(description="抓取数量")
    data: List[Dict[str, str]] = Field(description="抓取数据")
    file_path: str = Field(description="保存文件路径")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 10,
                "data": [
                    {
                        "link": "/albums/123456",
                        "name": "分类名称1"
                    },
                    {
                        "link": "/albums/789012",
                        "name": "分类名称2"
                    }
                ],
                "file_path": "./data/category_links.json"
            }
        }
