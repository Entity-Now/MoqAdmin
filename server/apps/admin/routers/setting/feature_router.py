from typing import List
from fastapi import APIRouter, Depends
from hypertext import R, PagingResult, response_json
from apps.admin.schemas.setting import feature_schema as schema
from apps.admin.service.setting.feature_service import FeatureService


router = APIRouter(prefix="/feature", tags=["feature"])


@router.get("/sites", summary="获取特性类型", response_model=R[List[schema.featureSiteVo]])
@response_json
async def sites() -> List[schema.featureSiteVo]:
    return await FeatureService.sites()

@router.get("/detail", summary="获取详情内容", response_model=R[schema.featureDetailVo])
@response_json
async def detail(params: schema.featureDetailIn = Depends()):
    return await FeatureService.detail(params.id)

@router.get("/lists", summary="获取特性列表", response_model=R[PagingResult[schema.featureList]])
@response_json
async def lists(param: schema.featureSearchIn = Depends()):
    return await FeatureService.lists(param)

@router.post("/add", summary="添加特性", response_model=R)
@response_json
async def add(param: schema.featureAddIn):
    return await FeatureService.add(param)

@router.post("/edit", summary="更新特性", response_model=R)
@response_json
async def edit(param: schema.featureUpdateIn):
    return await FeatureService.edit(param)
    

@router.post("/delete", summary="删除特性", response_model=R)
@response_json
async def delete(params: schema.featureDeleteIn):
    return await FeatureService.delete(params)