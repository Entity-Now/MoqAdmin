from tortoise import fields
from kernels.model import DbModel
from common.enums.market import DeliveryTypeEnum

class Category(DbModel):
    """ 商品分类 """
    id = fields.IntField(pk=True, description="主键")
    title = fields.TextField(null=False, max_length=50, description="分类名称")
    parent_id = fields.IntField(null=True, default=0, description="父级分类ID")
    level = fields.IntField(null=False, default=0, description="分类等级")
    image = fields.TextField(null=False, default="", description="分类图片")
    sort = fields.IntField(null=False, default=0, description="排序")
    is_show = fields.SmallIntField(null=False, default=1, description="是否显示: [0=否, 1=是]")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "商品分类表"
        table = DbModel.table_prefix("category")


class Commodity(DbModel):
    """ 商品 """
    id = fields.IntField(pk=True, description="主键")
    code = fields.TextField(null=True, max_length=50, default="", description="商品编码")
    cid = fields.IntField(null=False, default=0, description="类目")
    title = fields.TextField(null=False, max_length=250, default="", description="标题")
    price = fields.FloatField(null=False, default=0, description="价格")
    original_price = fields.FloatField(null=True, default=0, description="原价")
    fee = fields.FloatField(null=True, default=0, description="运费")
    stock = fields.IntField(null=False, default=0, description="库存")
    sales = fields.IntField(null=False, default=0, description="销量")
    deliveryType = fields.IntEnumField(DeliveryTypeEnum, null=False, default=DeliveryTypeEnum.LOGISTICS, description="发货方式: [0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货]")
    # 图片使用json格式，例如：["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    main_image = fields.TextField(null=True, default="", description="主图")
    image = fields.JSONField(null=False, default=list, description="封面")
    intro = fields.TextField(null=False, default="", description="简介")
    link = fields.TextField(null=True, default="", description="链接")
    browse = fields.IntField(null=False, default=0, description="浏览")
    collect = fields.IntField(null=False, default=0, description="收藏")
    sort = fields.IntField(null=False, default=0, description="排序")
    is_topping = fields.SmallIntField(null=False, default=0, description="是否置顶: [0=否, 1=是]")
    is_recommend = fields.SmallIntField(null=False, default=0, description="是否推荐: [0=否, 1=是]")
    is_show = fields.SmallIntField(null=False, default=0, description="是否显示: [0=否, 1=是]")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除: [0=否, 1=是]")
    config = fields.JSONField(null=True, default=dict, description="动态配置")
    # 规格，JSON格式，例如：{"颜色": ["红色", "绿色"], "尺寸": ["S", "M", "L"]}
    sku = fields.JSONField(null=True, default=dict, description="规格")
    use_sku_stock = fields.SmallIntField(null=False, default=0, description="是否使用规格库存: [0=否, 1=是]")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")
    class Meta:
        table_description = "商品表"
        table = DbModel.table_prefix("commodity")


class WarehouseCard(DbModel):
    """ 虚拟卡密表 """
    id = fields.IntField(pk=True, description="主键")
    commodity_id = fields.IntField(null=False, description="关联商品ID")
    # 规格，JSON格式，例如：{"颜色": "红色", "尺寸": "S"}
    sku = fields.JSONField(null=True, default=dict, description="规格")
    title = fields.TextField(null=False, description="卡号 / 卡密内容")
    password = fields.TextField(null=False, default="", description="卡密密码（如无可留空）")

    is_used = fields.SmallIntField(null=False, default=0, description="是否已使用: [0=否, 1=是]")
    order_id = fields.IntField(null=False, default=0, description="关联订单ID（使用后记录）")
    use_time = fields.IntField(null=True, default=0, description="使用时间（时间戳）")

    card_type = fields.SmallIntField(null=False, default=0, description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]")
    stock = fields.IntField(null=False, default=0, description="共享库存数量，仅在 card_type=1 时有效")

    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")

    class Meta:
        table = DbModel.table_prefix("warehouse_card")
        table_description = "虚拟卡密表（支持唯一码、共享库存、无限库存）"


class ShoppingCart(DbModel):
    """ 购物车 """
    id = fields.IntField(pk=True, description="主键")
    user_id = fields.IntField(null=False, default=0, description="用户ID")
    commodity_id = fields.IntField(null=False, default=0, description="商品ID")
    sku = fields.JSONField(null=True, default=dict, description="规格")
    quantity = fields.IntField(null=False, default=0, description="数量")
    is_selected = fields.SmallIntField(null=False, default=0, description="是否选中: [0=否, 1=是]")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")
    class Meta:
        table = DbModel.table_prefix("shopping_cart")
        table_description = "购物车表"
    
        