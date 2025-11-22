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
from typing import Dict, Any
from pydantic import TypeAdapter
from tortoise.queryset import Q
from hypertext import PagingResult
from common.utils.urls import UrlUtil
from common.enums.pay import PayEnum
from exception import AppException
from common.enums.market import DeliveryStatusEnum
from common.models.users import UserModel
from common.models.market import MainOrderModel, SubOrderModel, WorkOrderModel
from common.models.commodity import Commodity
from apps.admin.schemas.finance import order_schema as schema


class OrderService:

    @classmethod
    async def lists(cls, params: schema.OrderSearchIn) -> PagingResult[schema.OrderListVo]:
        """
        订单列表。

        Args:
            params (schema.OrderSearchIn): 订单查询参数。

        Returns:
            PagingResult[schema.OrderListVo]: 订单分页列表Vo。

        Author:
            zero
        """
        # 构建查询条件
        where = []
        if params.pay_way:
            where.append(Q(pay_way=params.pay_way))
        if params.pay_status:
            where.append(Q(pay_status=params.pay_status))
        if params.start_time:
            where.append(Q(create_time__gte=params.start_time))
        if params.end_time:
            where.append(Q(create_time__lte=params.end_time))
        if params.order_sn:
            where.append(Q(order_sn__icontains=params.order_sn))
        
        # 用户信息搜索
        if params.user:
            user = await (
                UserModel
                .filter(is_delete=0)
                .filter(Q(sn=params.user) | Q(mobile=params.user) | Q(nickname=params.user))
                .limit(100)
                .values("id")
            )
            
            user_ids = [item["id"] for item in user if item["id"]]
            if user_ids:
                where.append(Q(user_id__in=list(set(user_ids))))
        
        # 查询主订单总数
        total = await MainOrderModel.filter(*where).filter(is_delete=0).count()
        
        # 查询主订单列表（分页）
        main_orders = await (
            MainOrderModel
            .filter(*where)
            .filter(is_delete=0)
            .order_by("-create_time")
            .offset((params.page_no - 1) * params.page_size)
            .limit(params.page_size)
            .all()
        )
        
        if not main_orders:
            return PagingResult.create([], total, params.page_no, params.page_size)
        
        # 获取所有相关的用户ID
        user_ids = [order.user_id for order in main_orders]
        users = await UserModel.filter(id__in=user_ids).filter(is_delete=0).all()
        user_map = {user.id: user for user in users}
        
        # 获取所有相关的主订单ID
        main_order_ids = [order.id for order in main_orders]
        
        # 查询所有相关的子订单
        sub_orders = await SubOrderModel.filter(main_order_id__in=main_order_ids).filter(is_delete=0).all()
        
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
        
        # 查询所有相关的售后工单
        sub_order_ids = [sub_order.id for sub_order in sub_orders]
        work_orders = await WorkOrderModel.filter(
            sub_order_id__in=sub_order_ids,
            is_delete=0
        ).all()
        work_order_map = {wo.sub_order_id: wo for wo in work_orders}
        
        # 构建订单列表
        order_list = []
        for main_order in main_orders:
            user = user_map.get(main_order.user_id)
            user_account = user.nickname if user else ''
            
            # 构建商品列表
            goods_list = []
            order_sub_orders = sub_orders_by_main.get(main_order.id, [])
            for sub_order in order_sub_orders:
                # 安全地获取SKU信息
                sku = None
                if hasattr(sub_order, 'extra_params') and sub_order.extra_params:
                    try:
                        import json
                        if isinstance(sub_order.extra_params, str):
                            extra_params = json.loads(sub_order.extra_params)
                        else:
                            extra_params = sub_order.extra_params
                        sku = extra_params.get('sku')
                    except:
                        sku = None
                
                # 从商品映射中获取商品信息
                commodity = commodity_map.get(sub_order.source_id)
                image = []
                fee = 0.0
                
                if commodity:
                    # 转换商品图片为绝对URL
                    try:
                        if hasattr(commodity, 'image') and commodity.image:
                            # 处理图片列表，转换为绝对URL
                            if isinstance(commodity.image, list):
                                image = [await UrlUtil.to_absolute_url(url) for url in commodity.image]
                            elif isinstance(commodity.image, str):
                                # 如果是字符串，尝试解析为列表
                                try:
                                    import json
                                    image_list = json.loads(commodity.image)
                                    if isinstance(image_list, list):
                                        image = [await UrlUtil.to_absolute_url(url) for url in image_list]
                                    else:
                                        image = [await UrlUtil.to_absolute_url(commodity.image)]
                                except:
                                    image = [await UrlUtil.to_absolute_url(commodity.image)]
                    except:
                        image = []
                    
                    # 获取商品运费
                    if hasattr(commodity, 'fee'):
                        fee = commodity.fee
                
                goods_list.append(schema.OrderGoodsItem(
                    sub_order_id=sub_order.id,
                    commodity_id=sub_order.source_id,
                    title=sub_order.product_name,
                    image=image,
                    price=float(sub_order.unit_price),
                    fee=float(fee),
                    quantity=sub_order.quantity,
                    sku=sku,
                    delivery_type=sub_order.delivery_type,
                    delivery_status=sub_order.delivery_status if hasattr(sub_order, 'delivery_status') else 0,
                    logistics_company=sub_order.logistics_company if hasattr(sub_order, 'logistics_company') else None,
                    logistics_no=sub_order.logistics_no if hasattr(sub_order, 'logistics_no') else None,
                    status=sub_order.status if hasattr(sub_order, 'status') else 0,
                    work_order_id=work_order_map.get(sub_order.id).id if work_order_map.get(sub_order.id) else 0
                ))
            
            # 创建订单列表Vo
            order_list.append(schema.OrderListVo(
                id=main_order.id,
                user_id=main_order.user_id,
                user_account=user_account,
                order_sn=main_order.order_sn,
                total_amount=float(main_order.total_amount),
                actual_pay_amount=float(main_order.actual_pay_amount),
                order_type=main_order.order_type,
                pay_status=main_order.pay_status,
                pay_time=str(main_order.pay_time) if main_order.pay_time else '',
                create_time=str(main_order.create_time),
                receiver_name=main_order.receiver_name if hasattr(main_order, 'receiver_name') else '',
                receiver_phone=main_order.receiver_phone if hasattr(main_order, 'receiver_phone') else '',
                receiver_address=main_order.receiver_address if hasattr(main_order, 'receiver_address') else '',
                remark=main_order.remark if hasattr(main_order, 'remark') else '',
                goods_list=goods_list
            ))
        
        return PagingResult.create(order_list, total, params.page_no, params.page_size)

    @classmethod
    async def delivery_order(cls, sub_order_id: int, logistics_company: str, logistics_no: str) -> str:
        """发货订单"""
        try:
            # 验证物流信息
            if not logistics_company or not logistics_no:
                raise AppException("物流公司和物流单号不能为空")
            
            sub_order = await SubOrderModel.filter(id=sub_order_id).first()
            if not sub_order:
                raise AppException(f"子订单ID {sub_order_id} 不存在")
            
            sub_order.delivery_status = DeliveryStatusEnum.DELIVERED
            sub_order.logistics_company = logistics_company
            sub_order.logistics_no = logistics_no
            await sub_order.save()
        except AppException as e:
            raise e

    @classmethod
    async def handle_after_sales(cls, params: schema.WorkOrderHandleIn) -> Dict[str, Any]:
        """
        处理售后
        """
        work_order = await WorkOrderModel.filter(id=params.work_order_id, is_delete=0).first()
        if not work_order:
            raise AppException("售后工单不存在")

        current_time = int(time.time())
        
        if params.action == 'agree':
            # 同意售后
            # 如果是仅退款，直接完成
            # 如果是退货退款，状态变为处理中（等待用户退货）
            if work_order.return_type == 1: # 仅退款
                work_order.status = 2 # 已完成
                # TODO: 这里应该调用退款逻辑
            else:
                work_order.status = 1 # 处理中
            
            work_order.update_time = current_time
            await work_order.save()
            
            # Update SubOrder status
            # If completed, set sub order status to 2 (Refunded/Returned)
            if work_order.status == 2:
                 await SubOrderModel.filter(id=work_order.sub_order_id).update(status=3) # 3=退货成功

        elif params.action == 'refuse':
            # 拒绝售后
            if not params.refuse_reason:
                raise AppException("请填写拒绝原因")
            
            work_order.status = 3 # 已拒绝
            work_order.refuse_reason = params.refuse_reason
            work_order.update_time = current_time
            await work_order.save()
            
            # Update SubOrder status to 4 (Refused)
            await SubOrderModel.filter(id=work_order.sub_order_id).update(status=4)

        elif params.action == 'confirm':
            # 确认退货成功
            if work_order.return_type != 2:
                 raise AppException("非退货订单无法确认退货")
            
            if work_order.status != 1:
                raise AppException("当前状态无法确认退货")

            work_order.status = 2 # 已完成
            work_order.update_time = current_time
            await work_order.save()
            
             # Update SubOrder status to 3 (Returned)
            await SubOrderModel.filter(id=work_order.sub_order_id).update(status=3)
            
            # TODO: 这里应该调用退款逻辑

        else:
            raise AppException("无效的操作类型")

        return {"code": 0, "msg": "操作成功"}
