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

from enum import IntEnum

class TerminalEnum(IntEnum):
    """来源平台枚举"""
    MNP = 1      # 小程序
    OA = 2       # 公众号
    H5 = 3       # H5
    PC = 4       # PC
    ANDROID = 5  # 安卓
    IOS = 6      # 苹果

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.MNP: "小程序",
            cls.OA: "公众号",
            cls.H5: "H5",
            cls.PC: "PC",
            cls.ANDROID: "安卓",
            cls.IOS: "苹果"
        }
        return _desc.get(code, "")


class PayWayEnum(IntEnum):
    """支付方式枚举"""
    NONE = 0     # 未选择
    BALANCE = 1  # 余额支付
    WECHAT = 2   # 微信
    ALIPAY = 3   # 支付宝

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.NONE: "未选择",
            cls.BALANCE: "余额支付",
            cls.WECHAT: "微信",
            cls.ALIPAY: "支付宝"
        }
        return _desc.get(code, "")


class PayStatusEnum(IntEnum):
    """支付状态枚举"""
    WAITING = 0  # 待支付
    PAID = 1     # 已支付
    REFUNDED = 2  # 已退款

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WAITING: "待支付",
            cls.PAID: "已支付",
            cls.REFUNDED: "已退款"
        }
        return _desc.get(code, "")


class OrderTypeEnum(IntEnum):
    """订单类型枚举"""
    RECHARGE = 1   # 充值
    SHOPPING = 2    # 商品
    MEMBERSHIP = 3  # 开会员

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.RECHARGE: "充值",
            cls.SHOPPING: "商品",
            cls.MEMBERSHIP: "开会员"
        }
        return _desc.get(code, "")


class DeliveryTypeEnum(IntEnum):
    """发货方式枚举"""
    NO_NEED = 0     # 无需发货
    AUTO_CARD = 1   # 自动发卡
    MANUAL = 2      # 人工发货
    LOGISTICS = 3   # 物流发货

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.NO_NEED: "无需发货",
            cls.AUTO_CARD: "自动发卡",
            cls.MANUAL: "人工发卡",
            cls.LOGISTICS: "物流发货"
        }
        return _desc.get(code, "")


class DeliveryStatusEnum(IntEnum):
    """发货状态枚举"""
    WAITING = 0     # 待发货
    DELIVERED = 1   # 已发货
    REFUNDED = 2   # 已退货

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WAITING: "待发货",
            cls.DELIVERED: "已发货",
            cls.REFUNDED: "已退货"
        }
        return _desc.get(code, "")


class NotifyStatusEnum(IntEnum):
    """通知状态枚举"""
    WAITING = 0     # 未通知
    SUCCESS = 1     # 成功
    FAILED = 2      # 失败

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WAITING: "未通知",
            cls.SUCCESS: "成功",
            cls.FAILED: "失败"
        }
        return _desc.get(code, "")


class AfterSalesStatusEnum(IntEnum):
    """售后状态枚举"""
    NONE = 0        # 无
    APPLYING = 1    # 申请售后
    AGREE = 2       # 同意退货
    SUCCESS = 3     # 退货成功
    REFUSE = 4      # 拒绝退货

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.NONE: "无",
            cls.APPLYING: "申请售后",
            cls.AGREE: "同意退货",
            cls.SUCCESS: "退货成功",
            cls.REFUSE: "拒绝退货"
        }
        return _desc.get(code, "")


class WorkOrderTypeEnum(IntEnum):
    """工单类型枚举"""
    REFUND = 1      # 仅退款
    RETURN_REFUND = 2 # 退货退款

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.REFUND: "仅退款",
            cls.RETURN_REFUND: "退货退款"
        }
        return _desc.get(code, "")


class WorkOrderStatusEnum(IntEnum):
    """工单状态枚举"""
    PENDING = 0     # 待处理
    PROCESSING = 1  # 处理中
    COMPLETED = 2   # 已完成
    REFUSED = 3     # 已拒绝

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.PENDING: "待处理",
            cls.PROCESSING: "处理中",
            cls.COMPLETED: "已完成",
            cls.REFUSED: "已拒绝"
        }
        return _desc.get(code, "")


class RefundTypeEnum(IntEnum):
    """退款/售后类型枚举"""
    REFUND_ONLY = 1  # 仅退款
    RETURN_AND_REFUND = 2 # 退货退款

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.REFUND_ONLY: "仅退款",
            cls.RETURN_AND_REFUND: "退货退款"
        }
        return _desc.get(code, "")