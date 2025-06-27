from typing import Any, List
from dataclasses import dataclass

# 属性定义类
@dataclass
class Property:
    title: str           # 字段名
    type: type           # Python类型，如 int、str、float、bool
    nullable: bool       # 是否允许为 null
    describe: str        # 字段说明
    default: Any = None  # 默认值

# 表定义类
@dataclass
class Table:
    tableName: str
    tableDescription: str
    apiPrefix: str
    comment: str
    properties: List[Property]