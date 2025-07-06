from tortoise import fields
from kernels.model import DbModel

class softwareModel(DbModel):
    """ software """
    id = fields.IntField(pk=True, description="主键 ID")
    name = fields.TextField(null=False, max_length=255, description="软件名称")
    identifier = fields.TextField(null=False, max_length=255, description="软件唯一标识，例如 com.example.app")
    icon_url = fields.TextField(null=True, max_length=255, description="软件图标 URL")
    description = fields.TextField(null=True, max_length=255, description="软件简要介绍")
    is_show = fields.BooleanField(null=False, default=True, description="是否显示")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")

    class Meta:
        table_description = "software表"
        table = DbModel.table_prefix("software")