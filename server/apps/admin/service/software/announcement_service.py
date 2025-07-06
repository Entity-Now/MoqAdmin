
import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.announcement import AnnouncementModel as announcementModel
from apps.admin.schemas.software import announcement_schema as schema
from apps.admin.schemas.common_schema import SelectItem
    
    
class announcementService:
    """ announcement服务类 """

    @classmethod
    async def lists(cls, params: schema.announcementSearchIn) -> PagingResult[schema.announcementDetail]:
        """
        announcement列表。

        Args:
            params (schema.announcementSearchIn): 查询参数。

        Returns:
            PagingResult[schema.announcementDetail]: 分页列表Vo。

        Author:
            zero
        """
        where = announcementModel.build_search(
            {
                "=": ["is_show"],
                "%like%": ["title"],
                # 你可根据需要自定义其他条件
            }, params.__dict__
        )

        _model = announcementModel.filter(*where).order_by("-id")
        _pager = await announcementModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            schema=schema.announcementDetail,
            fields=announcementModel.without_field("delete_time")
        )

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> schema.announcementDetail:
        """
        announcement详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            schema.announcementDetail: 详情Vo。

        Author:
            zero
        """
        data = await announcementModel.get(id=id_)
        return TypeAdapter(schema.announcementDetail).validate_python(data.__dict__)

    @classmethod
    async def add(cls, post: schema.announcementCreate):
        """
        announcement新增。

        Args:
            post (schema.announcementCreate): 新增参数。

        Author:
            zero
        """
        await announcementModel.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def edit(cls, post: schema.announcementUpdate):
        """
        announcement编辑。

        Args:
            post (schema.announcementUpdate): 编辑参数。

        Author:
            zero
        """
        _obj = await announcementModel.filter(id=post.id).first().values("id")
        if not _obj:
            raise AppException("announcement不存在")

        params = post.dict()
        del params["id"]

        await announcementModel.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        announcement删除。

        Args:
            id_ (int): 主键ID。

        Author:
            zero
        """
        p = await announcementModel.filter(id=id_).first().values("id")
        if not p:
            raise AppException("announcement不存在")

        await announcementModel.filter(id=id_).delete()
