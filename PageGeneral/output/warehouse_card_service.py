
class WarehouseCardService:
    """ WarehouseCard服务类 """

    @classmethod
    async def lists(cls, params: schema.WarehouseCardSearchIn) -> PagingResult[schema.WarehouseCardListVo]:
        """
        WarehouseCard列表。

        Args:
            params (schema.WarehouseCardSearchIn): 查询参数。

        Returns:
            PagingResult[schema.WarehouseCardListVo]: 分页列表Vo。

        Author:
            zero
        """
        where = WarehouseCardModel.build_search(
            {
                "=": ["is_delete=0", "is_show"],
                "%like%": ["title"],
                # 你可根据需要自定义其他条件
            }, params.__dict__
        )

        _model = WarehouseCardModel.filter(is_delete=0).filter(*where).order_by("-sort", "-id")
        _pager = await WarehouseCardModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            schema=schema.WarehouseCardListVo,
            fields=WarehouseCardModel.without_field("is_delete,delete_time")
        )

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> schema.WarehouseCardDetailVo:
        """
        WarehouseCard详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            schema.WarehouseCardDetailVo: 详情Vo。

        Author:
            zero
        """
        data = await WarehouseCardModel.get(id=id_)
        return TypeAdapter(schema.WarehouseCardDetailVo).validate_python(data.__dict__)

    @classmethod
    async def add(cls, post: schema.WarehouseCardCreate):
        """
        WarehouseCard新增。

        Args:
            post (schema.WarehouseCardCreate): 新增参数。

        Author:
            zero
        """
        await WarehouseCardModel.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def edit(cls, post: schema.WarehouseCardUpdate):
        """
        WarehouseCard编辑。

        Args:
            post (schema.WarehouseCardUpdate): 编辑参数。

        Author:
            zero
        """
        _obj = await WarehouseCardModel.filter(id=post.id, is_delete=0).first().values("id")
        if not _obj:
            raise AppException("WarehouseCard不存在")

        params = post.dict()
        del params["id"]

        await WarehouseCardModel.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        WarehouseCard删除。

        Args:
            id_ (int): 主键ID。

        Author:
            zero
        """
        p = await WarehouseCardModel.filter(id=id_, is_delete=0).first().values("id")
        if not p:
            raise AppException("WarehouseCard不存在")

        await WarehouseCardModel.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))
