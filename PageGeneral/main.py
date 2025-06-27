import os
from typing import Any, List
from dataclasses import dataclass
from Core.MTable import Table, Property
from Core.CodeGenerator import CodeGenerator
from Core.RouterGenerator import RouterGenerator
from Core.ServiceGenerator import ServiceGenerator
from Core.SchemaGenerator import SchemaGenerator
from Core.DbModelGenerator import DbModelGenerator
from Core.Vue3IndexGenerator import Vue3IndexGenerator
from Core.Vue3EditorGenerator import Vue3EditorGenerator
from Core.ApiGenerator import ApiGenerator


class CodeGenerationManager:
    def __init__(self, generators: list[CodeGenerator]):
        self.generators = generators

    def generate_all(self, table: Table, output_dir: str):
        os.makedirs(output_dir, exist_ok=True)
        for gen in self.generators:
            code = gen.generate(table)
            filename = gen.get_filename(table)
            path = os.path.join(output_dir, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(code)
            print(f"生成文件: {path}")


# 用法示例
db_gen = DbModelGenerator()
schema_gen = SchemaGenerator()
service_gen = ServiceGenerator()
router_gen = RouterGenerator()
vue_index_gen = Vue3IndexGenerator()
vue_editor_gen = Vue3EditorGenerator()
api_gen = ApiGenerator()

manager = CodeGenerationManager([
    db_gen,
    schema_gen,
    service_gen,
    router_gen,
    vue_index_gen,
    vue_editor_gen,
    api_gen
])
table = Table(
    apiPrefix="shopping",
    comment="仓库",
    tableName="warehouse_card",
    tableDescription="虚拟卡密表（支持唯一码、共享库存、无限库存）",
    properties=[
        Property("id", int, False, "主键"),
        Property("commodity_id", int, False, "关联商品ID"),
        Property("title", str, False, "卡号 / 卡密内容"),
        Property("password", str, False, "卡密密码（如无可留空）", default=""),

        Property("is_used", int, False, "是否已使用: [0=否, 1=是]", default=0),
        Property("order_id", int, False, "关联订单ID（使用后记录）", default=0),
        Property("use_time", int, False, "使用时间（时间戳）", default=0),

        Property("card_type", int, False, "卡密类型: [0=唯一, 1=共享库存, 2=无限库存]", default=0),
        Property("stock", int, False, "共享库存数量，仅在 card_type=1 时有效", default=0),

        Property("is_delete", int, False, "是否删除", default=0),
        Property("create_time", int, False, "创建时间", default=0),
    ]
)
manager.generate_all(table, "./output")