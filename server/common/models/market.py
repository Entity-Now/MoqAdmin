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
from tortoise import fields
from kernels.model import DbModel


class RechargeOrderModel(DbModel):
    """通用订单表（兼容充值、商品、卡密、实物）"""
    
    id = fields.IntField(pk=True, unsigned=True, description="主键")
    user_id = fields.IntField(null=False, default=0, description="用户ID")
    order_sn = fields.CharField(null=False, max_length=64, default="", description="订单编号")

    # ========== 新增通用字段 ==========
    order_type = fields.SmallIntField(null=False, default=1, description="订单类型: [1=充值, 2=商品]")
    source_id = fields.IntField(null=False, default=0, description="来源ID: 对应套餐ID或商品ID")
    # ========== 支付信息 ==========
    terminal = fields.SmallIntField(null=False, default=0, description="来源平台: [1=小程序, 2=公众号, 3=H5, 4=PC, 5=安卓, 6=苹果]")
    pay_way = fields.SmallIntField(null=False, default=0, description="支付方式: [2=微信, 3=支付宝]")
    pay_status = fields.SmallIntField(null=False, default=0, description="支付状态: [0=待支付, 1=已支付]")
    transaction_id = fields.CharField(null=False, max_length=64, default="", description="支付流水号")
    paid_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="支付金额")
    give_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="赠送金额（仅用于充值）")

    # ========== 发货处理（商品/卡密/实物） ==========
    delivery_type = fields.SmallIntField(null=False, default=0, description="发货方式: [0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货]")
    delivery_status = fields.SmallIntField(null=False, default=0, description="发货状态: [0=未发货, 1=等待发货, 2=已发货, 3=失败, 4=已收货]")

    # ========== 通知与调试 ==========
    notify_status = fields.SmallIntField(null=False, default=0, description="通知状态: [0=未通知, 1=成功, 2=失败]")
    remark = fields.TextField(null=False, default="", description="订单备注")
    extra_params = fields.JSONField(null=True, default={}, description="请求/回调附加信息（原始参数、响应内容等）")

    # ========== 用户行为追踪 ==========
    ip = fields.CharField(null=True, max_length=64, default="", description="用户IP地址")
    user_agent = fields.TextField(null=True, default="", description="用户User-Agent")

    # ========== 收货信息（预留） ==========
    receiver_name = fields.CharField(null=True, max_length=64, default="", description="收货人姓名")
    receiver_phone = fields.CharField(null=True, max_length=20, default="", description="收货人手机号")
    receiver_address = fields.TextField(null=True, default="", description="收货地址")

    # ========== 通用时间字段 ==========
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    pay_time = fields.IntField(null=False, default=0, description="支付时间")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "通用订单表（兼容充值与商品）"
        table = DbModel.table_prefix("recharge_order")



class RechargePackageModel(DbModel):
    id = fields.IntField(pk=True, unsigned=True, description="主键")
    name = fields.CharField(null=False, max_length=100, default="", description="套餐名称")
    money = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="充值金额")
    give_money = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="赠送金额")
    sort = fields.IntField(null=False, default=0, description="排序编号")
    is_show = fields.SmallIntField(null=False, default=0, description="是否显示: [0=否, 1=是]")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除: [0=否, 1=是]")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "充值套餐表"
        table = DbModel.table_prefix("recharge_package")
