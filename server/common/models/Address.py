from tortoise import fields
from kernels.model import DbModel

class Address(DbModel):
    """ 地址模型 """
    user_id = fields.IntField(null=False, default=0, description="用户ID")
    name = fields.CharField(max_length=20, description="收货人姓名")
    phone = fields.CharField(max_length=11, description="收货人手机号")
    province = fields.CharField(max_length=20, description="省份")
    city = fields.CharField(max_length=20, description="城市")
    district = fields.CharField(max_length=20, description="区县")
    address = fields.CharField(max_length=200, description="详细地址")
    is_default = fields.IntField(null=False, default=0, description="是否默认地址")
    is_delete = fields.SmallIntField(null=False, default=0, description="是否删除")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")
    
    class Meta:
        table = DbModel.table_prefix("address")
        table_description = "地址表"