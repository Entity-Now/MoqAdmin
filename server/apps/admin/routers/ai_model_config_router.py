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
from typing import List
from fastapi import APIRouter, Depends
from hypertext import R, response_json, PagingResult
from apps.admin.schemas import ai_model_config_schema as schema
from apps.admin.service.ai_model_config_service import AIModelConfigService

router = APIRouter(prefix="/ai-model-config", tags=["AI模型配置"])


@router.get("/lists", summary="AI模型配置列表", response_model=PagingResult[schema.AIModelConfigListsVo])
@response_json
async def lists(params: schema.AIModelConfigSearchIn = Depends()):
    return await AIModelConfigService.lists(params)


@router.get("/detail", summary="AI模型配置详情", response_model=schema.AIModelConfigVo)
@response_json
async def detail(params: schema.AIModelConfigDetailIn = Depends()):
    return await AIModelConfigService.detail(params.id)


@router.post("/create", summary="创建AI模型配置", response_model=R)
@response_json
async def create(params: schema.AIModelConfigCreateIn):
    await AIModelConfigService.create(params)
    return R.success(message="创建成功")


@router.post("/update", summary="更新AI模型配置", response_model=R)
@response_json
async def update(params: schema.AIModelConfigUpdateIn):
    await AIModelConfigService.update(params)
    return R.success(message="更新成功")


@router.post("/delete", summary="删除AI模型配置", response_model=R)
@response_json
async def delete(params: schema.AIModelConfigDeleteIn):
    await AIModelConfigService.delete(params.id)
    return R.success(message="删除成功")


@router.post("/status", summary="更改AI模型配置状态", response_model=R)
@response_json
async def status(params: schema.AIModelConfigStatusIn):
    await AIModelConfigService.change_status(params.id, params.is_active)
    return R.success(message="状态更新成功")


@router.get("/active-list", summary="获取所有启用的AI模型配置", response_model=R[List[schema.AIModelConfigVo]])
@response_json
async def active_list():
    return await AIModelConfigService.get_all_active()