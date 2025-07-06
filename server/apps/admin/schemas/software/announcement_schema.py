from pydantic import BaseModel, Field
from typing import Union
from fastapi import Query
class announcementSearchIn(BaseModel):
    """ announcement搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    software_id: Union[int, None] = Query(default=None, description="所属软件 ID")
    title: Union[str, None] = Query(default=None, description="公告标题")
    is_pinned: Union[bool, None] = Query(default=False, description="是否置顶显示")
    is_show: Union[bool, None] = Query(default=True, description="是否置顶显示")


class announcementCreate(BaseModel):
    software_id: int = Field(..., description="所属软件 ID")
    title: str = Field(..., description="公告标题")
    content: str = Field(..., description="公告内容")
    is_pinned: bool = Field(default=False, description="是否置顶显示")
    is_show: bool = Field(default=True, description="是否置顶显示")

    class Config:
        json_schema_extra = {
            "example": {
                "software_id": 0,
                "title": '',
                "content": '',
                "is_pinned": False,
                "is_show": True,
            }
        }

class announcementUpdate(BaseModel):
    id: int = Field(..., description="主键 ID")
    software_id: int = Field(..., description="所属软件 ID")
    title: str = Field(..., description="公告标题")
    content: str = Field(..., description="公告内容")
    is_pinned: bool = Field(default=False, description="是否置顶显示")
    is_show: bool = Field(default=True, description="是否置顶显示")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "software_id": 0,
                "title": '',
                "content": '',
                "is_pinned": False,
                "is_show": True,
            }
        }

class announcementDetail(BaseModel):
    id: int = Field(..., description="主键 ID")
    software_id: int = Field(..., description="所属软件 ID")
    title: str = Field(..., description="公告标题")
    content: str = Field(..., description="公告内容")
    is_pinned: bool = Field(default=False, description="是否置顶显示")
    is_show: bool = Field(default=True, description="是否置顶显示")
    create_time: str = Field(default=0, description="创建时间")
    update_time: str = Field(default=0, description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "software_id": 0,
                "title": '',
                "content": '',
                "is_pinned": False,
                "is_show": True,
                "create_time": "2024-04-18 11:22:33",
                "update_time": "2024-04-18 11:22:33"
            }
        }

class announcementDelete(BaseModel):
    id: int = Field(..., description="主键ID")
