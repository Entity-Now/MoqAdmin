import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Category
from apps.admin.schemas.shopping import category_schema as schema
from apps.admin.schemas.common_schema import SelectItem


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
            "=": ["is_show"],
            "%like%": ["title"]
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
    async def selected(cls) -> List[SelectItem]:
        """查询分类的options列表"""
        
        selects = await Category.filter(is_delete=0).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results
        

    @classmethod
    async def add(cls, post: schema.CategoryCreate):
        """添加分类

        Args:
            post (schema.CategoryCreate): 分类实体

        Returns:
            无返回值，方法不报错即为执行成功
        """

        cate = Category.filter(title=post.title).first()
        if not cate:
            raise AppException(f"名称为{post.title}的分类已经存在！")

        insertRes = await Category.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )


    @classmethod
    async def edit(cls, post: schema.CategoryUpdate):
        """
        商品分类编辑
        :param post: 商品编辑参数
        :return: 无返回值，方法不报错即为执行成功
        """

        _post = await Category.filter(id=post.id, is_delete=0).first().values("id")
        if not _post:
            raise AppException("商品分类不存在")

        _post3 = await Category.filter(title=post.title, id__not=post.id, is_delete=0).values("id")
        if _post3:
            raise AppException("商品分类名称已被占用")

        params = post.dict()
        del params["id"]

        updateRes = await Category.filter(id=post.id).update(
            **params,
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个分类
        :param id_: 分类的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await Category.filter(id=id_, is_delete=0).first().values("id")
        if not p:
            raise AppException("商品分类不存在")

        admin = await Category.filter(cid=id_, is_delete=0).first().values("id")
        if admin:
            raise AppException("商品分类已被使用不能删除")

        await Category.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))