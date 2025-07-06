
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.schemas.software import announcement_schema as schema
from apps.admin.service.software.announcement_service import announcementService as service    

router = APIRouter(prefix="/announcement", tags=["Announcement"])


@router.get("/lists", summary="Announcement列表", response_model=R[schema.announcementDetail])
@response_json
async def lists(params: schema.announcementSearchIn = Depends()):
    return await service.lists(params)


@router.post("/add", summary="Announcement新增", response_model=R)
@response_json
async def add(params: schema.announcementCreate):
    await service.add(params)


@router.post("/edit", summary="Announcement编辑", response_model=R)
@response_json
async def edit(params: schema.announcementUpdate):
    await service.edit(params)


@router.post("/delete", summary="Announcement删除", response_model=R)
@response_json
async def delete(params: schema.announcementDelete):
    await service.delete(params.id)
