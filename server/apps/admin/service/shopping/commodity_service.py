import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Commodity
from apps.admin.schemas.shopping import commodity_schema as schema
from apps.admin.schemas.common_schema import SelectItem


class CommodityService:
    
    @classmethod
    async def list(cls, param: schema.CommoditySearchIn) ->  PagingResult[schema.CommodityDetail]:
        """商品列表

        Args:
            param (schema.CommoditySearchIn): 搜索参数

        Returns:
            PagingResult[schema.CommodityDetail]: 返回一个商品的列表
        """
        whereParam = {
            "=": ["is_show"],
            "%like%": ["title"]
        }
        if param.cid is not None:
            whereParam["="].append("cid")
            whereParam["="].append("is_topping")
            whereParam["="].append("is_recommend")
        where = Commodity.build_search(whereParam, param.__dict__)

        _model = Commodity.filter(is_delete=0).filter(*where).order_by("-sort", "-id")
        _pager = await Commodity.paginate(
            model=_model,
            page_no=param.page_no,
            page_size=param.page_size,
            schema=schema.CommodityDetail,
            fields=Commodity.without_field("is_delete,delete_time")
        )
        
        return _pager

    @classmethod
    async def selected(cls) -> List[SelectItem]:
        """查询商品的options列表"""
        
        selects = await Commodity.filter(is_delete=0).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results
        

    @classmethod
    async def add(cls, post: schema.CommodityCreate):
        """添加商品

        Args:
            post (schema.CommodityCreate): 商品实体

        Returns:
            无返回值，方法不报错即为执行成功
        """

        cate = Commodity.filter(title=post.title).first()
        if not cate:
            raise AppException(f"名称为{post.title}的商品已经存在！")

        insertRes = await Commodity.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )


    @classmethod
    async def edit(cls, post: schema.CommodityUpdate):
        """
        商品编辑
        :param post: 商品编辑参数
        :return: 无返回值，方法不报错即为执行成功
        """

        _post = await Commodity.filter(id=post.id, is_delete=0).first().values("id")
        if not _post:
            raise AppException("商品不存在")

        _post3 = await Commodity.filter(title=post.title, id__not=post.id, is_delete=0).values("id")
        if _post3:
            raise AppException("商品名称已被占用")

        params = post.dict()
        del params["id"]

        updateRes = await Commodity.filter(id=post.id).update(
            **params,
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个商品
        :param id_: 商品的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await Commodity.filter(id=id_, is_delete=0).first().values("id")
        if not p:
            raise AppException("商品不存在")

        admin = await Commodity.filter(cid=id_, is_delete=0).first().values("id")
        if admin:
            raise AppException("商品已被使用不能删除")

        await Commodity.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))