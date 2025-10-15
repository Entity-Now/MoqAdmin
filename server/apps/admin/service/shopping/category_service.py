import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Category, Commodity
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

        _model = Category.filter(is_delete=0).filter(*where).order_by("-sort", "-id")
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
        
        selects = await Category.filter(is_delete=0).values("id", "title", 'level')
        ## 将level和title拼接起来，如果level为null，则默认一级分类
        for item in selects:
            item["title"] = "L" + str(item["level"]) + " || " + item["title"]
        
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

        cate = await Category.filter(title=post.title, is_delete=0).first()
        if cate:
            raise AppException(f"名称为{post.title}的分类已经存在！")

        # 如果是二级分类，检查父级分类是否存在
        if post.parent_id > 0:
            parent = await Category.filter(id=post.parent_id, is_delete=0).first()
            if not parent:
                raise AppException(f"父级分类不存在！")
            # 确保父级分类是一级分类
            if parent.level != 0:
                raise AppException(f"只能选择一级分类作为父级！")

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

        _post = await Category.filter(id=post.id, is_delete=0).first()
        if not _post:
            raise AppException("商品分类不存在")

        # 检查标题是否重复
        if post.title:
            _post3 = await Category.filter(title=post.title, id__not=post.id, is_delete=0).values("id")
            if _post3:
                raise AppException("商品分类名称已被占用")

        # 检查父级分类是否存在且为一级分类
        if post.parent_id is not None and post.parent_id > 0:
            parent = await Category.filter(id=post.parent_id, is_delete=0).first()
            if not parent:
                raise AppException(f"父级分类不存在！")
            # 确保父级分类是一级分类
            if parent.level != 0:
                raise AppException(f"只能选择一级分类作为父级！")
            # 不能选择自己作为父级
            if post.parent_id == post.id:
                raise AppException(f"不能选择自己作为父级！")

        params = post.dict()
        del params["id"]

        updateRes = await Category.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个分类
        :param id_: 分类的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await Category.filter(id=id_, is_delete=0).first()
        if not p:
            raise AppException("商品分类不存在")

        # 检查分类是否有子分类
        sub_categories = await Category.filter(parent_id=id_, is_delete=0).first()
        if sub_categories:
            raise AppException("该分类下有子分类，不能删除")

        # 检查分类是否有商品
        admin = await Commodity.filter(cid=id_, is_delete=0).first()
        if admin:
            raise AppException("商品分类已被使用不能删除")

        await Category.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))

    @classmethod
    async def selected_by_level(cls, level: int = 0) -> List[SelectItem]:
        """根据级别查询分类的options列表
        
        Args:
            level: 分类级别，默认为0（顶级分类）
            
        Returns:
            List[SelectItem]: 分类选项列表
        """
        
        selects = await Category.filter(is_delete=0, level=level).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results