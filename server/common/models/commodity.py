from tortoise import fields
from kernels.model import DbModel

class Commodity(DbModel):
    """ 商品 """
    id = fields.IntField(pk=True, description="主键")
    cid = fields.IntField(null=False, default=0, description="类目")
    title = fields.CharField(null=False, max_length=100, default="", description="标题")
    price = fields.FloatField(null=False, default=0, description="价格")
    stock = fields.IntField(null=False, default=0, description="库存")
    sales = fields.IntField(null=False, default=0, description="销量")
    deliveryType = fields.IntField(null=False, default=0, description="发货方式: [0=快递, 1=自提, 2=无需物流[人工发]， 3=无需物流[自动发]")
    delivery = fields.IntField(null=False, default=0, description="发货: [0=未发货, 1=已发货, 2=发货失败, 3=已收货, 4=退货]")
    image = fields.CharField(null=False, default="", description="封面")
    intro = fields.CharField(null=False, default="", description="简介")
    link = fields.CharField(null=False, default="", description="链接")
    browse = fields.IntField(null=False, default=0, description="浏览")
    collect = fields.IntField(null=False, default=0, description="收藏")
    sort = fields.IntField(null=False, default=0, description="排序")
    is_topping = fields.SmallIntField(null=False, default=0, description="是否置顶: [0=否, 1=是]")
    is_recommend = fields.SmallIntField(null=False, default=0, description="是否推荐: [0=否, 1=是]")
    is_show = fields.SmallIntField(null=False, default=0, description="是否显示: [0=否, 1=是]")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除: [0=否, 1=是]")
    config = fields.JSONField(null=True, default={}, description="动态配置")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")
    class Meta:
        table = DbModel.table_prefix("commodity")
        table_description = "商品表"
        
    
        