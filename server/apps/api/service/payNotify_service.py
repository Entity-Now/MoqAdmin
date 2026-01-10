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
from tortoise.models import in_transaction
from common.enums.wallet import WalletEnum
from common.enums.market import PayStatusEnum, PayWayEnum, OrderTypeEnum
from common.models.users import UserModel
from common.models.users import UserWalletModel
from common.models.market import MainOrderModel
from common.models.market import SubOrderModel


class PayNotifyService:
    """ 支付回调服务类 """

    @classmethod
    async def handle(cls, order_type: int, order_sn: str, transaction_id: str = ""):
        async with in_transaction("mysql"):
            if order_type == OrderTypeEnum.RECHARGE:
                await cls.recharge(order_sn, transaction_id)
            elif order_type == OrderTypeEnum.SHOPPING:
                await cls.commodity(order_sn, transaction_id)
            else:
                raise Exception("订单类型不存在")

    @classmethod
    async def recharge(cls, order_sn: str, transaction_id: str = ""):
        """
        充值回调处理方法

        Args:
            order_sn (str): 订单编号
            transaction_id (str, optional): 交易编号. Defaults to "".
        """
        # 查询主订单
        main_order = await MainOrderModel.filter(order_sn=order_sn).first()
        if not main_order:
            raise Exception("订单不存在")

        # 查询对应的子订单
        sub_order = await SubOrderModel.filter(main_order_id=main_order.id).first()
        if not sub_order:
            raise Exception("子订单不存在")

        # 查询用户
        user = await UserModel.filter(id=main_order.user_id).first()
        if not user:
            raise Exception("用户不存在")

        if sub_order.order_type == 1:
            # 充值逻辑，增加余额
            recharge_amount = (main_order.actual_pay_amount + sub_order.give_amount)
            user.balance += recharge_amount
            await user.save()
        elif sub_order.order_type == 2:
            pass
        
        # 更新主订单状态
        main_order.pay_time = int(time.time())
        main_order.pay_status = PayStatusEnum.PAID
        main_order.transaction_id = transaction_id
        await main_order.save()
        
        # 更新子订单状态
        sub_order.pay_status = PayStatusEnum.PAID
        sub_order.transaction_id = transaction_id
        await sub_order.save()

        # 记录流水
        await UserWalletModel.inc(
            user_id=user.id,
            source_type=WalletEnum.UM_DEC_RECHARGE,
            change_amount=recharge_amount,
            source_id=main_order.id,
            source_sn=main_order.order_sn,
            remarks=WalletEnum.get_source_type_msg(WalletEnum.UM_DEC_RECHARGE),
        )

    @classmethod
    async def commodity(cls, order_sn: str, transaction_id: str = ""):
        """
        商品购买回调处理方法

        Args:
            order_sn (str): 订单编号
            transaction_id (str, optional): 交易编号. Defaults to "".
        """
        # 查询主订单
        main_order = await MainOrderModel.filter(order_sn=order_sn).first()
        if not main_order:
            raise Exception("订单不存在")

        # 查询用户
        user = await UserModel.filter(id=main_order.user_id).first()
        if not user:
            raise Exception("用户不存在")

        buy_amount: Optional[float] = None
        
        # 判断支付方式
        if main_order.pay_way == PayWayEnum.BALANCE:
            # 检查余额是否充足
            buy_amount = (main_order.actual_pay_amount - main_order.give_amount)
            if user.balance < buy_amount:
                raise Exception("余额不足")
            # 商品购买逻辑，减少余额
            user.balance -= buy_amount
            await user.save()
            # 记录流水
            await UserWalletModel.inc(
                user_id=user.id,
                source_type=WalletEnum.UM_DEC_COMMODITY,
                change_amount=buy_amount,
                source_id=main_order.id,
                source_sn=main_order.order_sn,
                remarks=WalletEnum.get_source_type_msg(WalletEnum.UM_DEC_COMMODITY),
            )
        else:
            buy_amount = main_order.actual_pay_amount
        # 更新主订单状态
        main_order.pay_time = int(time.time())
        main_order.pay_status = PayStatusEnum.PAID
        main_order.transaction_id = transaction_id
        await main_order.save()
        

