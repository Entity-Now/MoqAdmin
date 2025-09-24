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


class AIModelConfig(DbModel):
    """ AI模型配置表 """
    id = fields.IntField(pk=True, description="主键")
    model_name = fields.CharField(null=False, max_length=50, default="", description="模型名称")
    platform = fields.CharField(null=False, max_length=30, default="", description="所属平台")
    prompt_template = fields.TextField(default="", description="预定义的Prompt模板")
    api_key = fields.TextField(default="", description="接口密钥")
    endpoint_url = fields.CharField(null=False, max_length=255, default="", description="API调用地址")
    is_active = fields.BooleanField(default=True, description="是否启用")
    max_tokens = fields.IntField(default=2048, description="最大令牌数")
    temperature = fields.FloatField(default=0.7, description="生成内容的创造性")
    created_at = fields.IntField(null=False, default=0, description="创建时间")
    updated_at = fields.IntField(null=False, default=0, description="更新时间")

    class Meta:
        table_description = "AI模型配置表"
        table = DbModel.table_prefix("ai_model_config")