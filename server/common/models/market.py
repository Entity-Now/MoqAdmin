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
from common.enums.market import TerminalEnum, PayWayEnum, PayStatusEnum, OrderTypeEnum, DeliveryTypeEnum, DeliveryStatusEnum, NotifyStatusEnum


class MainOrderModel(DbModel):
    """主订单表（记录整笔订单的汇总信息）"""
    
    id = fields.IntField(pk=True, unsigned=True, description="主键")
    user_id = fields.IntField(null=False, default=0, description="用户ID")
    order_sn = fields.CharField(null=False, max_length=64, default="", description="主订单编号")

    # 整体订单信息
    order_type = fields.SmallIntField(null=False, default=1, description="订单类型: [1=充值, 2=商品, 3=开会员]")
    total_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="订单总金额")
    discount_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="折扣金额")
    actual_pay_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="实际支付金额")

    # 支付相关（主订单级别的支付信息）
    terminal = fields.IntField(null=False, default=0, description="来源平台")
    pay_way = fields.IntField(null=False, default=0, description="支付方式, 1=余额支付，2=微信支付，3=支付宝支付")
    pay_status = fields.IntField(null=False, default=0, description="支付状态, ")
    transaction_id = fields.CharField(null=False, max_length=64, default="", description="主支付流水号")
    pay_time = fields.IntField(null=False, default=0, description="支付时间")

    # 收货信息（整单的收货信息，适用于实物商品）
    receiver_name = fields.CharField(null=True, max_length=64, default="", description="收货人姓名")
    receiver_phone = fields.CharField(null=True, max_length=20, default="", description="收货人手机号")
    receiver_address = fields.TextField(null=True, default="", description="收货地址")

    # 其他通用信息
    remark = fields.TextField(null=False, default="", description="订单备注")
    ip = fields.CharField(null=True, max_length=64, default="", description="用户IP地址")
    user_agent = fields.TextField(null=True, default="", description="用户User-Agent")
    # 通知与调试
    notify_status = fields.SmallIntField(null=False, default=0, description="通知状态: [0=未通知, 1=成功, 2=失败]")

    # 充值特有字段
    give_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="赠送金额（仅用于充值）")
    
    # 时间和状态字段
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "主订单表（记录整笔订单的汇总信息）"
        table = DbModel.table_prefix("main_order")

class SubOrderModel(DbModel):
    """子订单表（记录每个商品的订单信息）"""
    
    id = fields.IntField(pk=True, unsigned=True, description="主键")
    main_order_id = fields.IntField(null=False, default=0, description="主订单ID")
    main_order_sn = fields.CharField(null=False, max_length=64, default="", description="主订单编号")
    user_id = fields.IntField(null=False, default=0, description="用户ID")

    # 商品/服务信息
    source_id = fields.IntField(null=False, default=0, description="来源ID: 对应套餐ID或商品ID")
    product_name = fields.CharField(null=False, max_length=128, default="", description="商品名称")
    quantity = fields.IntField(null=False, default=1, description="商品数量")
    unit_price = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="单价")
    subtotal_amount = fields.DecimalField(null=False, max_digits=10, decimal_places=2, default=0, description="小计金额")
    extra_params = fields.JSONField(null=True, default={}, description="附加信息")

    # 发货相关（子订单级别的处理）
    delivery_type = fields.SmallIntField(null=False, default=0, description="发货方式: [0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货]")
    delivery_status = fields.SmallIntField(null=False, default=0, description="发货状态: [0=待发货，1=已发货，2=已退货]")
    status = fields.SmallIntField(null=True, default=0, description="状态: [0=无，1=申请售后，2=同意退货，3=退货成功，4=拒绝退货]")
    logistics_company = fields.CharField(null=True, max_length=64, default="", description="物流公司")
    logistics_no = fields.CharField(null=True, max_length=64, default="", description="物流单号")
    warehouse_id = fields.IntField(null=True, default=0, description="仓库ID,仅在delivery_type=1和2时有效")
    # 时间和状态字段
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "子订单表（记录每个商品的订单信息）"
        table = DbModel.table_prefix("sub_order")


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


class WorkOrderModel(DbModel):
    """售后工单表"""
    id = fields.IntField(pk=True, unsigned=True, description="主键")
    user_id = fields.IntField(null=False, default=0, description="用户ID")
    
    # 关联订单
    main_order_id = fields.IntField(null=False, default=0, description="主订单ID")
    sub_order_id = fields.IntField(null=False, default=0, description="子订单ID")
    order_sn = fields.CharField(null=False, max_length=64, default="", description="主订单编号")
    
    # 申请详情
    type = fields.SmallIntField(null=False, default=0, description="申请类型: [1=退款, 2=退货退款]")
    status = fields.SmallIntField(null=False, default=0, description="申请状态: [0=待处理, 1=处理中（用户寄回退货）, 2=已完成, 3=已拒绝]")
    reason = fields.TextField(null=True, default="", description="申请原因")
    refuse_reason = fields.TextField(null=True, default="", description="拒绝原因")
    return_type = fields.SmallIntField(null=False, default=1, description="售后类型: [1=仅退款, 2=退货退款]")
    
    # 退货物流信息
    logistics_company = fields.CharField(null=True, max_length=64, default="", description="物流公司")
    logistics_no = fields.CharField(null=True, max_length=64, default="", description="物流单号")
    sender_address = fields.TextField(null=True, default="", description="寄出地址")
    
    # 时间和状态
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="申请时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "售后工单表"
        table = DbModel.table_prefix("work_order")
