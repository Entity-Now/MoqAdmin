from .CodeGenerator import CodeGenerator
from .MTable import Table, Property
from typing import Any


class DbModelGenerator(CodeGenerator):
    def map_type(self, py_type: type, nullable: bool, default: Any, describe: str, max_length: int = 255) -> str:
        # 映射 Python 类型 -> Tortoise 字段类型
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

        # 字段参数拼接
        args = []
        args.append(f'null={str(nullable)}')
        if py_type == str:
            args.append(f'max_length={max_length}')
        if default is not None:
            args.append(f'default={repr(default)}')
        if describe:
            args.append(f'description="{describe}"')

        return f'fields.{base_type}({", ".join(args)})'

    def GeneralDbModel(self, table: Table) -> str:
        lines = []
        class_name = table.tableName.capitalize()
        lines.append('from tortoise import fields')
        lines.append('from kernels.model import DbModel')
        lines.append('')
        lines.append(f'class {class_name}Model(DbModel):')
        lines.append(f'    """ {table.tableName} """')

        # 其他字段
        for prop in table.properties:
            field_def = self.map_type(
                py_type=prop.type,
                nullable=prop.nullable,
                default=prop.default,
                describe=prop.describe or prop.title,
            )
            lines.append(f'    {prop.title} = {field_def}')

        # Meta 配置
        lines.append('')
        lines.append('    class Meta:')
        lines.append(f'        table_description = "{table.tableName}表"')
        lines.append(f'        table = DbModel.table_prefix("{table.tableName.lower()}")')

        return '\n'.join(lines)

    def generate(self, table: Table) -> str:
        return self.GeneralDbModel(table)

    def get_filename(self, table: Table) -> str:
        return f"{table.tableName.lower()}.py"

    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        return f'server/common/models/{table.category.lower()}'