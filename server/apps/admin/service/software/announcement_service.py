
import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.announcement import AnnouncementModel as announcementModel
from common.models.software import softwareModel
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
        try:
            where = announcementModel.build_search(
                {
                    "=": ["is_show"],
                    "%like%": ["title"],
                    # 你可根据需要自定义其他条件
                }, params.__dict__
            )

            _model = announcementModel.filter(*where).order_by("-id")
            # 先获取原始数据列表
            _pager = await announcementModel.paginate(
                model=_model,
                page_no=params.page_no,
                page_size=params.page_size,
                fields=[
                    "id", "software_id", "title", "content", "is_pinned", 
                    "is_show", "create_time", "update_time"
                ]
            )

            # 获取所有软件ID，批量查询软件信息以提高性能
            software_map = {}
            if _pager.lists:  # 避免空列表时的无效查询
                software_ids = list({item['software_id'] for item in _pager.lists if item.get('software_id')})
                if software_ids:
                    softwares = await softwareModel.filter(id__in=software_ids).all()
                    software_map = {s.id: s for s in softwares}

            # 创建TypeAdapter实例一次
            adapter = TypeAdapter(schema.announcementDetail)
            
            # 处理数据列表，添加软件名称
            processed_lists = []
            for item in _pager.lists:
                # 创建item副本，确保处理的是字典类型
                item_dict = dict(item) if not isinstance(item, dict) else item.copy()
                
                # 添加软件名称，增加多重空值判断
                software_id = item_dict.get('software_id')
                software = software_map.get(software_id) if software_id else None
                item_dict["software_name"] = getattr(software, 'name', "未知")
                
                # 使用schema进行验证并添加到处理后的列表
                processed_lists.append(adapter.validate_python(item_dict))
            
            _pager.lists = processed_lists
            return _pager
            
        except Exception as e:
            # 记录异常日志
            logger.error(f"获取公告列表失败: {str(e)}", exc_info=True)
            # 根据实际情况决定是返回空结果还是抛出异常
            raise  # 或者返回一个空的分页结果

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
        result = TypeAdapter(schema.announcementDetail).validate_python(data.__dict__)
        
        # 添加软件名称
        software = await softwareModel.filter(id=data.software_id).first()
        result.software_name = software.name if software else "未知"

        return result

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
