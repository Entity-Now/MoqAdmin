import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import WarehouseCard
from apps.admin.schemas.shopping import warehouse_card_schema as schema
from apps.admin.schemas.common_schema import SelectItem


class WarehouseCardService:
    
    @classmethod
    async def list(cls, param: schema.WarehouseCardSearchIn) ->  PagingResult[schema.WarehouseCardDetail]:
        """库存列表

        Args:
            param (schema.WarehouseCardSearchIn): 搜索参数

        Returns:
            PagingResult[schema.WarehouseCardDetail]: 返回一个库存的列表
        """
        where = WarehouseCard.build_search({
            "=": ["is_used", "card_type", "is_delete"],
            "%like%": ["title", "order_id"]
        }, param.__dict__)

        _model = WarehouseCard.filter(is_delete=0).filter(*where).order_by("-create_time", "-id")
        _pager = await WarehouseCard.paginate(
            model=_model,
            page_no=param.page_no,
            page_size=param.page_size,
            schema=schema.WarehouseCardDetail,
            fields=WarehouseCard.without_field("is_delete,delete_time")
        )
        
        return _pager

    @classmethod
    async def selected(cls) -> List[SelectItem]:
        """查询库存的options列表"""
        
        selects = await WarehouseCard.filter(is_delete=0).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results
        

    @classmethod
    async def add(cls, post: schema.WarehouseCardCreate):
        """添加库存

        Args:
            post (schema.WarehouseCardCreate): 库存实体

        Returns:
            无返回值，方法不报错即为执行成功
        """

        cate = WarehouseCard.filter(title=post.title).first()
        if not cate:
            raise AppException(f"卡号为{post.title}的库存已经存在！")

        insertRes = await WarehouseCard.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )


    @classmethod
    async def edit(cls, post: schema.WarehouseCardUpdate):
        """
        库存编辑
        :param post: 库存编辑参数
        :return: 无返回值，方法不报错即为执行成功
        """

        _post = await WarehouseCard.filter(id=post.id, is_delete=0).first().values("id")
        if not _post:
            raise AppException("库存不存在")

        _post3 = await WarehouseCard.filter(title=post.title, id__not=post.id, is_delete=0).values("id")
        if _post3:
            raise AppException("库存名称已被占用")

        params = post.dict()
        del params["id"]

        updateRes = await WarehouseCard.filter(id=post.id).update(
            **params,
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个库存
        :param id_: 库存的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await WarehouseCard.filter(id=id_, is_delete=0).first().values("id")
        if not p:
            raise AppException("库存不存在")

        admin = await WarehouseCard.filter(cid=id_, is_delete=0).first().values("id")
        if admin:
            raise AppException("库存已被使用不能删除")

        await WarehouseCard.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))