import time
from typing import List
from pydantic import TypeAdapter
from hypertext import PagingResult
from tortoise.expressions import Q
from apps.admin.schemas.setting import feature_schema as schema
from common.models.dev import DevFeatureModel
from common.enums.public import FeatureEnum
from common.utils.urls import UrlUtil
from common.utils.times import TimeUtil

class FeatureService:
    """特性服务"""
    
    @classmethod
    async def sites(cls) -> List[schema.featureSiteVo]:
        options = []
        for key,val in FeatureEnum.get_positions().items():
            options.append(schema.featureSiteVo(id=key, name=val))
        return options
    
    @classmethod
    async def detail(cls, id_: int) -> schema.featureDetailVo:
        """特性详情"""
        data = await DevFeatureModel.get(id=id_).values()
        data["create_time"] = TimeUtil.timestamp_to_date(data["create_time"])
        data["update_time"] = TimeUtil.timestamp_to_date(data["update_time"])
        return TypeAdapter(schema.featureDetailVo).validate_python(data)
    
    @classmethod
    async def lists(cls, params: schema.featureSearchIn) -> PagingResult[schema.featureList]:
        """特性列表"""
        filters = Q(is_disable=params.is_disable)
        if params.title:
            filters &= Q(title__icontains=params.title)
        if params.type is not None:
            filters &= Q(type=params.type)
        _model = DevFeatureModel.filter(filters).order_by("-sort", '-id') # 倒序排序
        _pager = await DevFeatureModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size
        )
        
        _data = []
        for item in _pager.lists:
            _data.append(TypeAdapter(schema.featureList).validate_python(item))

        _pager.lists = _data
        return _pager
    
    @classmethod
    async def add(cls, post: schema.featureAddIn):
        """添加特性"""
        params = post.dict()
        await DevFeatureModel.create(
            **params,
            create_time = int(time.time()),
            update_time  = int(time.time()),
        )
        
    @classmethod
    async def edit(cls, post: schema.featureUpdateIn):
        """编辑特性"""
        params = post.dict()
        del params['id']
        await DevFeatureModel.filter(id=post.id).update(
            **params,
            update_time  = int(time.time()),
        )
    
    @classmethod
    async def delete(cls, id: schema.featureDeleteIn):
        """删除特性"""
        await DevFeatureModel.filter(id=id.id).delete()
    