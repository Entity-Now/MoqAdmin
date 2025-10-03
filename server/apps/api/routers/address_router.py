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
from fastapi import APIRouter, Request, Depends
from hypertext import R, response_json
from apps.api.schemas import address_schema as schema
from apps.api.service.address_service import AddressService

router = APIRouter(prefix="/address", tags=["地址管理"])


@router.get("/lists", summary="地址列表", response_model=R[list[schema.AddressListVo]])
@response_json
async def lists(request: Request):
    user_id: int = request.state.user_id
    return await AddressService.lists(user_id)


@router.get("/detail", summary="地址详情", response_model=R[schema.AddressDetailVo])
@response_json
async def detail(request: Request, params: schema.AddressDetailIn = Depends()):
    user_id: int = request.state.user_id
    return await AddressService.detail(user_id, params.id)


@router.post("/add", summary="添加地址", response_model=R)
@response_json
async def add(request: Request, params: schema.AddressAddIn):
    user_id: int = request.state.user_id
    return await AddressService.add(user_id, params)


@router.post("/edit", summary="编辑地址", response_model=R)
@response_json
async def edit(request: Request, params: schema.AddressEditIn):
    user_id: int = request.state.user_id
    return await AddressService.edit(user_id, params)


@router.post("/delete", summary="删除地址", response_model=R)
@response_json
async def delete(request: Request, params: schema.AddressDelIn):
    user_id: int = request.state.user_id
    return await AddressService.delete(user_id, params.id)


@router.post("/set_default", summary="设置默认地址", response_model=R)
@response_json
async def set_default(request: Request, params: schema.AddressSetDefaultIn):
    user_id: int = request.state.user_id
    return await AddressService.set_default(user_id, params.id)

@router.get("/current", summary="获取当前地址", response_model=R[schema.AddressDetailVo])
@response_json
async def current(request: Request):
    user_id: int = request.state.user_id
    return await AddressService.current(user_id)