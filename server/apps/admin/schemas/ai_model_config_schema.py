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
from typing import Union
from pydantic import BaseModel, Field
from fastapi import Query


class AIModelConfigSearchIn(BaseModel):
    """ AI模型配置搜索参数 """
    page: int = Query(gt=0, default=1, description="当前页码")
    keyword: Union[str, None] = Query(default=None, description="搜索关键词")
    platform: Union[str, None] = Query(default=None, description="所属平台")
    is_active: Union[int, None] = Query(default=None, description="是否启用")


class AIModelConfigDetailIn(BaseModel):
    """ AI模型配置详情参数 """
    id: int = Query(..., gt=0, description="模型配置ID")


class AIModelConfigCreateIn(BaseModel):
    """ AI模型配置创建参数 """
    model_name: str = Field(..., min_length=1, max_length=50, description="模型名称")
    platform: str = Field(..., min_length=1, max_length=30, description="所属平台")
    prompt_template: str = Field(default="", description="预定义的Prompt模板")
    api_key: str = Field(default="", description="接口密钥")
    endpoint_url: str = Field(..., min_length=1, max_length=255, description="API调用地址")
    is_active: bool = Field(default=True, description="是否启用")
    max_tokens: int = Field(gt=0, default=2048, description="最大令牌数")
    temperature: float = Field(ge=0.0, le=2.0, default=0.7, description="生成内容的创造性")


class AIModelConfigUpdateIn(BaseModel):
    """ AI模型配置更新参数 """
    id: int = Field(..., gt=0, description="模型配置ID")
    model_name: str = Field(..., min_length=1, max_length=50, description="模型名称")
    platform: str = Field(..., min_length=1, max_length=30, description="所属平台")
    prompt_template: str = Field(default="", description="预定义的Prompt模板")
    api_key: str = Field(default="", description="接口密钥")
    endpoint_url: str = Field(..., min_length=1, max_length=255, description="API调用地址")
    is_active: bool = Field(default=True, description="是否启用")
    max_tokens: int = Field(gt=0, default=2048, description="最大令牌数")
    temperature: float = Field(ge=0.0, le=2.0, default=0.7, description="生成内容的创造性")


class AIModelConfigDeleteIn(BaseModel):
    """ AI模型配置删除参数 """
    id: int = Field(..., gt=0, description="模型配置ID")


class AIModelConfigStatusIn(BaseModel):
    """ AI模型配置状态参数 """
    id: int = Field(..., gt=0, description="模型配置ID")
    is_active: bool = Field(..., description="是否启用")


"""---------------❤︎华丽分割线❤︎---------------"""


class AIModelConfigVo(BaseModel):
    """ AI模型配置VO """
    id: int = Field(description="主键")
    model_name: str = Field(description="模型名称")
    platform: str = Field(description="所属平台")
    prompt_template: str = Field(description="预定义的Prompt模板")
    api_key: str = Field(description="接口密钥")
    endpoint_url: str = Field(description="API调用地址")
    is_active: bool = Field(description="是否启用")
    max_tokens: int = Field(description="最大令牌数")
    temperature: float = Field(description="生成内容的创造性")
    created_at: int = Field(description="创建时间")
    updated_at: int = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "model_name": "gpt-4",
                "platform": "OpenAI",
                "prompt_template": "你是一个助手",
                "api_key": "sk-...",
                "endpoint_url": "https://api.openai.com/v1/chat/completions",
                "is_active": True,
                "max_tokens": 2048,
                "temperature": 0.7,
                "created_at": 1620000000,
                "updated_at": 1620000000
            }
        }


class AIModelConfigListsVo(BaseModel):
    """ AI模型配置列表VO """
    id: int = Field(description="主键")
    model_name: str = Field(description="模型名称")
    platform: str = Field(description="所属平台")
    is_active: bool = Field(description="是否启用")
    max_tokens: int = Field(description="最大令牌数")
    temperature: float = Field(description="生成内容的创造性")
    created_at: int = Field(description="创建时间")
    updated_at: int = Field(description="更新时间")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "model_name": "gpt-4",
                "platform": "OpenAI",
                "is_active": True,
                "max_tokens": 2048,
                "temperature": 0.7,
                "created_at": 1620000000,
                "updated_at": 1620000000
            }
        }