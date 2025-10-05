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
    GoodsListVo, GoodsListIn
)
from apps.api.schemas.commodity_schema import CommodityListsVo


class MiniHomeService:
    """ MiniHome服务类 """

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
            goods=goods.list,
            quickEnter=quickEnter
        )

    @classmethod
    async def goods_list(cls, params: GoodsListIn) -> GoodsListVo:
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

        # 计算总条数
        total = await CommodityModel.filter(*where).count()

        # 计算偏移量
        offset = (params.page - 1) * params.size

        # 查询推荐商品
        items = await (
            CommodityModel
            .filter(*where)
            .order_by(*order)
            .offset(offset)
            .limit(params.size)
            .values(
                "id", "cid", "title", "image", "intro", 
                "price", "fee", "stock", "sales", 
                "browse", "collect", "is_recommend", 
                "is_topping", "create_time", "update_time"
            )
        )

        # 查询分类信息
        _category = {}
        cid_ids = [item["cid"] for item in items if item["cid"]]
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
        for item in items:
            item["category"] = _category.get(item["cid"], "")
            # 处理图片列表URL
            if item["image"]:
                # 循环处理每个图片URL
                item["image"] = [await UrlUtil.to_absolute_url(url) for url in item["image"]]

            item["create_time"] = TimeUtil.timestamp_to_date(item["create_time"])
            item["update_time"] = TimeUtil.timestamp_to_date(item["update_time"])
            vo = TypeAdapter(CommodityListsVo).validate_python(item)
            formatted_items.append(vo)

        return GoodsListVo(
            list=formatted_items,
            total=total,
            page=params.page,
            size=params.size
        )