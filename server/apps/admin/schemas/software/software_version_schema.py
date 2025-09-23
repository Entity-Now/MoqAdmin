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
from pydantic import BaseModel, Field
from typing import Union
from fastapi import Query


class SoftwareVersionSearchIn(BaseModel):
    """ 软件版本搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    software_id: Union[int, None] = Query(default=None, description="软件ID")
    version: Union[str, None] = Query(default=None, description="版本号")
    is_show: Union[bool, None] = Query(default=None, description="是否启用")


class SoftwareVersionCreate(BaseModel):
    software_id: int = Field(..., description="软件ID")
    version: str = Field(..., description="版本号")
    title: str = Field(..., description="版本标题")
    description: str = Field(default=None, description="版本描述")
    download_type: int = Field(..., description="下载类型: [1=外站链接, 2=本站附件]")
    download_url: str = Field(default=None, description="外站链接")
    attach_id: int = Field(default=0, description="附件ID")
    is_show: bool = Field(default=True, description="是否启用")
    is_latest: bool = Field(default=False, description="是否最新版本")

    class Config:
        json_schema_extra = {
            "example": {
                "software_id": 1,
                "version": "1.0.0",
                "title": "新版本发布",
                "description": "新增功能...",
                "download_type": 1,
                "download_url": "https://example.com/download",
                "attach_id": 0,
                "is_show": True,
                "is_latest": False
            }
        }


class SoftwareVersionUpdate(BaseModel):
    id: int = Field(..., description="主键 ID")
    software_id: int = Field(..., description="软件ID")
    version: str = Field(..., description="版本号")
    title: str = Field(..., description="版本标题")
    description: str = Field(default=None, description="版本描述")
    download_type: int = Field(..., description="下载类型: [1=外站链接, 2=本站附件]")
    download_url: str = Field(default=None, description="外站链接")
    attach_id: int = Field(default=0, description="附件ID")
    is_show: bool = Field(default=True, description="是否启用")
    is_latest: bool = Field(default=False, description="是否最新版本")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "software_id": 1,
                "version": "1.0.0",
                "title": "新版本发布",
                "description": "新增功能...",
                "download_type": 1,
                "download_url": "https://example.com/download",
                "attach_id": 0,
                "is_show": True,
                "is_latest": False
            }
        }


class SoftwareVersionDetail(BaseModel):
    id: int = Field(..., description="主键 ID")
    software_id: int = Field(..., description="软件ID")
    software_name: str = Field(..., description="软件名称")
    version: str = Field(..., description="版本号")
    title: str = Field(..., description="版本标题")
    description: str = Field(default=None, description="版本描述")
    download_type: int = Field(..., description="下载类型: [1=外站链接, 2=本站附件]")
    download_url: str = Field(default=None, description="外站链接")
    attach_id: int = Field(default=0, description="附件ID")
    attach_info: dict = Field(default=None, description="附件信息")
    is_show: bool = Field(default=True, description="是否启用")
    is_latest: bool = Field(default=False, description="是否最新版本")
    create_time: str = Field(default=0, description="创建时间")
    update_time: str = Field(default=0, description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "software_id": 1,
                "software_name": "测试软件",
                "version": "1.0.0",
                "title": "新版本发布",
                "description": "新增功能...",
                "download_type": 1,
                "download_url": "https://example.com/download",
                "attach_id": 0,
                "attach_info": None,
                "is_show": True,
                "is_latest": False,
                "create_time": "2024-04-18 11:22:33",
                "update_time": "2024-04-18 11:22:33"
            }
        }


class SoftwareVersionDelete(BaseModel):
    id: int = Field(..., description="主键ID")