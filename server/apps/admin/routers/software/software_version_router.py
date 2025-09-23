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
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.schemas.software import software_version_schema as schema
from apps.admin.service.software.software_version_service import SoftwareVersionService as service    

router = APIRouter(prefix="/software_version", tags=["SoftwareVersion"])


@router.get("/lists", summary="软件版本列表", response_model=R[schema.SoftwareVersionDetail])
@response_json
async def lists(params: schema.SoftwareVersionSearchIn = Depends()):
    return await service.lists(params)


@router.get("/select_software", summary="软件选项列表", response_model=R)
@response_json
async def select_software():
    return await service.select_software()


@router.get("/detail", summary="软件版本详情", response_model=R[schema.SoftwareVersionDetail])
@response_json
async def detail(id: int):
    return await service.detail(id)


@router.post("/add", summary="软件版本新增", response_model=R)
@response_json
async def add(params: schema.SoftwareVersionCreate):
    await service.add(params)


@router.post("/edit", summary="软件版本编辑", response_model=R)
@response_json
async def edit(params: schema.SoftwareVersionUpdate):
    await service.edit(params)


@router.post("/delete", summary="软件版本删除", response_model=R)
@response_json
async def delete(params: schema.SoftwareVersionDelete):
    await service.delete(params.id)