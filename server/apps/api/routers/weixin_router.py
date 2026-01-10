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
import xmltodict
from typing import Dict
from fastapi import APIRouter, Request
from fastapi.responses import Response
from weixin.client import WeixinMpAPI
from hypertext import R, response_json
from plugins.wechat.configs import WeChatConfig
from apps.api.service.weixin_service import WeixinService
from apps.api.schemas.weixin_schema import TraceWaybillSchema, QueryTraceSchema, UpdateWaybillGoodsSchema

router = APIRouter(prefix="/weixin", tags=["微信接口"])


@router.api_route("/reply", summary="微信公众号回调")
async def reply(request: Request):
    params = request.query_params
    config: Dict[str, str] = await WeChatConfig.get_oa_config()
    api = WeixinMpAPI(
        appid=config.get("app_id"),
        app_secret=config.get("app_secret"),
        mp_token=config.get("token"),
        signature=params.get("signature", ""),
        timestamp=params.get("timestamp", ""),
        echostr=params.get("echostr", ""),
        nonce=params.get("nonce", ""),
    )

    if request.method == "GET":
        content = "fail" if not api.validate_signature() else params.get("echostr", "")
        return Response(content=content, media_type="text/plain")
    else:
        if not api.validate_signature():
            return Response(content="fail", media_type="application/xml")

        xml_json = await request.body()
        xml_dict = xmltodict.parse(xml_json).get("xml")
        messages = await WeixinService.reply(xml_dict)
        return Response(content=messages, media_type="application/xml")


@router.post("/trace_waybill", summary="传运单接口")
@response_json
async def trace_waybill(request: Request, orderId: str, sub_order_id: str):
    user_id: int = request.state.user_id
    return await WeixinService.trace_waybill(user_id, orderId, sub_order_id)


@router.post("/query_trace", summary="查询运单接口")
@response_json
async def query_trace(params: QueryTraceSchema):
    return await WeixinService.query_trace(params.dict())


@router.post("/update_waybill_goods", summary="更新运单货品信息接口")
@response_json
async def update_waybill_goods(params: UpdateWaybillGoodsSchema):
    return await WeixinService.update_waybill_goods(params.dict())
