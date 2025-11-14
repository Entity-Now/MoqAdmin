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

class TerminalEnum:
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


class PayWayEnum:
    """支付方式枚举"""
    WECHAT = 2   # 微信
    ALIPAY = 3   # 支付宝

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WECHAT: "微信",
            cls.ALIPAY: "支付宝"
        }
        return _desc.get(code, "")


class PayStatusEnum:
    """支付状态枚举"""
    WAITING = 0  # 待支付
    PAID = 1     # 已支付

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WAITING: "待支付",
            cls.PAID: "已支付"
        }
        return _desc.get(code, "")


class OrderTypeEnum:
    """订单类型枚举"""
    RECHARGE = 1   # 充值
    SHOPPING = 2    # 商品
    MEMBERSHIP = 3  # 开会员

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.RECHARGE: "充值",
            cls.PRODUCT: "商品",
            cls.MEMBERSHIP: "开会员"
        }
        return _desc.get(code, "")


class DeliveryTypeEnum:
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


class DeliveryStatusEnum:
    """发货状态枚举"""
    WAITING = 0     # 待发货
    DELIVERED = 1   # 已发货
    COMPLETED = 2   # 已退货

    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.WAITING: "待付款",
            cls.PAID: "已付款",
            cls.DELIVERED: "已发货",
            cls.REFUNDED: "已退款",
            cls.COMPLETED: "已完成"
        }
        return _desc.get(code, "")


class NotifyStatusEnum:
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