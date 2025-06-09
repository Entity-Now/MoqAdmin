from pydantic import BaseModel, Field

class LinksListVo(BaseModel):
    """ 友情链接列表Vo """
    id: int = Field(description="友链ID")
    title: str = Field(description="友链名称")
    image: str = Field(description="友链图标")
    target: str = Field(description="跳转方式")
    url: str = Field(description="跳转链接")
    sort: int = Field(description="排序编号")
    is_disable: int = Field(description="是否禁用: [0=否, 1=是]")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "ThinkPHP",
                "image": "https://xx.com/tp.png",
                "target": "_blank",
                "url": "https://www.thinkphp.cn",
                "sort": 0,
                "is_disable": 0,
            }
        }