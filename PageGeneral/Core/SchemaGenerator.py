from .CodeGenerator import CodeGenerator
from .MTable import Table, Property


def map_to_pydantic_field(p: Property, for_query: bool = False) -> str:
    """将属性转换为 Pydantic 字段定义字符串"""
    field_type = {
        int: 'int',
        float: 'float',
        str: 'str',
        bool: 'bool',
        dict: 'dict'
    }.get(p.type, 'str')

    union_type = f'Union[{field_type}, None]'
    field_expr = f'default={repr(p.default)}' if p.default is not None else 'default=None'
    desc = f'description="{p.describe}"'

    if for_query:
        return f'    {p.title}: {union_type} = Query({field_expr}, {desc})'
    else:
        default_val = f'Field(..., {desc})' if not p.nullable and p.default is None else f'Field({field_expr}, {desc})'
        return f'    {p.title}: {field_type} = {default_val}'


def build_example(table: Table) -> dict:
    """根据字段默认值构造示例字典"""
    example = {}
    for p in table.properties:
        if p.default is not None:
            example[p.title] = p.default
        else:
            # 根据类型给默认示例
            if p.type == int or p.type == float:
                example[p.title] = 0
            elif p.type == bool:
                example[p.title] = False
            else:
                example[p.title] = ""
    return example


class SchemaGenerator(CodeGenerator):
    def generate(self, table: Table) -> str:
        model_name = ''.join(word.capitalize() for word in table.tableName.split('_'))
        example = build_example(table)

        output = []

        # ========== SearchIn ==========
        output.append(f'class {model_name}SearchIn(BaseModel):')
        output.append(f'    """ {table.tableName}搜索参数 """')
        output.append(f'    page_no: int = Query(gt=0, default=1, description="当前页码")')
        output.append(f'    page_size: int = Query(gt=0, le=200, default=15, description="每页条数")')
        for p in table.properties:
            output.append(map_to_pydantic_field(p, for_query=True))
        output.append('\n')

        # ========== Create / Update / Detail ==========
        for schema_type in ['Create', 'Update', 'Detail']:
            output.append(f'class {model_name}{schema_type}(BaseModel):')
            for p in table.properties:
                output.append(map_to_pydantic_field(p))
            output.append('')
            output.append('    class Config:')
            output.append('        json_schema_extra = {')
            output.append('            "example": {')
            for k, v in example.items():
                output.append(f'                "{k}": {repr(v)},')
            output.append('            }')
            output.append('        }')
            output.append('')

        # ========== Delete ==========
        output.append(f'class {model_name}Delete(BaseModel):')
        output.append('    id: int = Field(..., description="主键ID")')
        output.append('')

        return '\n'.join(output)

    def get_filename(self, table: Table) -> str:
        return f"{table.tableName.lower()}_schema.py"