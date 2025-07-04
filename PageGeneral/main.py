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
            # 根目录的路径
            save_dir = gen.get_output_dir(table)
            # 从上一级目录开始保存文件
            path = os.path.join(output_dir, save_dir, filename)
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
    category="software",
    tableName="software",
    tableDescription="软件基本信息",
    apiPrefix="/software",
    comment="管理软件的名称、标识、图标、描述等基础信息",
    properties=[
        Property("id", int, False, "主键 ID"),
        Property("name", str, False, "软件名称"),
        Property("identifier", str, False, "软件唯一标识，例如 com.example.app"),
        Property("icon_url", str, True, "软件图标 URL"),
        Property("description", str, True, "软件简要介绍"),
        Property("is_active", bool, False, "是否启用", default=True),
        Property("created_at", int, False, "创建时间", default=0),
        Property("updated_at", int, False, "更新时间", default=0),
    ]
)
manager.generate_all(table, "../")