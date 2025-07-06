from pydantic import BaseModel, Field
from typing import Union
from fastapi import Query

class softwareSearchIn(BaseModel):
    """ software搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    name: Union[str, None] = Query(default=None, description="软件名称")
    is_show: Union[bool, None] = Query(default=True, description="是否启用")


class softwareCreate(BaseModel):
    name: str = Field(..., description="软件名称")
    identifier: str = Field(..., description="软件唯一标识，例如 com.example.app")
    icon_url: str = Field(default=None, description="软件图标 URL")
    description: str = Field(default=None, description="软件简要介绍")
    is_show: bool = Field(default=True, description="是否启用")

    class Config:
        json_schema_extra = {
            "example": {
                "name": '',
                "identifier": '',
                "icon_url": '',
                "description": '',
                "is_show": True
            }
        }

class softwareUpdate(BaseModel):
    id: int = Field(..., description="主键 ID")
    name: str = Field(..., description="软件名称")
    identifier: str = Field(..., description="软件唯一标识，例如 com.example.app")
    icon_url: str = Field(default=None, description="软件图标 URL")
    description: str = Field(default=None, description="软件简要介绍")
    is_show: bool = Field(default=True, description="是否启用")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "name": '',
                "identifier": '',
                "icon_url": '',
                "description": '',
                "is_show": True,
            }
        }

class softwareDetail(BaseModel):
    id: int = Field(..., description="主键 ID")
    name: str = Field(..., description="软件名称")
    identifier: str = Field(..., description="软件唯一标识，例如 com.example.app")
    icon_url: str = Field(default=None, description="软件图标 URL")
    description: str = Field(default=None, description="软件简要介绍")
    is_show: bool = Field(default=True, description="是否启用")
    create_time: str = Field(default=0, description="创建时间")
    update_time: str = Field(default=0, description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "name": '',
                "identifier": '',
                "icon_url": '',
                "description": '',
                "is_show": True,
                "create_time": "2024-04-18 11:22:33",
                "update_time": "2024-04-18 11:22:33"
            }
        }

class softwareDelete(BaseModel):
    id: int = Field(..., description="主键ID")
