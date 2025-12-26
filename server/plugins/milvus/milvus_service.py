import os
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
import threading

from pymilvus import MilvusClient, DataType

from config import get_settings  # 保持你的配置方式不变

logger = logging.getLogger(__name__)


class MilvusService:
    """
    Milvus Lite 服务（线程安全懒加载单例）
    解决 Uvicorn reload / 多进程下重复初始化导致的 "Open local milvus failed" 问题
    """

    _instance = None
    _lock = threading.Lock()          # 用于线程安全的单例创建
    _initialized = False              # 标记是否已真正完成初始化

    def __new__(cls):
        """线程安全单例"""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """只在第一次创建实例时执行初始化逻辑"""
        if MilvusService._initialized:
            return

        with MilvusService._lock:
            if MilvusService._initialized:
                return

            self.settings = get_settings().MILVUS
            self.db_path: str = self.settings.get("db", "db/moq_milvus.db")
            self.collection_name: str = self.settings.get("collection_name", "commodity_vectors")
            self.vector_dim: int = self.settings.get("vector_dim", 576)

            self.client: Optional[MilvusClient] = None

            # 懒加载初始化（第一次真正使用时才会触发）
            self._initialize()

            MilvusService._initialized = True
            logger.info(f"MilvusService singleton initialized successfully: {self.db_path}")

    def _initialize(self) -> None:
        """实际的初始化逻辑"""
        try:
            # 确保数据库目录存在
            db_dir = Path(self.db_path).parent
            db_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"Ensured Milvus db directory exists: {db_dir}")

            # 创建 MilvusClient（Milvus Lite 会自动创建或打开 .db 文件）
            self.client = MilvusClient(self.db_path)
            logger.info(f"MilvusClient connected to local file: {self.db_path}")

            # 自动创建集合和索引
            self._create_collection_if_needed()
            self._create_index_if_needed()

        except Exception as e:
            logger.error(f"Failed to initialize MilvusService: {e}", exc_info=True)
            raise RuntimeError(f"Milvus 初始化失败: {e}") from e

    def _create_collection_if_needed(self):
        """如果集合不存在则创建"""
        if self.client.has_collection(self.collection_name):
            logger.info(f"Collection '{self.collection_name}' already exists")
            return

        self.client.create_collection(
            collection_name=self.collection_name,
            dimension=self.vector_dim,
            primary_field_name="id",
            id_type=DataType.INT64,
            vector_field_name="vector",
            metric_type="COSINE",
            auto_id=False,
            enable_dynamic_field=True  # 支持动态字段，方便存储任意元数据
        )
        logger.info(f"Created collection '{self.collection_name}' (dim={self.vector_dim})")

    def _create_index_if_needed(self):
        """为向量字段创建 HNSW 索引（仅一次）"""
        indexes = self.client.list_indexes(self.collection_name)
        if "vector" in indexes:
            logger.info("HNSW index already exists on vector field")
            return

        self.client.create_index(
            collection_name=self.collection_name,
            field_name="vector",
            index_params={
                "index_type": "HNSW",
                "metric_type": "COSINE",
                "params": {"M": 16, "efConstruction": 200}
            }
        )
        logger.info("Created HNSW index on vector field")

    def insert_commodities(self, data: List[Dict[str, Any]]) -> bool:
        """批量插入商品向量"""
        if not data:
            logger.warning("insert_commodities called with empty data")
            return False

        try:
            res = self.client.insert(
                collection_name=self.collection_name,
                data=data
            )
            count = res.get("insert_count", len(data))
            logger.info(f"Inserted {count} commodities into Milvus")
            return True
        except Exception as e:
            logger.error(f"Error inserting into Milvus: {e}", exc_info=True)
            return False

    def delete_commodities(self, ids: List[int]) -> bool:
        """批量删除商品"""
        if not ids:
            return True

        try:
            res = self.client.delete(
                collection_name=self.collection_name,
                ids=ids
            )
            deleted = res.get("delete_count", len(ids))
            logger.info(f"Deleted {deleted} commodities from Milvus")
            return True
        except Exception as e:
            logger.error(f"Error deleting from Milvus: {e}", exc_info=True)
            return False

    def search_similar(self, vector: List[float], top_k: int = 10) -> List[Dict[str, Any]]:
        """搜索相似商品"""
        try:
            res = self.client.search(
                collection_name=self.collection_name,
                data=[vector],
                limit=top_k,
                output_fields=["*"],  # 返回所有字段，包括动态字段
                params={"ef": max(top_k * 2, 100)}  # 提高召回率
            )

            if res and len(res) > 0:
                return res[0]
            return []

        except Exception as e:
            logger.error(f"Error searching Milvus: {e}", exc_info=True)
            return []


# ==================== 模块级单例实例 ====================
# 直接导入这个变量使用即可，整个应用只会真正初始化一次
milvus_service = MilvusService()