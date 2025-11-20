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
import random
from typing import List
from pydantic import TypeAdapter
from tortoise.expressions import Q
from tortoise.functions import Count
from hypertext import PagingResult
from common.models.commodity import (
    Commodity as CommodityModel,
    Category as CommodityCategoryModel)
from common.models.dev import DevBannerModel
from common.enums.public import BannerEnum
from common.utils.urls import UrlUtil
from common.utils.times import TimeUtil
from apps.api.schemas.minihome_schema import (
    MiniHomePagesVo, BannerListVo,
    GoodsListIn, GuessCategoryVo,
    CategoryVo
)

from hypertext import PagingResult
from apps.api.schemas.commodity_schema import CommodityListsVo


class MiniHomeService:
    """ MiniHome服务类 """

    @classmethod
    async def guess_categories(cls, limit: int = 10) -> List[GuessCategoryVo]:
        """
        获取随机分类列表（猜你想搜）

        Args:
            limit (int): 返回分类的数量，默认10个

        Returns:
            List[GuessCategoryVo]: 随机分类列表

        Author:
            zero
        """
        # 查询所有可见且未删除的分类
        categories = await CommodityCategoryModel.filter(
            is_show=1,
            is_delete=0
        ).all().values('id', 'title')
        
        # 随机排序分类
        random.shuffle(categories)
        
        # 限制返回数量
        categories = categories[:limit]
        
        # 格式化分类数据
        formatted_categories = []
        for category in categories:
            formatted_category = {
                'name': category['title'],
                'value': category['id']
            }
            vo = TypeAdapter(GuessCategoryVo).validate_python(formatted_category)
            formatted_categories.append(vo)
        
        return formatted_categories

    @classmethod
    async def pages(cls) -> MiniHomePagesVo:
        """
        获取MiniHome页面数据

        Returns:
            MiniHomePagesVo: 页面数据

        Author:
            zero
        """
        # 获取MINI类型的banner
        _banner_lists = await (
            DevBannerModel
            .filter(position=BannerEnum.MINI)
            .filter(is_disable=0, is_delete=0)
            .order_by("-sort", "-id")
            .all()
        )

        # 格式化banner数据
        banners = []
        for _banner in _banner_lists:
            vo = TypeAdapter(BannerListVo).validate_python(_banner.__dict__)
            vo.image = await UrlUtil.to_absolute_url(vo.image)
            banners.append(vo)

        # 获取推荐商品列表（默认10个）
        goods = await cls.goods_list(GoodsListIn(page=1, size=10))

        # 获取MINI_ENTER类型的banner
        _quick_enter_lists = await (
            DevBannerModel
            .filter(position=BannerEnum.MINI_ENTER)
            .filter(is_disable=0, is_delete=0)
            .order_by("-sort", "-id")
            .all()
        )

        # 格式化快速入口数据
        quickEnter = []
        for _enter in _quick_enter_lists:
            vo = TypeAdapter(BannerListVo).validate_python(_enter.__dict__)
            vo.image = await UrlUtil.to_absolute_url(vo.image)
            quickEnter.append(vo)

        return MiniHomePagesVo(
            banner=banners,
            goods=goods,
            quickEnter=quickEnter
        )

    @classmethod
    async def goods_list(cls, params: GoodsListIn) -> PagingResult[CommodityListsVo]:
        """
        获取推荐商品列表

        Args:
            params (GoodsListIn): 请求参数

        Returns:
            GoodsListVo: 商品列表数据

        Author:
            zero
        """
        # 构建搜索条件
        where = [Q(is_show=1, is_delete=0)]
        order = ['-sort', '-id']

        if params.type == "recommend":
            where.append(Q(is_recommend=1))
        elif params.type == "topping":
            where.append(Q(is_topping=1))
        elif params.type == "ranking":
            order = ['-sales', '-browse', '-collect', '-id']

        # 使用paginate函数进行分页查询
        _model = CommodityModel.filter(*where).order_by(*order)
        _pager = await CommodityModel.paginate(
            model=_model,
            page_no=params.page,
            page_size=params.size,
            fields=[
                "id", "cid", "title", "image", "intro", 
                "price", "fee", "stock", "sales", 
                "browse", "collect", "is_recommend", 
                "is_topping", "create_time", "update_time"
            ]
        )

        # 查询分类信息
        _category = {}
        cid_ids = [item["cid"] for item in _pager.lists if item["cid"]]
        if cid_ids:
            category_ = await (
                CommodityCategoryModel
                .filter(id__in=list(set(cid_ids)))
                .all()
                .values_list("id", "title")
            )
            _category = {k: v for k, v in category_}

        # 格式化商品数据
        formatted_items = []
        for item in _pager.lists:
            item["category"] = _category.get(item["cid"], "")
            # 处理图片列表URL
            if item["image"]:
                # 循环处理每个图片URL
                item["image"] = [await UrlUtil.to_absolute_url(url) for url in item["image"]]

            item["create_time"] = item["create_time"]
            item["update_time"] = item["update_time"]
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            formatted_items.append(vo)

        # 转换为GoodsListVo类型
        _pager.lists = formatted_items
        
        return _pager
    
    @classmethod
    async def search_goods(cls, params: GoodsListIn) -> PagingResult[CommodityListsVo]:
        """
        搜索商品列表

        Args:
            params (GoodsListIn): 请求参数

        Returns:
            PagingResult[CommodityListsVo]: 商品列表数据

        Author:
            zero
        """
        # 构建搜索条件
        where_map = {
            "=": ["cid@cid"],
            "%like%": ["keyword@title"],
            ">=": ["min_price@price"],
            "<=": ["max_price@price"]
        }
        
        where = CommodityModel.build_search(where_map, params.__dict__)
        
        # 排序规则, 0=默认, 1=销量
        order_by = ['-sales', '-browse', '-id'] if params.sort == 1 else ['-sort', '-id']
        
        
        # 查询商品列表并分页
        _model = CommodityModel.filter(*where).filter(Q(is_show=1, is_delete=0)).order_by(*order_by)
        _pager = await CommodityModel.paginate(
            model=_model,
            page_no=params.page,
            page_size=params.size,
            fields=[
                "id", "cid", "title", "image", "intro", 
                "price", "fee", "stock", "sales", 
                "browse", "collect", "is_recommend", 
                "is_topping", "create_time", "update_time"
            ]
        )
        
        # 查询分类信息
        _category = {}
        cid_ids = [item["cid"] for item in _pager.lists if item["cid"]]
        if cid_ids:
            category_ = await (
                CommodityCategoryModel
                .filter(id__in=list(set(cid_ids)))
                .all()
                .values_list("id", "title")
            )
            _category = {k: v for k, v in category_}
        
        # 格式化商品数据
        formatted_items = []
        for item in _pager.lists:
            item["category"] = _category.get(item["cid"], "")
            # 处理图片列表URL
            if item["image"]:
                # 循环处理每个图片URL
                item["image"] = [await UrlUtil.to_absolute_url(url) for url in item["image"]]
        
            item["create_time"] = item["create_time"]
            item["update_time"] = item["update_time"]
            
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            formatted_items.append(vo)
        
        # 转换为GoodsListVo类型
        _pager.lists = formatted_items
        
        return _pager
    
    @classmethod
    async def categories(cls) -> List[CategoryVo]:
        """
        获取商品分类列表，构建树形结构

        Returns:
            List[CategoryVo]: 商品分类列表（树形结构）

        Author:
            zero
        """
        # 查询分类信息
        categories = await (
            CommodityCategoryModel
            .filter(is_show=1, is_delete=0)
            .order_by("sort", "id")
            .all()
        )
        
        # 先将所有分类转换为字典并建立ID映射
        category_dict = {}
        for item in categories:
            category = {
                "catId": item.id,
                "catName": item.title,
                "backImg": await UrlUtil.to_absolute_url(item.image),
                "showPic": item.level == 0,
                "catLevel": 1 if item.level == 0 else 3,
                "showVideo": False,
                "children": []
            }
            if item.level == 0:
                category["children"].append({
                    "catId": random.randint(999, 9999),
                    "catName": "全部",
                    "catLevel": 1,
                    "children": []
                })
            category_dict[item.id] = category
        
        # 构建树形结构
        result = []
        for item in categories:
            current = category_dict[item.id]
            if item.parent_id and item.parent_id in category_dict:
                # 有父分类且父分类存在，添加到父分类的children中
                category_dict[item.parent_id]["children"][0]["children"].append(current)
            else:
                # 没有父分类或父分类不存在，作为顶级分类
                result.append(current)
        
        return result