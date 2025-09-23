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
from common.models.software import softwareModel


class SoftwareVersionModel(DbModel):
    """ 软件版本 """
    id = fields.IntField(pk=True, description="主键 ID")
    software_id = fields.IntField(null=False, description="软件ID")
    version = fields.TextField(null=False, max_length=50, description="版本号")
    title = fields.TextField(null=False, max_length=255, description="版本标题")
    description = fields.TextField(null=True, description="版本描述")
    download_type = fields.SmallIntField(null=False, default=1, description="下载类型: [1=外站链接, 2=本站附件]")
    download_url = fields.TextField(null=True, max_length=500, description="外站链接")
    attach_id = fields.IntField(null=True, default=0, description="附件ID")
    is_show = fields.BooleanField(null=False, default=True, description="是否显示")
    is_latest = fields.BooleanField(null=False, default=False, description="是否最新版本")
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")

    class Meta:
        table_description = "软件版本表"
        table = DbModel.table_prefix("software_version")