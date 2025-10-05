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
import json
from typing import List, Dict, Any, Optional
from tortoise.expressions import Q
from pydantic import TypeAdapter
from common.models.commodity import ShoppingCart as ShoppingCartModel
from common.models.commodity import Commodity as CommodityModel
from common.utils.times import TimeUtil
from apps.api.schemas.shopping_cart_schema import (
    ShoppingCartAddIn,
    ShoppingCartDeleteIn,
    ShoppingCartUpdateIn,
    ShoppingCartSelectIn,
    ShoppingCartVo,
    ShoppingCartDetailVo,
    ShoppingCartListVo
)
import time


class ShoppingCartService:
    """ 购物车服务类 """
    
    @classmethod
    async def lists(cls, user_id: int) -> ShoppingCartListVo:
        """
        获取当前用户的购物车列表
        
        Args:
            user_id (int): 用户ID
        
        Returns:
            ShoppingCartListVo: 购物车列表信息
        """
        # 查询购物车数据
        cart_items = await ShoppingCartModel.filter(
            user_id=user_id,
            is_delete=0
        ).order_by("-update_time").all()
        
        # 提取商品ID列表
        commodity_ids = [item.commodity_id for item in cart_items]
        
        # 查询商品信息
        commodities = await CommodityModel.filter(
            id__in=commodity_ids,
            is_show=1,
            is_delete=0
        ).all()
        
        # 构建商品信息映射
        commodity_map = {item.id: item for item in commodities}
        
        # 构建购物车商品列表
        items = []
        total_count = 0
        selected_count = 0
        selected_price = 0.0
        
        for cart_item in cart_items:
            commodity = commodity_map.get(cart_item.commodity_id)
            if not commodity:
                # 商品不存在或已下架，跳过
                continue
            
            # 构建购物车详情VO
            item = ShoppingCartDetailVo(
                id=cart_item.id,
                commodity_id=cart_item.commodity_id,
                title=commodity.title,
                image=[await UrlUtil.to_absolute_url(url) for url in commodity.image],
                price=commodity.price,
                fee=commodity.fee,
                stock=commodity.stock,
                sales=commodity.sales,
                quantity=cart_item.quantity,
                sku=cart_item.sku,
                is_selected=cart_item.is_selected, 
                create_time=TimeUtil.timestamp_to_date(cart_item.create_time),
                update_time=TimeUtil.timestamp_to_date(cart_item.update_time)
            )
            
            items.append(item)
            total_count += 1
            
            # 计算选中商品的数量和总价
            if item.is_selected == 1:
                selected_count += 1
                selected_price += item.price * item.quantity
        
        return ShoppingCartListVo(
            total_count=total_count,
            selected_count=selected_count,
            selected_price=selected_price,
            items=items
        )
    
    @classmethod
    async def add(cls, user_id: int, params: ShoppingCartAddIn) -> Dict[str, Any]:
        """
        添加商品到购物车
        
        Args:
            user_id (int): 用户ID
            params (ShoppingCartAddIn): 添加购物车参数
        
        Returns:
            Dict[str, Any]: 操作结果
        """
        # 检查商品是否存在
        commodity = await CommodityModel.filter(
            id=params.commodity_id,
            is_show=1,
            is_delete=0
        ).first()
        
        if not commodity:
            return {"success": False, "message": "商品不存在或已下架"}
        
        # 检查库存
        if params.quantity > commodity.stock:
            return {"success": False, "message": "商品库存不足"}
        
        # 检查是否已存在相同商品和规格的购物车项
        existing_cart_item = await ShoppingCartModel.filter(
            user_id=user_id,
            commodity_id=params.commodity_id,
            sku=params.sku,
            is_delete=0
        ).first()
        
        current_time = int(time.time())
        
        if existing_cart_item:
            # 如果存在，则更新数量
            existing_cart_item.quantity += params.quantity
            existing_cart_item.update_time = current_time
            await existing_cart_item.save()
        else:
            # 如果不存在，则创建新的购物车项
            await ShoppingCartModel.create(
                user_id=user_id,
                commodity_id=params.commodity_id,
                quantity=params.quantity,
                sku=params.sku,
                is_delete=0,
                create_time=current_time,
                update_time=current_time
            )
        
        return {"success": True, "message": "添加购物车成功"}
    
    @classmethod
    async def delete(cls, user_id: int, params: ShoppingCartDeleteIn) -> Dict[str, Any]:
        """
        删除购物车商品
        
        Args:
            user_id (int): 用户ID
            params (ShoppingCartDeleteIn): 删除购物车参数
        
        Returns:
            Dict[str, Any]: 操作结果
        """
        # 查询用户的购物车项
        cart_items = await ShoppingCartModel.filter(
            id__in=params.ids,
            user_id=user_id,
            is_delete=0
        ).all()
        
        if not cart_items:
            return {"success": False, "message": "购物车商品不存在"}
        
        # 标记为已删除
        current_time = int(time.time())
        for item in cart_items:
            item.is_delete = 1
            item.delete_time = current_time
            await item.save()
        
        return {"success": True, "message": "删除成功"}
    
    @classmethod
    async def update(cls, user_id: int, params: ShoppingCartUpdateIn) -> Dict[str, Any]:
        """
        更新购物车商品数量
        
        Args:
            user_id (int): 用户ID
            params (ShoppingCartUpdateIn): 更新购物车参数
        
        Returns:
            Dict[str, Any]: 操作结果
        """
        # 查询购物车项
        cart_item = await ShoppingCartModel.filter(
            id=params.id,
            user_id=user_id,
            is_delete=0
        ).first()
        
        if not cart_item:
            return {"success": False, "message": "购物车商品不存在"}
        
        # 查询商品信息
        commodity = await CommodityModel.filter(
            id=cart_item.commodity_id,
            is_show=1,
            is_delete=0
        ).first()
        
        if not commodity:
            return {"success": False, "message": "商品不存在或已下架"}
        
        # 检查库存
        if params.quantity > commodity.stock:
            return {"success": False, "message": "商品库存不足"}
        
        # 更新数量
        cart_item.quantity = params.quantity
        cart_item.update_time = int(time.time())
        await cart_item.save()
        
        return {"success": True, "message": "更新成功"}
    
    @classmethod
    async def select(cls, user_id: int, params: ShoppingCartSelectIn) -> Dict[str, Any]:
        """
        选择或取消选择购物车商品
        
        Args:
            user_id (int): 用户ID
            params (ShoppingCartSelectIn): 选择购物车参数
        
        Returns:
            Dict[str, Any]: 操作结果
        """
        # 查询用户的购物车项
        cart_items = await ShoppingCartModel.filter(
            id__in=params.ids,
            user_id=user_id,
            is_delete=0
        ).all()
        
        if not cart_items:
            return {"success": False, "message": "购物车商品不存在"}
        
        # 更新选择状态
        for item in cart_items:
            item.is_selected = params.is_selected
            await item.save()
        
        return {"success": True, "message": "操作成功"}
    
    @classmethod
    async def clear(cls, user_id: int) -> Dict[str, Any]:
        """
        清空购物车
        
        Args:
            user_id (int): 用户ID
        
        Returns:
            Dict[str, Any]: 操作结果
        """
        # 查询用户的所有购物车项
        cart_items = await ShoppingCartModel.filter(
            user_id=user_id,
            is_delete=0
        ).all()
        
        if not cart_items:
            return {"success": True, "message": "购物车已为空"}
        
        # 标记为已删除
        current_time = int(time.time())
        for item in cart_items:
            item.is_delete = 1
            item.delete_time = current_time
            await item.save()
        
        return {"success": True, "message": "清空成功"}