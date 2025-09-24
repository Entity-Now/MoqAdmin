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
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.ai_model_config import AIModelConfig
from apps.admin.schemas.ai_model_config_schema import (
    AIModelConfigSearchIn,
    AIModelConfigVo,
    AIModelConfigCreateIn,
    AIModelConfigUpdateIn
)


class AIModelConfigService:
    """ AI模型配置服务类 """

    @classmethod
    async def lists(cls, params: AIModelConfigSearchIn) -> PagingResult[AIModelConfigVo]:
        """
        AI模型配置列表。

        Args:
            params (AIModelConfigSearchIn): 查询参数。

        Returns:
            PagingResult[AIModelConfigVo]: 分页列表Vo。

        Author:
            WaitAdmin Team
        """
        where = AIModelConfig.build_search(
            {
                "%like%": ["model_name", "platform"],
                "=": ["is_active"]
            }, params.__dict__
        )

        _model = AIModelConfig.filter(*where).order_by("-id")
        _pager = await AIModelConfig.paginate(
            model=_model,
            page_no=params.page,
            page_size=15,  # 默认每页15条
            schema=AIModelConfigVo,
            fields=AIModelConfig.without_field("")
        )

        return _pager

    @classmethod
    async def detail(cls, id_: int) -> AIModelConfigVo:
        """
        AI模型配置详情。

        Args:
            id_ (int): 主键ID。

        Returns:
            AIModelConfigVo: 详情Vo。

        Author:
            WaitAdmin Team
        """
        data = await AIModelConfig.get(id=id_)
        if not data:
            raise AppException("AI模型配置不存在")
        return TypeAdapter(AIModelConfigVo).validate_python(data.__dict__)

    @classmethod
    async def add(cls, post: AIModelConfigCreateIn):
        """
        AI模型配置新增。

        Args:
            post (AIModelConfigCreateIn): 新增参数。

        Author:
            WaitAdmin Team
        """
        await AIModelConfig.create(
            **post.dict(),
            created_at=int(time.time()),
            updated_at=int(time.time())
        )

    @classmethod
    async def edit(cls, post: AIModelConfigUpdateIn):
        """
        AI模型配置编辑。

        Args:
            post (AIModelConfigUpdateIn): 编辑参数。

        Author:
            WaitAdmin Team
        """
        _obj = await AIModelConfig.filter(id=post.id).first()
        if not _obj:
            raise AppException("AI模型配置不存在")

        params = post.dict()
        del params["id"]

        await AIModelConfig.filter(id=post.id).update(
            **params,
            updated_at=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        AI模型配置删除。

        Args:
            id_ (int): 主键ID。

        Author:
            WaitAdmin Team
        """
        _obj = await AIModelConfig.filter(id=id_).first()
        if not _obj:
            raise AppException("AI模型配置不存在")
        await AIModelConfig.filter(id=id_).delete()

    @classmethod
    async def status(cls, id_: int, is_active: bool):
        """
        AI模型配置状态切换。

        Args:
            id_ (int): 主键ID。
            is_active (bool): 是否启用。

        Author:
            WaitAdmin Team
        """
        _obj = await AIModelConfig.filter(id=id_).first()
        if not _obj:
            raise AppException("AI模型配置不存在")
        await AIModelConfig.filter(id=id_).update(
            is_active=is_active,
            updated_at=int(time.time())
        )