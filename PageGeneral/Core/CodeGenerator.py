from abc import ABC, abstractmethod
from typing import Protocol
from .MTable import Table  # 你的 Table 定义

class CodeGenerator(ABC):
    """所有生成器的接口"""

    @abstractmethod
    def generate(self, table: Table) -> str:
        pass

    @abstractmethod
    def get_filename(self, table: Table) -> str:
        pass
    
    @abstractmethod
    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        pass