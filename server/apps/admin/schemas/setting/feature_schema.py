from typing import Union, Optional
from fastapi import Query
from pydantic import BaseModel, Field

class featureSearchIn(BaseModel):
    """ 特性搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    title: Union[str, None] = Query(default=None, description="特性名")
    type: Union[int, None] = Query(default=None, description="功能类型")
    is_disable: Union[str, None] = Query(default=None, description="是否禁用")

class featureAddIn(BaseModel):
    type: int = Field(ge=0, default=0,  description="功能类型")
    title: str = Field(max_length=200, default="", description="功能标题")
    desc: str = Field(max_length=250, default="", description="功能描述")
    icon: str = Field(max_length=250, default="", description="功能图标")
    sort: int = Field(default=0, description="排序编号")
    is_disable: int = Field(default=0, description="是否禁用: [0=否, 1=是]")
    
    @classmethod
    def messages(cls):
        return {
            "title.max_length": "标题不能超出200个字符",
            "icon.max_length": "图标链接不能超出250个字符",
            "sort.ge": "排序号不能少于0",
            "sort.le": "排序号不能大于999999"
        }
        
        
    class Config:
        json_schema_extra = {
            "example": {
                "type": "news",
                "title": "新闻",
                "desc": "新闻",
                "icon": "mdi-close",
                "sort": 1,
                "is_disable": 0,
            }
        }
    
class featureUpdateIn(featureAddIn):
    id: int = Query(..., description="功能ID")
    
class featureDeleteIn(BaseModel):
    id: int = Query(..., description="功能ID")
    
class featureDetailIn(BaseModel):
    id: int = Query(..., description="功能ID")
    
class featureList(BaseModel):
    """特性列表"""
    id: int = Field(description="功能ID")
    type: int = Field(description="功能类型")
    title: str = Field(description="功能标题")
    desc: str = Field(description="功能描述")
    icon: str = Field(description="功能图标")
    sort: int = Field(description="排序编号")
    is_disable: int = Field(description="是否禁用: [0=否, 1=是]")
    create_time: str = Field(description="创建时间")
    update_time: str = Field(description="更新时间")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "type": "news",
                "title": "新闻",
                "desc": "新闻",
                "icon": "mdi-close",
                "sort": 1,
                "is_disable": 0,
                "create_time": "2021-01-01 00:00:00",
                "update_time": "2021-01-01 00:00:00"
            }
        }

# vo 表示（Value Object）
# in 表示 （Input）

class featureSiteVo(BaseModel):
    id: int = Field(description="ID")
    name: str = Field(description="名称")
    
class featureDetailVo(BaseModel):
    """特性详情Vo"""
    id: int = Field(description="功能ID")
    type: int = Field(description="功能类型")
    title: str = Field(description="功能标题")
    desc: str = Field(description="功能描述")
    icon: str = Field(description="功能图标")
    sort: int = Field(description="排序编号")
    is_disable: int = Field(description="是否禁用: [0=否, 1=是]")
    create_time: str = Field(description="创建时间")
    update_time: str = Field(description="更新时间")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "type": "news",
                "title": "新闻",
                "desc": "新闻",
                "icon": "mdi-close",
                "sort": 1,
                "is_disable": 0,
                "create_time": "2021-01-01 00:00:00",
                "update_time": "2021-01-01 00:00:00"
            }
        }