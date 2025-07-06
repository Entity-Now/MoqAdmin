
import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.software import softwareModel
from apps.admin.schemas.software import software_schema as schema
from apps.admin.schemas.common_schema import SelectItem
    
    
class softwareService:
    """ software服务类 """

    @classmethod
    async def lists(cls, params: schema.softwareSearchIn) -> PagingResult[schema.softwareDetail]:
        """
        software列表。

        Args:
            params (schema.softwareSearchIn): 查询参数。

        Returns:
            PagingResult[schema.softwareDetail]: 分页列表Vo。

        Author:
            zero
        """
        where = softwareModel.build_search(
            {
                "%like%": ["name"],
                # 你可根据需要自定义其他条件
            }, params.__dict__
        )

        _model = softwareModel.filter(*where).order_by("-id")
        _pager = await softwareModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            schema=schema.softwareDetail,
            fields=softwareModel.without_field("is_show")
        )

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> schema.softwareDetail:
        """
        software详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            schema.softwareDetailVo: 详情Vo。

        Author:
            zero
        """
        data = await softwareModel.get(id=id_)
        return TypeAdapter(schema.softwareDetail).validate_python(data.__dict__)

    @classmethod
    async def add(cls, post: schema.softwareCreate):
        """
        software新增。

        Args:
            post (schema.softwareCreate): 新增参数。

        Author:
            zero
        """
        await softwareModel.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def edit(cls, post: schema.softwareUpdate):
        """
        software编辑。

        Args:
            post (schema.softwareUpdate): 编辑参数。

        Author:
            zero
        """
        _obj = await softwareModel.filter(id=post.id).first().values("id")
        if not _obj:
            raise AppException("software不存在")

        params = post.dict()
        del params["id"]

        await softwareModel.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        software删除。

        Args:
            id_ (int): 主键ID。

        Author:
            zero
        """
        p = await softwareModel.filter(id=id_).first().values("id")
        if not p:
            raise AppException("software不存在")
        await softwareModel.filter(id=id_).delete()
