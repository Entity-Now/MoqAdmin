from .CodeGenerator import CodeGenerator
from .MTable import Table, Property
from typing import Any

class DbModelGenerator(CodeGenerator):
    # 映射规则：Python 类型 -> Tortoise ORM 字段类型
    def map_type(self, py_type: type, nullable: bool, default: Any, max_length: int = 255) -> str:
        base_type = None
        if py_type == int:
            base_type = 'SmallIntField' if isinstance(default, int) and default in (0, 1) else 'IntField'
        elif py_type == float:
            base_type = 'FloatField'
        elif py_type == str:
            base_type = 'TextField'
        elif py_type == bool:
            base_type = 'BooleanField'
        elif py_type == dict:
            base_type = 'JSONField'
        else:
            base_type = 'TextField'  # fallback

        parts = [f'fields.{base_type}(']
        if not nullable:
            parts.append('null=False')
        else:
            parts.append('null=True')

        if py_type == str:
            parts.append(f'max_length={max_length}')
        if default is not None:
            parts.append(f'default={repr(default)}')

        return ', '.join(parts) + ')'

    # 主函数
    def GeneralDbModel(self, table: Table) -> str:
        lines = []
        class_name = table.tableName.capitalize()
        lines.append(f'class {class_name}(DbModel):')
        lines.append(f'    """ {table.tableName} """')

        # id 字段默认处理
        lines.append(f'    id = fields.IntField(pk=True, description="主键")')

        for prop in table.properties:
            field_line = f'    {prop.title} = {self.map_type(prop.type, prop.nullable, prop.default)}'
            field_line += f', description="{prop.describe}"'
            lines.append(field_line)

        # 添加通用字段
        lines.append('    create_time = fields.IntField(null=False, default=0, description="创建时间")')
        lines.append('    update_time = fields.IntField(null=False, default=0, description="更新时间")')
        lines.append('    delete_time = fields.IntField(null=False, default=0, description="删除时间")')

        # Meta 类
        lines.append('\n    class Meta:')
        lines.append(f'        table_description = "{table.tableName}表"')
        lines.append(f'        table = DbModel.table_prefix("{table.tableName.lower()}")')

        return '\n'.join(lines)

    def generate(self, table: Table) -> str:
        # 你的 DbModel 生成逻辑（与上面类似）
        return self.GeneralDbModel(table)

    def get_filename(self, table: Table) -> str:
        return f"{table.tableName.lower()}_model.py"
