from tortoise import fields
from kernels.model import DbModel

class AnnouncementModel(DbModel):
    """ announcement """
    id = fields.IntField(pk=True, description="主键 ID")
    software_id = fields.IntField(null=False, description="所属软件 ID")
    title = fields.TextField(null=False, max_length=255, description="公告标题")
    content = fields.TextField(null=False, max_length=255, description="公告内容")
    is_pinned = fields.BooleanField(null=False, default=False, description="是否置顶显示")
    is_show = fields.BooleanField(null=False, default=True, description="是否显示")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")

    class Meta:
        table_description = "announcement表"
        table = DbModel.table_prefix("announcement")