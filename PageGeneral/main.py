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

    def generate_all(self, table: Table):
        for gen in self.generators:
            code = gen.generate(table)
            filename = gen.get_filename(table)
            # 根目录的路径
            save_dir = gen.get_output_dir(table)
            # 从上一级目录开始保存文件
            path = os.path.join(save_dir, filename)
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
    tableName="announcement",
    tableDescription="软件公告信息",
    category="software",
    apiPrefix="/announcement",
    comment="发布软件公告，可绑定到指定软件",
    properties=[
        Property("software_id", int, False, "所属软件 ID"),
        Property("title", str, False, "公告标题"),
        Property("content", str, False, "公告内容"),
        Property("is_pinned", bool, False, "是否置顶显示", default=False),
        Property("is_show", bool, False, "是否置顶显示", default=True),
    ]
)
manager.generate_all(table)