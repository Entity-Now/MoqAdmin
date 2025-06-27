
router = APIRouter(prefix="/warehouse_card", tags=["Warehouse Card"])


@router.get("/lists", summary="Warehouse Card列表", response_model=R[schema.WarehouseCardDetail])
@response_json
async def lists(params: schema.WarehouseCardSearchIn = Depends()):
    return await service.lists(params)


@router.get("/selects", summary="Warehouse CardItems", response_model=R)
@response_json
async def selects():
    return await service.selected()


@router.post("/add", summary="Warehouse Card新增", response_model=R)
@response_json
async def add(params: schema.WarehouseCardCreate):
    await service.add(params)


@router.post("/edit", summary="Warehouse Card编辑", response_model=R)
@response_json
async def edit(params: schema.WarehouseCardUpdate):
    await service.edit(params)


@router.post("/delete", summary="Warehouse Card删除", response_model=R)
@response_json
async def delete(params: schema.WarehouseCardDelete):
    await service.delete(params.id)
