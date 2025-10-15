import time
import json
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
    async def sku_stock(cls, cid: int) -> Dict[str, int]:
        """查询库存的规格库存数量

        Args:
            cid (int): 库存ID

        Returns:
            Dict[str, int]: 规格库存数量，例如：{"颜色": 10, "尺寸": 5}
        """
        _stock = await WarehouseCard.filter(id=cid, is_delete=0).values("sku", "stock")
        if not _stock:
            return {}
        # sku是一个字典，将sku的value拼接起来作为key，用于前端判断是否有库存
        stock = {}
        for item in _stock:
            sku = item["sku"]
            if sku:
                sku = json.loads(sku)
                key = "-".join([f"{k}:{v}" for k, v in sku.items()])
                stock[key] = item["stock"]
        return stock
    
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
        
        # 处理规格字段
        if post.sku:
            post.sku = json.dumps(post.sku, ensure_ascii=False)

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
        # 处理规格字段
        if params.get("sku"):
            params["sku"] = json.dumps(params["sku"], ensure_ascii=False)

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
        # 判断是否被卖出
        used = await WarehouseCard.filter(is_used__not=0, id=id_, is_delete=0).first().values("id")
        if used:
            raise AppException("库存已被使用不能删除")

        await WarehouseCard.filter(id=id_).update(is_delete=1)