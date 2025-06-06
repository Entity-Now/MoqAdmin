from pydantic import BaseModel, Field

class CategorySearchIn(BaseModel):
    """ 分类搜索参数 """
    page_no: int = Query(gt=0, default=1, description="当前页码")
    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")
    title: Union[str, None] = Query(default=None, description="分类标题")

class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=50, description="分类名称")
    parent_id: int = Field(default=0, description="父级分类ID")
    sort: int = Field(default=0, description="排序")
    is_show: int = Field(default=1, description="是否显示: [0=否, 1=是]")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "电子产品",
                "parent_id": 0,
                "sort": 10,
                "is_show": 1
            }
        }

class CategoryUpdate(BaseModel):
    id: int = Field(..., gt=0, description="分类ID")
    name: str | None = Field(None, max_length=50, description="分类名称")
    parent_id: int | None = Field(None, description="父级分类ID")
    sort: int | None = Field(None, description="排序")
    is_show: int | None = Field(None, description="是否显示")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "name": "电子产品",
                "parent_id": 0,
                "sort": 10,
                "is_show": 1
            }
        }

class CategoryDetail(CategoryUpdate):
    """ 分类详情 """
    create_time: int = Field(..., description="创建时间")
    update_time: int = Field(..., description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "数码设备",
                "parent_id": 0,
                "sort": 10,
                "is_show": 1,
                "create_time": 1710000000,
                "update_time": 1710001000
            }
        }
