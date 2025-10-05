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
from decimal import Decimal
from typing import List
from pydantic import TypeAdapter
from exception import AppException
from common.enums.pay import PayEnum
from common.utils.tools import ToolsUtil
from common.utils.config import ConfigUtil
from common.models.market import MainOrderModel
from common.models.market import SubOrderModel
from common.models.market import RechargePackageModel
from apps.api.schemas import recharge_schema as schema


class RechargeService:
    """ 充值服务类 """

    @classmethod
    async def package(cls) -> List[schema.RechargePackageVo]:
        """
        发起充值

        Returns:
            List[schema.RechargePackageVo]: 套餐列表Vo。

        Author:
            zero
        """
        lists = await RechargePackageModel\
            .filter(is_show=0, is_delete=0)\
            .order_by("-sort", "-id")\
            .all().values("id", "name", "money", "give_money")

        return [TypeAdapter(schema.RechargePackageVo).validate_python(item) for item in lists]

    @classmethod
    async def place(cls, user_id: int, terminal: int, post: schema.RechargeIn) -> schema.RechargePlaceVo:
        """
        发起充值

        Args:
            user_id (int): 用户ID。
            terminal (int): 操作平台。
            post (schema.RechargeIn): 充值参数。

        Returns:
            schema.RechargePlaceVo: 下单结果Vo。

        Author:
            zero
        """
        give_amount: Decimal = Decimal(0)
        paid_amount: Decimal = Decimal(post.money)

        config = await ConfigUtil.get("recharge") or {"status": 0, "min_recharge": 0}
        status = config.get("status")
        if status != "0":
            raise AppException("充值通道已关闭")

        # 查询下套餐
        package = None
        if post.source_id:
            package = await RechargePackageModel.filter(id=post.source_id, is_delete=0).first()
            if not package:
                raise AppException("套餐不存在")
            if not package.is_show == 0:
                raise AppException("套餐已下架")
            give_amount = package.give_money
            paid_amount = package.money
        else:
            if config.get("min_recharge") and paid_amount < config.get("min_recharge"):
                raise AppException(f"最低充值金额不能少于: " + str(config.get("min_recharge")))

        # 生成订单号
        order_sn = await ToolsUtil.make_order_sn(MainOrderModel, "order_sn")
        
        # 创建主订单
        main_order = await MainOrderModel.create(
            user_id=user_id,
            order_sn=order_sn,
            total_amount=paid_amount,
            actual_pay_amount=paid_amount,
            pay_status=PayEnum.PAID_NO,
            pay_type=PayEnum.WAY_MNP,
            terminal=terminal,
            created_at=int(time.time()),
            updated_at=int(time.time())
        )
        
        # 创建子订单
        sub_order = await SubOrderModel.create(
            main_order_id=main_order.id,
            user_id=user_id,
            order_type=1,
            product_id=post.source_id,
            product_name=package.name if package else "自定义充值",
            price=paid_amount,
            give_amount=give_amount,
            total_price=paid_amount,
            created_at=int(time.time()),
            updated_at=int(time.time())
        )

        return schema.RechargePlaceVo(
            order_id=main_order.id,
            paid_amount=paid_amount
        )
