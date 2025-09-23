# +----------------------------------------------------------------------
# | WaitAdmin(fastapi)快速开发后台管理系统
# +----------------------------------------------------------------------
# | 欢迎阅读学习程序代码,建议反馈是我们前进的动力
# | 程序完全开源可支持商用,允许去除界面版权信息
# | gitee:   https://gitee.com/wafts/waitadmin-python
# | github:  https://github.com/topwait/waitadmin-python
# | 官方网站: https://www.waitadmin.cn
# | WaitAdmin团队版权所有并拥有最终解释权
# +----------------------------------------------------------------------
# | Author: WaitAdmin Team <2474369941@qq.com>
# +----------------------------------------------------------------------
import time
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.software import softwareModel
from common.models.software_version import SoftwareVersionModel
from common.models.attach import AttachModel
from apps.admin.schemas.software import software_version_schema as schema
from apps.admin.schemas.common_schema import SelectItem_name


class SoftwareVersionService:
    """ 软件版本服务类 """

    @classmethod
    async def lists(cls, params: schema.SoftwareVersionSearchIn) -> PagingResult[schema.SoftwareVersionDetail]:
        """
        软件版本列表。

        Args:
            params (schema.SoftwareVersionSearchIn): 查询参数。

        Returns:
            PagingResult[schema.SoftwareVersionDetail]: 分页列表Vo。

        Author:
            zero
        """
        where = SoftwareVersionModel.build_search(
            {
                "=": ["software_id"],
                "%like%": ["version"],
                # 你可根据需要自定义其他条件
            }, params.__dict__
        )

        # 如果指定了is_show参数
        if params.is_show is not None:
            where.append(SoftwareVersionModel.is_show == params.is_show)

        _model = SoftwareVersionModel.filter(*where).order_by("-id")
        # 先获取原始数据列表
        _pager = await SoftwareVersionModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            fields=[
                "id", "software_id", "version", "title", "description", "download_type",
                "download_url", "attach_id", "is_show", "is_latest", "create_time", "update_time"
            ]
        )

        # 获取所有软件ID，批量查询软件信息以提高性能
        software_ids = list({item['software_id'] for item in _pager.lists})
        softwares = await softwareModel.filter(id__in=software_ids).all()
        software_map = {s.id: s for s in softwares}

        # 处理数据列表，添加软件名称
        processed_lists = []
        for item in _pager.lists:
            # 创建item副本
            item_dict = dict(item)
            
            # 添加软件名称
            software = software_map.get(item_dict['software_id'])
            item_dict["software_name"] = software.name if software else "未知"
            
            # 添加到处理后的列表
            processed_lists.append(item_dict)
        
        # 使用schema进行验证
        _pager.lists = [TypeAdapter(schema.SoftwareVersionDetail).validate_python(item) for item in processed_lists]

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> schema.SoftwareVersionDetail:
        """
        软件版本详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            schema.SoftwareVersionDetailVo: 详情Vo。

        Author:
            zero
        """
        data = await SoftwareVersionModel.filter(id=id_).first()
        if not data:
            raise AppException("软件版本不存在")
            
        result = TypeAdapter(schema.SoftwareVersionDetail).validate_python(data.__dict__)
        
        # 添加软件名称
        software = await softwareModel.filter(id=data.software_id).first()
        result.software_name = software.name if software else "未知"
        
        # 添加附件信息
        result.attach_info = None
        if data.attach_id > 0:
            attach = await AttachModel.filter(id=data.attach_id).first()
            if attach:
                result.attach_info = {
                    "id": attach.id,
                    "file_name": attach.file_name,
                    "file_path": attach.file_path,
                    "file_size": attach.file_size,
                    "file_ext": attach.file_ext
                }
        
        return result

    @classmethod
    async def add(cls, post: schema.SoftwareVersionCreate):
        """
        软件版本新增。

        Args:
            post (schema.SoftwareVersionCreate): 新增参数。

        Author:
            zero
        """
        # 检查软件是否存在
        software = await softwareModel.filter(id=post.software_id).first()
        if not software:
            raise AppException("软件不存在")
        
        # 如果设置为最新版本，则将该软件的其他版本设置为非最新
        if post.is_latest:
            await SoftwareVersionModel.filter(software_id=post.software_id).update(is_latest=False)
        
        # 检查下载类型和相关参数
        if post.download_type == 1 and not post.download_url:
            raise AppException("外站链接不能为空")
        if post.download_type == 2 and post.attach_id <= 0:
            raise AppException("附件ID不能为空")
        
        # 检查附件是否存在
        if post.download_type == 2:
            attach = await AttachModel.filter(id=post.attach_id).first()
            if not attach:
                raise AppException("附件不存在")
        
        await SoftwareVersionModel.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

    @classmethod
    async def edit(cls, post: schema.SoftwareVersionUpdate):
        """
        软件版本编辑。

        Args:
            post (schema.SoftwareVersionUpdate): 编辑参数。

        Author:
            zero
        """
        _obj = await SoftwareVersionModel.filter(id=post.id).first()
        if not _obj:
            raise AppException("软件版本不存在")
        
        # 检查软件是否存在
        software = await softwareModel.filter(id=post.software_id).first()
        if not software:
            raise AppException("软件不存在")
        
        # 如果设置为最新版本，则将该软件的其他版本设置为非最新
        if post.is_latest and not _obj.is_latest:
            await SoftwareVersionModel.filter(software_id=post.software_id).update(is_latest=False)
        
        # 检查下载类型和相关参数
        if post.download_type == 1 and not post.download_url:
            raise AppException("外站链接不能为空")
        if post.download_type == 2 and post.attach_id <= 0:
            raise AppException("附件ID不能为空")
        
        # 检查附件是否存在
        if post.download_type == 2:
            attach = await AttachModel.filter(id=post.attach_id).first()
            if not attach:
                raise AppException("附件不存在")
        
        params = post.dict()
        del params["id"]

        await SoftwareVersionModel.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        软件版本删除。

        Args:
            id_ (int): 主键ID。

        Author:
            zero
        """
        p = await SoftwareVersionModel.filter(id=id_).first()
        if not p:
            raise AppException("软件版本不存在")
        
        await SoftwareVersionModel.filter(id=id_).delete()

    @classmethod
    async def select_software(cls) -> List[SelectItem_name]:
        """查询软件的options列表"""
        
        selects = await softwareModel.filter(is_show=1).values("id", "name")
        
        results = TypeAdapter(List[SelectItem_name]).validate_python(selects)
        
        return results