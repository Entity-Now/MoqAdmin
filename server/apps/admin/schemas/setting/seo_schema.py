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
from typing import List, Optional
from pydantic import BaseModel, Field


class BaiduParam(BaseModel):
    """ 百度SEO参数 """
    site: str = Field(..., description="网站域名")
    token: str = Field(..., description="token")


class BaiduSubmitVo(BaseModel):
    """ 百度SEO提交响应 """
    remain: int = Field(default=0, description="剩余次数")
    success: int = Field(default=0, description="成功次数")
    not_same_site: List[str] = Field(default_factory=list, description="由于不是本站url而未处理的url列表")
    not_valid: List[str] = Field(default_factory=list, description="不合法的url列表")


class BingParam(BaseModel):
    """ Bing SEO参数 """
    siteUrl: str = Field(..., description="网站域名")
    apikey: str = Field(..., description="token")


class BingSubmitVo(BaseModel):
    """ Bing SEO提交响应 """
    d: Optional[dict] = Field(default=None, description="响应数据")
