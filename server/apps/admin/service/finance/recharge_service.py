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
from pydantic import TypeAdapter
from tortoise.queryset import Q
from hypertext import PagingResult
from common.utils.urls import UrlUtil
from common.enums.pay import PayEnum
from common.models.users import UserModel
from common.models.market import MainOrderModel
from common.models.market import SubOrderModel
from apps.admin.schemas.finance import recharge_schema as schema


class RechargeService:

    @classmethod
    async def lists(cls, params: schema.RechargeSearchIn) -> PagingResult[schema.RechargeListVo]:
        """
        充值记录列表。

        Args:
            params (schema.RechargeSearchIn): 充值记录查询参数。

        Returns:
            PagingResult[schema.RechargeListVo]: 充值记录分页列表Vo。

        Author:
            zero
        """
        # 先查询主订单表，获取基本信息
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

        # 获取主订单信息
        _model = MainOrderModel.filter(*where).order_by("-id")
        _pager = await MainOrderModel.paginate(
            model=_model,
            page_no=params.page_no,
            page_size=params.page_size,
            datetime_field=["create_time", "pay_time"]
        )

        # 获取对应的子订单信息（只取充值类型的子订单）
        main_order_ids = [item["id"] for item in _pager.lists]
        sub_orders = await SubOrderModel.filter(
            main_order_id__in=main_order_ids,
            order_type=1  # 充值类型
        ).all().values(
            "main_order_id", "order_type", "source_id", "give_amount", 
            "delivery_type", "delivery_status"
        )
        
        # 将子订单信息映射到主订单ID
        sub_orders_map = {}
        for sub_order in sub_orders:
            sub_orders_map[sub_order["main_order_id"]] = sub_order

        users = {}
        user_ids = [item["user_id"] for item in _pager.lists if item["user_id"]]
        if user_ids:
            user_ = await UserModel.filter(id__in=list(set(user_ids))).all().values("id", "sn", "nickname", "avatar", "mobile")
            for item in user_:
                users[item["id"]] = item

        list_vo = []
        for item in _pager.lists:
            user_dict = users.get(item["user_id"]) or {}
            # 获取对应子订单信息
            sub_order = sub_orders_map.get(item["id"]) or {}
            
            # 构建响应数据
            vo_data = {
                "id": item["id"],
                "order_sn": item["order_sn"],
                "order_type": sub_order.get("order_type", 1),
                "transaction_id": item["transaction_id"],
                "paid_amount": item["actual_pay_amount"],
                "give_amount": sub_order.get("give_amount", 0),
                "pay_way": PayEnum.get_pay_way_msg(item["pay_way"]),
                "terminal": item["terminal"],
                "pay_status": item["pay_status"],
                "delivery_type": sub_order.get("delivery_type", 0),
                "delivery_status": sub_order.get("delivery_status", 0),
                "ip": item["ip"] or "",
                "remark": item["remark"] or "",
                "create_time": item["create_time"],
                "pay_time": item["pay_time"] or "-",
                "user": {
                    "sn": user_dict.get("sn", ""),
                    "avatar": await UrlUtil.to_absolute_url(user_dict.get("avatar", "")),
                    "nickname": user_dict.get("nickname", ""),
                    "mobile": user_dict.get("mobile", "")
                }
            }

            vo = TypeAdapter(schema.RechargeListVo).validate_python(vo_data)
            list_vo.append(vo)

        _pager.lists = list_vo
        _pager.extend = {
            "payWay": PayEnum.get_pay_way_msg(True),
            "payStatus": PayEnum.get_pay_status_msg(True)
        }
        return _pager
