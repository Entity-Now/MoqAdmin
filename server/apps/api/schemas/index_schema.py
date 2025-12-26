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
from typing import Dict, List, Union, Optional
from pydantic import BaseModel, Field
from fastapi import Query
from .article_schema import ArticleListsVo


class QueryPolicyIn(BaseModel):
    """ 发送短信参数"""
    type: str = Query(..., description="协议类型: [service,private,payment]")

    class Config:
        json_schema_extra = {
            "example": {
                "type": "service"
            }
        }


class SendSmsIn(BaseModel):
    """ 发送短信参数"""
    scene: int = Field(..., description="发送场景")
    mobile: str = Field(..., description="手机号码")

    class Config:
        json_schema_extra = {
            "example": {
                "scene": 101,
                "mobile": "13800138000"
            }
        }


class SendEmailIn(BaseModel):
    """ 发送邮件参数 """
    scene: int = Field(..., description="发送场景")
    email: str = Field(..., description="邮件号码")

    class Config:
        json_schema_extra = {
            "example": {
                "scene": 120,
                "mobile": "wait@163.com"
            }
        }


"""---------------❤︎华丽分割线❤︎---------------"""


class BannerListVo(BaseModel):
    """ 轮播列表Vo """
    title: str = Field(description="轮播标题")
    image: str = Field(description="轮播图片")
    target: str = Field(description="跳转方式")
    url: Optional[str] = Field(default=None, description="跳转链接")
    button: Optional[str] = Field(default=None, max_length=50, description="按钮文字")
    desc: Optional[str] = Field(default=None, description="轮播描述")
    secondImage: Optional[str] = Field(default=None, max_length=250, description="第二产品图")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "this is title",
                "image": "https://www.xxx.com//banner.jpg",
                "target": "_blank",
                "url": "https://www.xxx.com",
                "button": "",
                "desc": "",
                "secondImage": "",
            }
        }

class featureDetailVo(BaseModel):
    """特性详情Vo"""
    id: int = Field(description="功能ID")
    type: int = Field(description="功能类型")
    title: str = Field(description="功能标题")
    desc: str = Field(description="功能描述")
    icon: str = Field(description="功能图标")
    sort: int = Field(description="排序编号")
    is_disable: int = Field(description="是否禁用: [0=否, 1=是]")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "type": "news",
                "title": "新闻",
                "desc": "新闻",
                "icon": "mdi-close",
                "sort": 1,
                "is_disable": 0
            }
        }


class ProductVo(BaseModel):
    """ 商品Vo """
    id: int = Field(description="商品ID")
    title: str = Field(description="商品标题")
    image: str = Field(description="商品图片")
    price: float = Field(description="商品价格")
    intro: str = Field(description="商品简介")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Product Title",
                "image": "https://example.com/image.jpg",
                "price": 99.99,
                "intro": "Product Introduction"
            }
        }


class ProductCategoryVo(BaseModel):
    """ 商品分类Vo """
    id: int = Field(description="分类ID")
    title: str = Field(description="分类名称")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Category Title"
            }
        }


class HomingVo(BaseModel):
    """ 主页数据Vo """
    adv: List[object] = Field(description="广告宣传")
    banner: List[BannerListVo] = Field(description="轮播海报")
    feature: List[featureDetailVo] = Field(description="功能特性")
    questions: List[featureDetailVo] = Field(description="常见问题")
    lately: List[ArticleListsVo] = Field(description="最近更新")
    ranking: List[ArticleListsVo] = Field(description="排名榜单")
    topping: List[ArticleListsVo] = Field(description="置顶特推")
    everyday: List[ArticleListsVo] = Field(description="每日推荐")
    product_categories: List[ProductCategoryVo] = Field(description="商品分类")

    class Config:
        json_schema_extra = {
            "example": {
                "adv": BannerListVo.model_config["json_schema_extra"]["example"],
                "banner": BannerListVo.model_config["json_schema_extra"]["example"],
                "feature": featureDetailVo.model_config["json_schema_extra"]["example"],
                "questions": featureDetailVo.model_config["json_schema_extra"]["example"],
                "lately": ArticleListsVo.model_config["json_schema_extra"]["example"],
                "topping": ArticleListsVo.model_config["json_schema_extra"]["example"],
                "everyday": ArticleListsVo.model_config["json_schema_extra"]["example"],
                "product_categories": ProductCategoryVo.model_config["json_schema_extra"]["example"]
            }
        }


class ConfigVo(BaseModel):
    """ 全局配置Vo """
    login: Dict[str, object] = Field(description="登录配置")
    website: Dict[str, object] = Field(description="网站配置")
    pc: Dict[str, str] = Field(description="PC配置")
    recharge: Dict[str, Union[int, str, float]] = Field(description="充值配置")
    links: List[object] = Field(description="友情链接")

    class Config:
        json_schema_extra = {
            "example": {
                "login": {
                    "is_agreement": 1,
                    "disable_captcha": True,
                    "defaults": "account",
                    "register": ["mobile", "email"],
                    "means": ["account", "mobile"],
                    "oauth": ["wx"]
                },
                "website": {
                    "icp": "",
                    "pcp": "",
                    "domain": "",
                    "analyse": "",
                    "copyright": "",
                    "scripts": []
                },
                "pc": {
                    "logo": "https://www.xxx.com/logo_pc.png",
                    "favicon": "",
                    "title": "",
                    "keywords": "",
                    "description": "",
                    "qq": "",
                    "wechat": "",
                    "email": "",
                    "mobile": "",
                    "work_time": "",
                },
                "recharge": {
                    "status": 0,
                    "min_recharge": 0
                },
                "links": {
                    "id": 0,
                    "image": "https://www.xxx.com/logo_pc.png",
                    "title": "xxx",
                    "url" :"https://www.xxx.com",
                    "sort": 1,
                    "target": "_blank",
                    "is_disable": 0
                }
            }
        }


class PolicyVo(BaseModel):
    """ 政策协议Vo """
    content: str = Field(description="协议内容")

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Service Policy Content"
            }
        }


class UploadResultVo(BaseModel):
    """ 上传结果Vo """
    id: int = Field(description="主键")
    name: str = Field(description="文件名称")
    ext: str = Field(description="文件扩展")
    size: int = Field(description="文件大小")
    path: str = Field(description="文件路径")
    url: str = Field(description="访问路径")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 6,
                "name": "bot.png",
                "ext": "png",
                "size": 666857,
                "path": "storage/492bd.png",
                "url": "https://www.xxx.com/storage/492bd.png"
            }
        }
