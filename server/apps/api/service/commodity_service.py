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
from typing import List, Dict, Any, Union, Optional
from tortoise.expressions import Q
from tortoise.functions import Count
from fastapi import Depends
from pydantic import TypeAdapter
from common.models.commodity import (
    Commodity as CommodityModel,
    Category as CommodityCategoryModel)
from common.models.dev import DevBannerModel
from common.models.users import UserModel
from common.utils.urls import UrlUtil
from common.utils.times import TimeUtil
from apps.api.schemas.commodity_schema import (
    CommoditySearchIn, CommodityDetailIn,
    CommodityCollectIn, CommodityRelatedIn,
    CommodityCategoryVo, CommodityListsVo,
    CommodityPagesVo, CommodityDetailVo
)
import time
from apps.api.schemas.index_schema import BannerListVo
from common.enums.public import BannerEnum
from hypertext import PagingResult


class CommodityService:
    """ 商品服务类 """
    
    @classmethod
    async def banner(cls) -> List[BannerListVo]:
        """
        获取商品轮播海报
        
        Returns:
            List[BannerListVo]: 轮播海报列表
        """
            
        banners = await DevBannerModel.filter(
            position=BannerEnum.HOME,
            is_disable=0,
            is_delete=0
        ).all()
        
        # 处理图片URL
        banner_list = []
        for item in banners:
            vo = TypeAdapter(BannerListVo).validate_python(item.__dict__)
            if vo.image:
                vo.image = UrlUtil.set_file_url(vo.image)
            banner_list.append(vo)
        
        return banner_list
    
    @classmethod
    async def category(cls) -> List[CommodityCategoryVo]:
        """
        获取商品分类列表
        
        Returns:
            List[CommodityCategoryVo]: 分类列表
        """
        cache_key = "app_commodity_category"
        result = await Cache.get(cache_key)
        if result:
            return TypeAdapter(List[CommodityCategoryVo]).validate_python(result)
        
        categories = await CommodityCategoryModel.filter(
            is_show=1,
            is_delete=0
        ).values('id', 'title').order_by('sort')
        
        await Cache.set(cache_key, categories, 86400)
        return TypeAdapter(List[CommodityCategoryVo]).validate_python(categories)
    
    @classmethod
    async def lists(cls, params: CommoditySearchIn) -> PagingResult[CommodityListsVo]:
        """
        获取商品列表
        
        Args:
            params (CommoditySearchIn): 搜索参数
        
        Returns:
            PagingResult[CommodityListsVo]: 商品列表和分页信息
        
        Author:
            WaitAdmin Team
        """
        # 构建搜索条件
        where = [Q(is_show=1, is_delete=0)]
        
        # 分类筛选
        if params.categoryId:
            where.append(Q(cid=params.categoryId))
        
        # 关键词搜索
        if params.keyword:
            where.append(Q(title__icontains=params.keyword) | Q(intro__icontains=params.keyword))
        
        # 价格筛选
        if params.minPrice is not None:
            where.append(Q(price__gte=params.minPrice))
        
        if params.maxPrice is not None:
            where.append(Q(price__lte=params.maxPrice))
        
        # 排序规则
        order_by = []
        if params.categoryId or params.keyword:
            # 有筛选条件时，按照销量和浏览量排序
            order_by = ['-sales', '-browse', '-id']
        else:
            # 无筛选条件时，按照是否置顶、是否推荐排序
            order_by = ['-is_topping', '-is_recommend', '-id']
        
        # 查询商品列表并分页
        _model = CommodityModel.filter(*where).order_by(*order_by)
        _pager = await CommodityModel.paginate(
            model=_model,
            page_no=params.page,
            page_size=params.size if params.size else 10,
            fields=["id", "cid", "image", "title", "intro", "price", "stock", "sales", "browse", "collect", "is_recommend", "is_topping", "create_time", "update_time"]
        )
        
        # 查询分类信息
        cid_ids = [item["cid"] for item in _pager.lists if item["cid"]]
        _category = {}
        if cid_ids:
            categories = await CommodityCategoryModel.filter(id__in=list(set(cid_ids))).all().values_list("id", "title")
            _category = {k: v for k, v in categories}
        
        # 格式化商品数据
        _results = []
        for item in _pager.lists:
            item["category"] = _category.get(item["cid"], "")
            item["image"] = await UrlUtil.to_absolute_url(item["image"])
            item["create_time"] = TimeUtil.format_datetime(item["create_time"])
            item["update_time"] = TimeUtil.format_datetime(item["update_time"])
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            _results.append(vo)
        
        _pager.lists = _results
        return _pager
    
    @classmethod
    async def recommend(cls) -> List[CommodityListsVo]:
        """
        获取推荐商品
        
        Returns:
            List[CommodityListsVo]: 推荐商品列表
        """
        
        # 查询推荐商品
        items = await CommodityModel.filter(
            is_show=1,
            is_delete=0,
            is_recommend=1
        ).order_by('-sort', '-id').limit(8)
        
        # 查询分类信息
        category_ids = list(set(item.cid for item in items))
        categories = await CommodityCategoryModel.filter(id__in=category_ids).values('id', 'title')
        category_map = {c['id']: c['title'] for c in categories}
        
        # 格式化商品数据
        formatted_items = []
        for item in items:
            formatted_items.append({
                'id': item.id,
                'category': category_map.get(item.cid, ''),
                'image': UrlUtil.set_file_url(item.image),
                'title': item.title,
                'intro': item.intro,
                'price': item.price,
                'stock': item.stock,
                'sales': item.sales,
                'browse': item.browse,
                'collect': item.collect,
                'is_recommend': item.is_recommend,
                'is_topping': item.is_topping,
                'create_time': TimeUtil.format_datetime(item.create_time),
                'update_time': TimeUtil.format_datetime(item.update_time)
            })
        
        return TypeAdapter(List[CommodityListsVo]).validate_python(formatted_items)
    
    @classmethod
    async def detail(cls, goods_id: int) -> CommodityDetailVo:
        """
        获取商品详情
        
        Args:
            goods_id (int): 商品ID
        
        Returns:
            CommodityDetailVo: 商品详情
        """
        # 查询商品详情
        commodity = await CommodityModel.get_or_none(
            id=goods_id,
            is_show=1,
            is_delete=0
        )
        
        if not commodity:
            raise Exception("商品不存在或已下架")
        
        # 浏览量+1
        commodity.browse += 1
        await commodity.save(update_fields=['browse'])
        
        # 查询分类信息
        category = await CommodityCategoryModel.get_or_none(id=commodity.cid)
        category_name = category.title if category else ''
        
        # 查询收藏状态
        is_collect = 0
        
        # 格式化商品详情
        formatted_detail = {
            'id': commodity.id,
            'category': category_name,
            'image': UrlUtil.set_file_url(commodity.image),
            'title': commodity.title,
            'intro': commodity.intro,
            'content': commodity.content,
            'price': commodity.price,
            'stock': commodity.stock,
            'sales': commodity.sales,
            'deliveryType': commodity.deliveryType,
            'browse': commodity.browse,
            'collect': commodity.collect,
            'is_collect': is_collect,
            'is_recommend': commodity.is_recommend,
            'is_topping': commodity.is_topping,
            'create_time': TimeUtil.format_datetime(commodity.create_time),
            'update_time': TimeUtil.format_datetime(commodity.update_time)
        }
        
        return TypeAdapter(CommodityDetailVo).validate_python(formatted_detail)
    
    @classmethod
    async def pages(cls, params: CommoditySearchIn) -> CommodityPagesVo:
        """
        获取商品分页数据
        
        Args:
            params (CommoditySearchIn): 搜索参数
        
        Returns:
            CommodityPagesVo: 商品分页数据
        """
        # 调用已有的lists方法获取分页结果
        paging_result = await cls.lists(params)
        
        # 转换为CommodityPagesVo所需的结构
        return TypeAdapter(CommodityPagesVo).validate_python({
            'lists': paging_result.lists,
            'total': paging_result.total,
            'page': paging_result.page,
            'size': paging_result.size
        })
    
    @classmethod
    async def related(cls, goods_id: int) -> List[CommodityListsVo]:
        """
        获取相关商品
        
        Args:
            goods_id (int): 商品ID
        
        Returns:
            List[CommodityListsVo]: 相关商品列表
        """
        # 查询当前商品
        current = await CommodityModel.get_or_none(id=goods_id)
        if not current:
            return []
        
        # 查询同分类的其他商品
        items = await CommodityModel.filter(
            cid=current.cid,
            id__not=goods_id,
            is_show=1,
            is_delete=0
        ).order_by('-sales', '-id').limit(8)
        
        # 查询分类信息
        category_ids = list(set(item.cid for item in items))
        categories = await CommodityCategoryModel.filter(id__in=category_ids).values('id', 'title')
        category_map = {c['id']: c['title'] for c in categories}
        
        # 格式化商品数据
        formatted_items = []
        for item in items:
            item_dict = item.__dict__
            item_dict['category'] = category_map.get(item.cid, '')
            item_dict['image'] = UrlUtil.set_file_url(item.image)
            item_dict['create_time'] = TimeUtil.format_datetime(item.create_time)
            item_dict['update_time'] = TimeUtil.format_datetime(item.update_time)
            formatted_items.append(item_dict)
        
        return TypeAdapter(List[CommodityListsVo]).validate_python(formatted_items)
    
    @classmethod
    async def collect(cls, goods_id: int) -> Dict[str, int]:
        """
        商品收藏/取消收藏
        
        Args:
            goods_id (int): 商品ID
        
        Returns:
            Dict[str, int]: 操作结果
        """
        # 检查商品是否存在
        commodity = await CommodityModel.get_or_none(
            id=goods_id,
            is_show=1,
            is_delete=0
        )
        
        if not commodity:
            raise ValueError("商品不存在或已下架")
        
        # 这里简单实现，实际项目中应该根据用户ID进行收藏操作
        # 由于缺少用户认证信息，这里仅模拟返回成功
        return {"status": 1}        
        return {'collect': is_collected, 'message': message}