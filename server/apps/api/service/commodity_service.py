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
import json
from tortoise.expressions import Q
from tortoise.functions import Count
from tortoise.contrib.mysql.functions import Rand
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
from fastapi import UploadFile
from PIL import Image
import io
import os
from plugins.pyTorch.embedding_extractor import EmbeddingExtractor
from plugins.milvus.milvus_service import milvus_service


class CommodityService:
    """ 商品服务类 """
    
    from typing import List, Dict, Optional
    from pydantic import TypeAdapter

    @classmethod
    async def category(cls) -> List[CommodityCategoryVo]:
        """
        获取商品分类列表并构建分类树
        
        Returns:
            List[CommodityCategoryVo]: 结构化的分类列表
        """
        # 查询并转换原始分类数据
        categories = await CommodityCategoryModel.filter(
            is_show=1,
            is_delete=0
        ).order_by("-sort", "-id").values('id', 'title', 'parent_id', 'image')
        
        # 转换字段格式并处理图片URL（移除无效的校验逻辑）
        processed_cats = [
            {
                **item,
                "name": item["title"],
                "image": item["image"],
                "children": []  # 预先初始化子分类列表
            }
            for item in categories  # 直接遍历，ORM返回的结果本身是可靠的
        ]
        
        # 创建ID到分类的映射，便于快速查找
        cat_map: Dict[int, Dict] = {cat["id"]: cat for cat in processed_cats}
        
        # 构建分类树
        root_cats: List[Dict] = []
        for cat in processed_cats:
            parent_id = cat.get("parent_id")
            if parent_id in [0, None]:
                root_cats.append(cat)
            elif parent_id in cat_map:
                cat_map[parent_id]["children"].append(cat)
            # 忽略无效的父ID，可根据需求添加日志
        
        # 验证并转换为VO对象
        adapter = TypeAdapter(CommodityCategoryVo)
        return [adapter.validate_python(cat) for cat in root_cats]

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
        where = CommodityModel.build_search({
            "=": ["categoryId@cid"],
            "%like%": ["keyword@title"],
            ">=": ["minPrice@price"],
            "<=": ["maxPrice@price"]
        }, params.__dict__)
        
        # 添加基础条件
        where.append(Q(is_show=1, is_delete=0))
        
        # 排序规则
        order_by = []
        if params.categoryId or params.keyword:
            # 有筛选条件时，按照销量和浏览量排序
            order_by = ['-sales', '-browse', '-id', 'Rand']
        else:
            # 无筛选条件时，按照是否置顶、是否推荐排序
            order_by = ['Rand']
        
        # 查询商品列表并分页
        _model = CommodityModel.annotate(Rand=Rand()).filter(*where).order_by(*order_by)
        _pager = await CommodityModel.paginate(
            model=_model,
            page_no=params.page,
            page_size=params.size if params.size else 10,
            fields=["id", "cid", "main_image", "image", "title", "intro", "price", "fee", "stock", "sales", "browse", "collect", "is_recommend", "is_topping", "create_time", "update_time"]
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
            item["main_image"] = await UrlUtil.to_absolute_url(item["main_image"])
            item["image"] = [await UrlUtil.to_absolute_url(url) for url in item["image"]]
            item["create_time"] = item["create_time"]
            item["update_time"] = item["update_time"]
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            _results.append(vo)
        
        _pager.lists = _results
        return _pager
    
    @classmethod
    async def recommend(cls, type_: str = "recommend", limit: int = 8) -> List[CommodityListsVo]:
        """
        获取推荐商品
        
        Args:
            type_ (str): 推荐类型 [recommend=推荐, topping=置顶, ranking=排行]
            limit (int): 限制条数
            
        Returns:
            List[CommodityListsVo]: 推荐商品列表
        """
        where = [Q(is_show=1, is_delete=0)]
        order = ['-sort', '-id', 'Rand']
        
        if type_ == "recommend":
            where.append(Q(is_recommend=1))
        elif type_ == "topping":
            where.append(Q(is_topping=1))
        elif type_ == "ranking":
            order = ['-sales', '-browse', '-collect', '-id']
        
        # 查询推荐商品
        items = (await CommodityModel
                        .annotate(Rand=Rand())
                        .filter(*where)
                        .filter(is_show=1, is_delete=0)
                        .order_by(*order)
                        .limit(limit)
                        .values("id", "cid", "title", "main_image", "image", "intro", "price", "fee", "stock", "sales", "browse", "collect", "is_recommend", "is_topping", "create_time", "update_time"))
        
        # 查询分类信息
        _category = {}
        cid_ids = [item["cid"] for item in items if item["cid"]]
        if cid_ids:
            category_ = await CommodityCategoryModel.filter(id__in=list(set(cid_ids))).all().values_list("id", "title")
            _category = {k: v for k, v in category_}
        
        # 格式化商品数据
        formatted_items = []
        for item in items:
            item["category"] = _category.get(item["cid"], "")
            item["main_image"] = await UrlUtil.to_absolute_url(item["main_image"])
            ## 处理图片列表URL
            if item["image"]:
                # 循环处理每个图片URL
                item["image"] = [await UrlUtil.to_absolute_url(url) for url in item["image"]]
            
            item["create_time"] = TimeUtil.timestamp_to_date(item["create_time"])
            item["update_time"] = TimeUtil.timestamp_to_date(item["update_time"])
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            formatted_items.append(vo)
        
        return formatted_items
    
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
            'main_image': await UrlUtil.to_absolute_url(commodity.main_image),
            'image': [await UrlUtil.to_absolute_url(url) for url in commodity.image],
            'title': commodity.title,
            'intro': commodity.intro,
            'price': commodity.price,
            'fee': commodity.fee,
            'stock': commodity.stock,
            'sales': commodity.sales,
            'deliveryType': commodity.deliveryType,
            'browse': commodity.browse,
            'collect': commodity.collect,
            'is_collect': is_collect,
            'config': commodity.config,
            'sku': commodity.sku,
            'is_recommend': commodity.is_recommend,
            'is_topping': commodity.is_topping,
            'create_time': TimeUtil.timestamp_to_date(commodity.create_time),
            'update_time': TimeUtil.timestamp_to_date(commodity.update_time)
        }
        
        return TypeAdapter(CommodityDetailVo).validate_python(formatted_detail)
    
    @classmethod
    async def pages(cls) -> CommodityPagesVo:
        """
        获取商品页面数据
        
        Returns:
            CommodityPagesVo: 商品页面数据
        """
        # 查询置顶商品
        topping_items = await cls.recommend("topping", 8)
        
        # 查询排行榜商品
        ranking_items = await cls.recommend("ranking", 10)
        
        # 查询轮播图
        adv_lists = await (DevBannerModel
                           .filter(position=BannerEnum.BANNER)
                           .filter(is_disable=0, is_delete=0)
                           .order_by("-sort", "-id")
                           .all().values("title", "image", "target", "url", "desc"))

        for adv in adv_lists:
            adv["image"] = await UrlUtil.to_absolute_url(adv["image"])
        
        # 返回综合数据（根据CommodityPagesVo的结构返回）
        return CommodityPagesVo(
            adv=adv_lists,
            topping=topping_items,
            ranking=ranking_items
        )
    
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
        ).annotate(Rand=Rand()).order_by('Rand').limit(20)
        
        # 查询分类信息
        category_ids = list(set(item.cid for item in items))
        categories = await CommodityCategoryModel.filter(id__in=category_ids).values('id', 'title')
        category_map = {c['id']: c['title'] for c in categories}
        
        # 格式化商品数据
        formatted_items = []
        for item in items:
            item_dict = item.__dict__
            item_dict['category'] = category_map.get(item.cid, '')
            item_dict['main_image'] = await UrlUtil.to_absolute_url(item.main_image)
            item_dict['image'] = [await UrlUtil.to_absolute_url(url) for url in item.image]
            item_dict['create_time'] = TimeUtil.timestamp_to_date(item.create_time)
            item_dict['update_time'] = TimeUtil.timestamp_to_date(item.update_time)
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

    @classmethod
    async def search_by_image(cls, file: UploadFile, limit: int = 25) -> PagingResult[CommodityListsVo]:
        """
        以图搜图
        
        Args:
            file (UploadFile): 上传的图片文件
            limit (int): 返回结果数量限制，默认25条（第一页）
            
        Returns:
            PagingResult[CommodityListsVo]: 与lists接口一致的分页返回结构
        """
        try:
            # 1. 读取图片
            content = await file.read()
            image = Image.open(io.BytesIO(content))
            
            # 2. 提取特征
            extractor = EmbeddingExtractor()
            vector = extractor.extract_feature(image)
            
            # 3. 搜索 Milvus，限制为25条
            results = milvus_service.search_similar(vector, top_k=min(limit, 25))
            
            if not results:
                # 返回空分页结构
                return PagingResult(
                    page_no=1,
                    page_size=limit,
                    count=0,
                    lists=[]
                )
                
            # 4. 获取商品ID列表
            ids = [int(hit['id']) for hit in results]
            
            # 5. 查询数据库获取完整商品信息
            commodities = await CommodityModel.filter(
                id__in=ids,
                is_show=1,
                is_delete=0
            ).all()
            
            # 6. 查询分类信息
            cid_ids = list(set(c.cid for c in commodities if c.cid))
            _category = {}
            if cid_ids:
                categories = await CommodityCategoryModel.filter(id__in=cid_ids).all().values_list("id", "title")
                _category = {k: v for k, v in categories}
            
            # 7. 保持搜索结果顺序并格式化为CommodityListsVo
            commodity_map = {c.id: c for c in commodities}
            formatted_items = []
            
            for hit in results:
                cid = int(hit['id'])
                if cid in commodity_map:
                    c = commodity_map[cid]
                    item_dict = {
                        "id": c.id,
                        "code": c.code if hasattr(c, 'code') else "",
                        "category": _category.get(c.cid, ""),
                        "main_image": await UrlUtil.to_absolute_url(c.main_image),
                        "image": [await UrlUtil.to_absolute_url(url) for url in c.image],
                        "title": c.title,
                        "intro": c.intro,
                        "price": c.price,
                        "original_price": c.original_price if hasattr(c, 'original_price') else None,
                        "fee": c.fee,
                        "stock": c.stock,
                        "sales": c.sales,
                        "browse": c.browse,
                        "collect": c.collect,
                        "config": c.config,
                        "sku": c.sku,
                        "is_recommend": c.is_recommend,
                        "is_topping": c.is_topping,
                        "create_time": TimeUtil.timestamp_to_date(c.create_time),
                        "update_time": TimeUtil.timestamp_to_date(c.update_time)
                    }
                    vo = TypeAdapter(CommodityListsVo).validate_python(item_dict)
                    formatted_items.append(vo)
            
            # 8. 返回与lists一致的分页结构
            return PagingResult(
                page_no=1,  # 固定第一页
                page_size=limit,  # 每页条数
                count=len(formatted_items),  # 实际返回的数据条数
                lists=formatted_items  # 商品列表
            )
            
        except Exception as e:
            print(f"Search by image failed: {e}")
            # 返回空分页结构
            return PagingResult(
                page_no=1,
                page_size=limit,
                count=0,
                lists=[]
            )
