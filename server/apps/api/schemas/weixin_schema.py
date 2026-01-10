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
from typing import Dict


class TraceWaybillSchema(BaseModel):
    openid: str = Field(..., description="用户openid")
    receiver_phone: str = Field(..., description="收件人手机号")
    trans_id: str = Field(..., description="交易ID")
    waybill_id: str = Field(..., description="运单ID")
    delivery_id: str = Field(..., description="快递公司ID")
    goods_info: Dict = Field(..., description="商品信息")


class QueryTraceSchema(BaseModel):
    openid: str = Field(..., description="用户openid")
    waybill_token: str = Field(..., description="运单token")


class UpdateWaybillGoodsSchema(BaseModel):
    openid: str = Field(..., description="用户openid")
    waybill_token: str = Field(..., description="运单token")
    goods_info: Dict = Field(..., description="商品信息")
