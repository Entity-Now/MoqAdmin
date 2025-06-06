import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Category
from apps.admin.schemas.shopping import category_schema as schema


class CategoryService:
    
    @classmethod
    async def list(cls, param: schema.CategorySearchIn) ->  PagingResult[schema.CategoryDetail]:
        """类目列表

        Args:
            param (schema.CategorySearchIn): 搜索参数

        Returns:
            PagingResult[schema.CategoryDetail]: 返回一个类目的列表
        """
        where = Category.build_search({
            "%like%": ["name"]
        }, param.__dict__)
        
        _model = Category.filter(*where).order_by("-sort", "-id")
        _pager = await Category.paginate(
            model=_model,
            page_no=param.page_no,
            page_size=param.page_size,
            schema=schema.CategoryDetail,
            fields=Category.without_field("is_delete,delete_time")
        )
        
        return _pager

    @classmethod
    async def Add(cls, post: schema.CategoryCreate) -> bool:
        """添加分类

        Args:
            post (schema.CategoryCreate): 分类实体

        Returns:
            bool: 返回添加数据的状态
        """

        cate = Category.filter(name=post.name).first()
        if not cate:
            raise AppException(f"名称为{post.name}的分类已经存在！")

        insertRes = await Category.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )
        
        if insertRes and insertRes.id:
            return True
        else:
            return False