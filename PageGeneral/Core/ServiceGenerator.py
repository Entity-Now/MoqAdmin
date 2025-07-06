from .CodeGenerator import CodeGenerator
from .MTable import Table, Property


class ServiceGenerator(CodeGenerator):

    SERVICE_TEMPLATE = '''
import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.{model_name} import {model_name}Model
from apps.admin.schemas.{category} import {model_name}_schema as schema
from apps.admin.schemas.common_schema import SelectItem
    
    
class {service_name}:
    """ {model_name}服务类 """

    @classmethod
    async def lists(cls, params: schema.{model_name}SearchIn) -> PagingResult[schema.{model_name}Detail]:
        """
        {model_name}列表。

        Args:
            params (schema.{model_name}SearchIn): 查询参数。

        Returns:
            PagingResult[schema.{model_name}Detail]: 分页列表Vo。

        Author:
            zero
        """
        where = {model_name}Model.build_search(
            {{
                "=": ["is_show"],
                "%like%": ["title"],
                # 你可根据需要自定义其他条件
            }}, params.__dict__
        )

        _model = {model_name}Model.filter(*where).order_by("-id")
        _pager = await {model_name}Model.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            schema=schema.{model_name}Detail,
            fields={model_name}Model.without_field("is_delete,delete_time")
        )

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> schema.{model_name}Detail:
        """
        {model_name}详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            schema.{model_name}Detail: 详情Vo。

        Author:
            zero
        """
        data = await {model_name}Model.get(id=id_)
        return TypeAdapter(schema.{model_name}Detail).validate_python(data.__dict__)

    @classmethod
    async def add(cls, post: schema.{model_name}Create):
        """
        {model_name}新增。

        Args:
            post (schema.{model_name}Create): 新增参数。

        Author:
            zero
        """
        await {model_name}Model.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def edit(cls, post: schema.{model_name}Update):
        """
        {model_name}编辑。

        Args:
            post (schema.{model_name}Update): 编辑参数。

        Author:
            zero
        """
        _obj = await {model_name}Model.filter(id=post.id).first().values("id")
        if not _obj:
            raise AppException("{model_name}不存在")

        params = post.dict()
        del params["id"]

        await {model_name}Model.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        {model_name}删除。

        Args:
            id_ (int): 主键ID。

        Author:
            zero
        """
        p = await {model_name}Model.filter(id=id_).first().values("id")
        if not p:
            raise AppException("{model_name}不存在")

        await {model_name}Model.filter(id=id_).delete()
'''

    def generate(self, table: Table) -> str:
        model_name = table.tableName.lower()
        service_name = f"{model_name}Service"
        category = table.category

        return self.SERVICE_TEMPLATE.format(
            service_name=service_name,
            model_name=model_name,
            category=category
        )

    def get_filename(self, table: Table) -> str:
        return f"{table.tableName.lower()}_service.py"
    
    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        return f'../server/apps/admin/service'