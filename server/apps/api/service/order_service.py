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
import json
from tortoise.queryset import Q
from tortoise.expressions import Subquery
from decimal import Decimal
from typing import List, Dict, Any, Optional
from pydantic import TypeAdapter
from exception import AppException
from common.enums.market import PayStatusEnum, PayWayEnum, DeliveryStatusEnum
from common.utils.urls import UrlUtil
from common.utils.tools import ToolsUtil
from common.utils.times import TimeUtil
from common.models.market import MainOrderModel
from common.models.market import SubOrderModel
from common.models.market import WorkOrderModel
from common.models.commodity import Commodity
from common.models.commodity import ShoppingCart
from common.models.Address import Address
from apps.api.schemas import order_schema as schema


class OrderService:
    """ 订单服务类 """

    @classmethod
    async def create(cls, user_id: int, terminal: int, post: schema.OrderCreateIn) -> schema.OrderPlaceVo:
        """
        创建订单

        Args:
            user_id (int): 用户ID
            terminal (int): 操作平台
            post (schema.OrderCreateIn): 订单创建参数

        Returns:
            schema.OrderPlaceVo: 下单结果Vo
        """
        # 查询收货地址
        address_where = None
        if post.address_id is not None:
            address_where = Q(id=post.address_id)
        else:
            address_where = Q(is_default=1)
        address = await Address.filter(address_where).filter(user_id=user_id, is_delete=0).first()
        if not address:
            raise AppException("收货地址不存在")

        # 获取商品信息
        if post.is_from_cart:
            # 从购物车创建订单
            if not post.cart_ids:
                raise AppException("购物车ID列表不能为空")
            order_goods = await cls._get_cart_goods(user_id, post.cart_ids)
            if not order_goods:
                raise AppException("购物车商品不存在")
        else:
            # 创建单个商品订单
            if not post.commodity_id or not post.quantity:
                raise AppException("商品信息不完整")
            order_goods = [await cls._get_single_goods(user_id, post.commodity_id, post.quantity, post.sku)]

        # 计算订单总金额
        total_amount = Decimal(0)
        actual_pay_amount = Decimal(0)
        for goods in order_goods:
            total_amount += Decimal(str(goods['price'])) * Decimal(str(goods['quantity']))
        
        # 这里可以添加优惠逻辑
        discount_amount = Decimal(0)
        actual_pay_amount = total_amount - discount_amount

        # 生成订单号
        order_sn = await ToolsUtil.make_order_sn(MainOrderModel, "order_sn")
        current_time = int(time.time())

        # 创建主订单
        main_order = await MainOrderModel.create(
            user_id=user_id,
            order_sn=order_sn,
            total_amount=total_amount,
            discount_amount=discount_amount,
            actual_pay_amount=actual_pay_amount,
            terminal=terminal,
            pay_status=PayStatusEnum.WAITING,
            pay_way=PayWayEnum.NONE,  # 支付方式待选择
            order_type=2,  # 商品订单
            notify_status = 0,  # 未通知
            give_amount = Decimal(0),  # 充值订单默认不赠送金额
            receiver_name=address.name,
            receiver_phone=address.phone,
            receiver_address=f"{address.province}{address.city}{address.district}{address.address}",
            remark=post.remark or "",
            create_time=current_time,
            update_time=current_time
        )

        # 创建子订单
        for goods in order_goods:
            subtotal = Decimal(str(goods['price'])) * Decimal(str(goods['quantity']))
            
            # 构建额外参数（包含SKU信息）
            extra_params = {}
            if goods.get('sku'):
                extra_params['sku'] = goods['sku']
            
            await SubOrderModel.create(
                main_order_id=main_order.id,
                main_order_sn=order_sn,
                user_id=user_id,
                source_id=goods['commodity_id'],
                product_name=goods['title'],
                quantity=goods['quantity'],
                unit_price=goods['price'],
                subtotal_amount=subtotal,
                delivery_type=goods['delivery_type'],
                delivery_status=DeliveryStatusEnum.WAITING,  # 待发货
                create_time=current_time,
                update_time=current_time
            )

        # 如果是从购物车创建订单，删除购物车中已选中的商品
        if post.is_from_cart and post.cart_ids:
            await cls._clear_cart_items(user_id, post.cart_ids)

        return schema.OrderPlaceVo(
            order_id=main_order.id,
            order_sn=order_sn,
            total_amount=float(total_amount),
            actual_pay_amount=float(actual_pay_amount)
        )

    @classmethod
    async def _get_single_goods(cls, user_id: int, commodity_id: int, quantity: int, sku: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        获取单个商品信息

        Args:
            user_id (int): 用户ID
            commodity_id (int): 商品ID
            quantity (int): 购买数量
            sku (Optional[Dict[str, Any]]): 商品规格

        Returns:
            Dict[str, Any]: 商品信息
        """
        commodity = await Commodity.filter(id=commodity_id, is_show=1, is_delete=0).first()
        if not commodity:
            raise AppException(f"商品ID {commodity_id} 不存在或已下架")

        # 检查库存
        if quantity > commodity.stock:
            raise AppException(f"商品 {commodity.title} 库存不足")

        return {
            'commodity_id': commodity.id,
            'title': commodity.title,
            'image': await UrlUtil.to_absolute_url(commodity.main_image),
            'price': commodity.price,
            'fee': commodity.fee,
            'quantity': quantity,
            'sku': sku or {},
            'delivery_type': commodity.deliveryType
        }

    @classmethod
    async def _get_cart_goods(cls, user_id: int, cart_ids: List[int]) -> List[Dict[str, Any]]:
        """
        获取购物车商品信息

        Args:
            user_id (int): 用户ID
            cart_ids (List[int]): 购物车ID列表

        Returns:
            List[Dict[str, Any]]: 商品信息列表
        """
        # 查询购物车商品（使用传入的cart_ids过滤）
        cart_items = await ShoppingCart.filter(
            id__in=cart_ids,
            user_id=user_id,
            is_delete=0
        ).all()

        if not cart_items:
            raise AppException("购物车商品不存在")

        # 提取商品ID列表
        commodity_ids = [item.commodity_id for item in cart_items]

        # 查询商品信息
        commodities = await Commodity.filter(
            id__in=commodity_ids,
            is_show=1,
            is_delete=0
        ).all()

        # 构建商品信息映射
        commodity_map = {item.id: item for item in commodities}

        # 检查商品是否存在并构建商品列表
        order_goods = []
        for item in cart_items:
            commodity = commodity_map.get(item.commodity_id)
            if not commodity:
                raise AppException(f"购物车中的商品ID {item.commodity_id} 不存在或已下架")

            # 检查库存
            if item.quantity > commodity.stock:
                raise AppException(f"商品 {commodity.title} 库存不足")

            order_goods.append({
                'commodity_id': commodity.id,
                'title': commodity.title,
                'image': await UrlUtil.to_absolute_url(commodity.main_image),
                'price': commodity.price,
                'fee': commodity.fee,
                'quantity': item.quantity,
                'sku': item.sku if hasattr(item, 'sku') else {},
                'delivery_type': commodity.deliveryType
            })

        return order_goods

    @classmethod
    async def _clear_cart_items(cls, user_id: int, cart_ids: List[int]) -> None:
        """
        清除购物车中已选中的商品

        Args:
            user_id (int): 用户ID
            cart_ids (List[int]): 购物车ID列表
        """
        current_time = int(time.time())
        await ShoppingCart.filter(
            id__in=cart_ids,
            user_id=user_id,
            is_delete=0
        ).update(is_delete=1, delete_time=current_time)

    @classmethod
    async def detail(cls, user_id: int, order_id: Optional[int] = None, order_sn: Optional[str] = None) -> schema.OrderDetailVo:
        """
        获取订单详情

        Args:
            user_id (int): 用户ID
            order_id (Optional[int]): 订单ID
            order_sn (Optional[str]): 外部订单号

        Returns:
            schema.OrderDetailVo: 订单详情
        """
        # 查询主订单
        main_order = None
        if order_id:
            main_order = await MainOrderModel.filter(id=order_id, user_id=user_id, is_delete=0).first()
        elif order_sn:
            main_order = await MainOrderModel.filter(order_sn=order_sn, user_id=user_id, is_delete=0).first()
        else:
            raise AppException("订单ID或外部订单号不能为空")
        if not main_order:
            raise AppException("订单不存在")

        # 查询子订单
        sub_orders = await SubOrderModel.filter(main_order_id=main_order.id, is_delete=0).all()

        # 查询商品信息
        commodity_ids = [item.source_id for item in sub_orders]
        commodities = await Commodity.filter(
            id__in=commodity_ids,
            is_delete=0
        ).all()
        commodity_map = {item.id: item for item in commodities}
        
        # 查询售后工单
        sub_order_ids = [sub_order.id for sub_order in sub_orders]
        work_orders = await WorkOrderModel.filter(
            sub_order_id__in=sub_order_ids,
            is_delete=0
        ).all()
        work_order_map = {wo.sub_order_id: wo for wo in work_orders}

        # 构建订单商品列表
        goods_list = []
        for sub_order in sub_orders:
            commodity = commodity_map.get(sub_order.source_id)
            if commodity:
                # 安全地获取SKU信息
                sku = None
                if sub_order.extra_params and isinstance(sub_order.extra_params, dict):
                    sku = sub_order.extra_params.get('sku')
                work_order = work_order_map.get(sub_order.id)
                goods_list.append(schema.OrderGoodsItem(
                    sub_order_id=sub_order.id,
                    commodity_id=sub_order.source_id,
                    title=sub_order.product_name,
                    image=await UrlUtil.to_absolute_url(commodity.main_image),
                    price=float(sub_order.unit_price),
                    fee=commodity.fee if hasattr(commodity, 'fee') else None,
                    quantity=sub_order.quantity,
                    sku=sku,
                    delivery_type=sub_order.delivery_type,
                    delivery_status=sub_order.delivery_status,
                    logistics_company=sub_order.logistics_company,
                    logistics_no=sub_order.logistics_no,
                    status=sub_order.status if hasattr(sub_order, 'status') else 0,
                    work_order_id=work_order.id if work_order else 0,
                    refuse_reason=work_order.refuse_reason if work_order else ""
                ))

        # 构建订单详情返回对象
        return schema.OrderDetailVo(
            id=main_order.id,
            order_sn=main_order.order_sn,
            total_amount=float(main_order.total_amount),
            discount_amount=float(main_order.discount_amount) if hasattr(main_order, 'discount_amount') else 0.0,
            actual_pay_amount=float(main_order.actual_pay_amount),
            order_type=main_order.order_type,
            pay_status=main_order.pay_status,
            pay_way=main_order.pay_way,
            pay_time=TimeUtil.timestamp_to_date(main_order.pay_time) if main_order.pay_time else "",
            create_time=TimeUtil.timestamp_to_date(main_order.create_time),
            receiver_name=main_order.receiver_name,
            receiver_phone=main_order.receiver_phone,
            receiver_address=main_order.receiver_address,
            remark=main_order.remark or "",
            goods_list=goods_list
        )

    @classmethod
    async def lists(cls, user_id: int, keyword: Optional[str] = None, status: Optional[int] = None, query_type: Optional[str] = None, page: int = 1, size: int = 10) -> List[schema.OrderListVo]:
        """
        获取订单列表

        Args:
            user_id (int): 用户ID
            keyword (Optional[str]): 搜索关键词
            status (Optional[int]): 订单状态
            query_type (Optional[str]): 查询类型
            page (int): 页码
            size (int): 每页数量

        Returns:
            List[schema.OrderListVo]: 订单列表
        """
        # 计算偏移量
        offset = (page - 1) * size
        # 状态筛选
        where = []
        # 关键词筛选
        if keyword:
            where.append(Q(order_sn__contains=keyword) | Q(receiver_name__contains=keyword) | Q(receiver_phone__contains=keyword))
        if query_type == 'payStatus' and status is not None and status >= 0:
            where.append(Q(pay_status=status))
        elif query_type == 'deliveryStatus' and status is not None and status >= 0:
            # 定义子查询：获取 delivery_status 匹配的主订单 ID 列表
            subquery = Subquery(
                SubOrderModel.filter(
                    delivery_status=status,
                    is_delete=0  # 可选：添加子表删除标记过滤
                ).values_list('main_order_id', flat=True)
            )
            where.append(Q(id__in=subquery))
        # 查询主订单
        main_orders = await MainOrderModel.filter(*where).filter(
            user_id=user_id,
            is_delete=0
        ).order_by("-create_time").offset(offset).limit(size).all()

        if not main_orders:
            return []

        # 查询所有关联的子订单
        main_order_ids = [order.id for order in main_orders]
        sub_orders = await SubOrderModel.filter(
            main_order_id__in=main_order_ids,
            is_delete=0
        ).all()

        # 按主订单ID分组子订单
        sub_orders_by_main = {}
        for sub_order in sub_orders:
            if sub_order.main_order_id not in sub_orders_by_main:
                sub_orders_by_main[sub_order.main_order_id] = []
            sub_orders_by_main[sub_order.main_order_id].append(sub_order)

        # 查询所有相关的商品信息
        commodity_ids = [sub_order.source_id for sub_order in sub_orders]
        commodities = await Commodity.filter(
            id__in=commodity_ids,
            is_delete=0
        ).all()
        commodity_map = {item.id: item for item in commodities}
        
        # 查询售后工单
        sub_order_ids = [sub_order.id for sub_order in sub_orders]
        work_orders = await WorkOrderModel.filter(
            sub_order_id__in=sub_order_ids,
            is_delete=0
        ).all()
        work_order_map = {wo.sub_order_id: wo for wo in work_orders}

        # 构建订单列表
        order_list = []
        for main_order in main_orders:
            order_sub_orders = sub_orders_by_main.get(main_order.id, [])
            
            # 构建商品列表
            goods_list = []
            for sub_order in order_sub_orders:
                commodity = commodity_map.get(sub_order.source_id)
                if commodity:
                    # 安全地获取SKU信息
                    sku = None
                    if sub_order.extra_params and isinstance(sub_order.extra_params, dict):
                        sku = sub_order.extra_params.get('sku')
                    work_order = work_order_map.get(sub_order.id)
                    
                    goods_list.append(schema.OrderGoodsItem(
                        commodity_id=sub_order.source_id,
                        title=sub_order.product_name,
                        image=await UrlUtil.to_absolute_url(commodity.main_image),
                        price=float(sub_order.unit_price),
                        fee=commodity.fee if hasattr(commodity, 'fee') else None,
                        quantity=sub_order.quantity,
                        sku=sku,
                        sub_order_id=sub_order.id,
                        delivery_type=sub_order.delivery_type,
                        delivery_status=sub_order.delivery_status,
                        logistics_company=sub_order.logistics_company,
                        logistics_no=sub_order.logistics_no,
                        status=sub_order.status if hasattr(sub_order, 'status') else 0,
                        work_order_id=work_order.id if work_order else 0,
                        refuse_reason=work_order.refuse_reason if work_order else ""
                    ))

            # 计算商品总数量
            goods_count = sum(sub_order.quantity for sub_order in order_sub_orders)

            order_list.append(schema.OrderListVo(
                id=main_order.id,
                order_sn=main_order.order_sn,
                total_amount=float(main_order.total_amount),
                actual_pay_amount=float(main_order.actual_pay_amount),
                pay_status=main_order.pay_status,
                goods_count=goods_count,
                create_time=TimeUtil.timestamp_to_date(main_order.create_time),
                goods_list=goods_list
            ))

        return order_list


    @classmethod
    async def delete(cls, user_id: int, order_id: int) -> Dict[str, Any]:
        """
        删除订单

        Args:
            user_id (int): 用户ID
            order_id (int): 订单ID

        Returns:
            Dict[str, Any]: 操作结果
        """
        # 查询主订单
        main_order = await MainOrderModel.filter(id=order_id, user_id=user_id, is_delete=0).first()
        if not main_order:
            raise AppException("订单不存在")
        
        # 软删除主订单
        current_time = int(time.time())
        await MainOrderModel.filter(id=order_id).update(
            is_delete=1,
            delete_time=current_time,
            update_time=current_time
        )
        
        # 软删除相关的子订单
        await SubOrderModel.filter(main_order_id=order_id).update(
            is_delete=1,
            delete_time=current_time,
            update_time=current_time
        )
        
        
        return {"code": 0, "msg": "订单已成功删除"}

    @classmethod
    async def apply_after_sales(cls, user_id: int, post: schema.WorkOrderCreateIn) -> Dict[str, Any]:
        """
        申请售后
        """
        # Check sub order
        sub_order = await SubOrderModel.filter(id=post.sub_order_id, user_id=user_id, is_delete=0).first()
        if not sub_order:
            raise AppException("子订单不存在")
        
        if sub_order.status not in [0, None]:
             raise AppException("该订单状态无法申请售后")

        # Create WorkOrder
        current_time = int(time.time())
        await WorkOrderModel.create(
            user_id=user_id,
            main_order_id=sub_order.main_order_id,
            sub_order_id=sub_order.id,
            order_sn=sub_order.main_order_sn,
            type=post.type,
            status=0, # Pending
            reason=post.reason,
            return_type=post.return_type,
            create_time=current_time,
            update_time=current_time
        )

        # Update SubOrder status
        sub_order.status = 1 # Applying
        await sub_order.save()

        return {"code": 0, "msg": "申请提交成功"}

    @classmethod
    async def cancel_after_sales(cls, user_id: int, post: schema.WorkOrderCancelIn) -> Dict[str, Any]:
        """
        取消售后
        """
        work_order = await WorkOrderModel.filter(id=post.work_order_id, user_id=user_id, is_delete=0).first()
        if not work_order:
            raise AppException("售后工单不存在")
        
        if work_order.status == 2: # Completed
             raise AppException("已完成的售后单无法取消")
        
        # Soft delete work order
        current_time = int(time.time())
        work_order.is_delete = 1
        work_order.delete_time = current_time
        await work_order.save()

        # Reset SubOrder status
        await SubOrderModel.filter(id=work_order.sub_order_id).update(status=0)

        return {"code": 0, "msg": "取消成功"}

    @classmethod
    async def fill_return_logistics(cls, user_id: int, post: schema.WorkOrderLogisticsIn) -> Dict[str, Any]:
        """
        填写退货物流
        """
        work_order = await WorkOrderModel.filter(id=post.work_order_id, user_id=user_id, is_delete=0).first()
        if not work_order:
            raise AppException("售后工单不存在")
        
        if work_order.return_type != 2:
            raise AppException("非退货退款订单无需填写物流")
            
        work_order.logistics_company = post.logistics_company
        work_order.logistics_no = post.logistics_no
        work_order.update_time = int(time.time())
        await work_order.save()

        return {"code": 0, "msg": "物流信息提交成功"}

    @classmethod
    async def resubmit_after_sales(cls, user_id: int, post: schema.WorkOrderResubmitIn) -> Dict[str, Any]:
        """
        重新提交售后
        """
        work_order = await WorkOrderModel.filter(id=post.work_order_id, user_id=user_id, is_delete=0).first()
        if not work_order:
            raise AppException("售后工单不存在")
        
        if work_order.status != 3: # 3=Refused
            raise AppException("当前状态无法重新提交")
            
        work_order.type = post.type
        work_order.reason = post.reason
        work_order.return_type = post.return_type
        work_order.status = 0 # Reset to pending
        work_order.update_time = int(time.time())
        await work_order.save()

        # Update SubOrder status back to 1 (Applying)
        await SubOrderModel.filter(id=work_order.sub_order_id).update(status=1)

        return {"code": 0, "msg": "重新提交成功"}