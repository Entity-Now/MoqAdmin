
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.schemas.software import software_schema as schema
from apps.admin.service.software.software_service import softwareService as service    

router = APIRouter(prefix="/software", tags=["Software"])


@router.get("/lists", summary="Software列表", response_model=R[schema.softwareDetail])
@response_json
async def lists(params: schema.softwareSearchIn = Depends()):
    return await service.lists(params)


@router.get("/selects", summary="SoftwareItems", response_model=R)
@response_json
async def selects():
    return await service.selected()


@router.post("/add", summary="Software新增", response_model=R)
@response_json
async def add(params: schema.softwareCreate):
    await service.add(params)


@router.post("/edit", summary="Software编辑", response_model=R)
@response_json
async def edit(params: schema.softwareUpdate):
    await service.edit(params)


@router.post("/delete", summary="Software删除", response_model=R)
@response_json
async def delete(params: schema.softwareDelete):
    await service.delete(params.id)
