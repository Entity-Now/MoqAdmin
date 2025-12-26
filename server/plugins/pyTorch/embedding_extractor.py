"""
PyTorch 嵌入提取器 - 懒加载 + 单例模式
使用 MobileNetV3 Small (576 维) 作为轻量级特征提取器
"""

import logging
from typing import Union, Sequence
from pathlib import Path

import numpy as np
from PIL import Image

import torch
import torch.nn as nn
from torchvision import models, transforms

from config import get_settings  # 假设你有统一的配置模块

logger = logging.getLogger(__name__)


def singleton(cls_):
    """简洁安全的单例装饰器"""
    instances = {}
    def get_instance(*args, **kwargs):
        if cls_ not in instances:
            instances[cls_] = cls_(*args, **kwargs)
        return instances[cls_]
    return get_instance


@singleton
class EmbeddingExtractor:
    """
    懒加载的 PyTorch 图像特征提取器（单例）
    方法名保持不变：extract_feature(image)
    支持传入 PIL.Image 或 str（图片路径）
    """

    def __init__(self):
        self.settings = get_settings().MILVUS or {}  # 可选配置节点
        self.vector_dim = self.settings.get("vector_dim", 576)  # 与 Milvus 保持一致
        self.model = None
        self.preprocess = None
        self.device = None
        self._initialized = False

    def _ensure_initialized(self) -> None:
        """懒加载核心：首次调用时初始化模型"""
        if self._initialized:
            return

        try:
            logger.info("Initializing EmbeddingExtractor (MobileNetV3 Small)...")

            # 加载预训练权重
            weights = models.MobileNet_V3_Small_Weights.DEFAULT
            model = models.mobilenet_v3_small(weights=weights)

            # 移除分类头，只保留特征（avgpool 后输出 576 维）
            model.classifier = nn.Identity()

            # 设备选择
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            model.to(self.device)
            model.eval()

            self.model = model
            self.preprocess = weights.transforms()  # 自动包含 Resize(256) -> CenterCrop(224) -> Normalize

            self._initialized = True
            logger.info(f"EmbeddingExtractor initialized successfully on {self.device}, dim={self.vector_dim}")

        except Exception as e:
            logger.error(f"Failed to initialize EmbeddingExtractor: {e}")
            raise RuntimeError(f"模型初始化失败: {e}") from e

    def extract_feature(self, image: Union[Image.Image, str, Path]) -> np.ndarray:
        """
        提取图片特征向量（保持原方法名和行为）
        :param image: PIL.Image 对象 或 图片路径（str/Path）
        :return: 归一化的特征向量 (numpy float32, shape=(576,))
        """
        self._ensure_initialized()

        try:
            # 支持路径输入
            if isinstance(image, (str, Path)):
                image_path = Path(image)
                if not image_path.exists():
                    raise FileNotFoundError(f"图片不存在: {image_path}")
                image = Image.open(image_path)

            # 统一转为 RGB
            if image.mode != "RGB":
                image = image.convert("RGB")

            # 预处理
            input_tensor = self.preprocess(image).unsqueeze(0).to(self.device)

            # 推理
            with torch.no_grad():
                embedding = self.model(input_tensor)  # (1, 576)

            # 转为 numpy 并 L2 归一化
            feature = embedding.cpu().numpy().flatten()
            norm = np.linalg.norm(feature)
            if norm > 0:
                feature = feature / norm

            return feature.astype(np.float32)

        except Exception as e:
            logger.error(f"Error extracting feature: {e}")
            raise RuntimeError(f"特征提取失败: {e}") from e
    def extract_feature(self, image: Union[Image.Image, str, Path]) -> np.ndarray:
        """
        提取单张图片的特征向量（原有接口，保持不变）
        """
        self._ensure_initialized()

        try:
            if isinstance(image, (str, Path)):
                image_path = Path(image)
                if not image_path.exists():
                    raise FileNotFoundError(f"图片不存在: {image_path}")
                image = Image.open(image_path).convert("RGB")
            elif isinstance(image, Image.Image):
                if image.mode != "RGB":
                    image = image.convert("RGB")
            else:
                raise ValueError("image 必须是 PIL.Image 或图片路径")

            input_tensor = self.preprocess(image).unsqueeze(0).to(self.device)

            with torch.no_grad():
                embedding = self.model(input_tensor)  # (1, 576)

            feature = embedding.cpu().numpy().flatten()
            norm = np.linalg.norm(feature)
            if norm > 0:
                feature = feature / norm

            return feature.astype(np.float32)

        except Exception as e:
            logger.error(f"Error extracting feature: {e}")
            raise RuntimeError(f"特征提取失败: {e}") from e

    def extract_commodity_feature(
        self,
        images: Sequence[Union[Image.Image, str, Path]],
        min_images: int = 1
    ) -> np.ndarray:
        """
        为一个商品提取综合特征向量（方案1：多张图片取平均）
        
        :param images: 商品的所有图片（路径列表、PIL.Image 列表，或混合）
        :param min_images: 最少需要多少张有效图片才返回向量（防止全失效）
        :return: 平均后的 L2 归一化向量 (576,)
        :raises RuntimeError: 如果有效图片少于 min_images
        """
        if not images:
            raise ValueError("images 列表不能为空")

        self._ensure_initialized()

        valid_features: List[np.ndarray] = []

        for img in images:
            try:
                feature = self.extract_feature(img)  # 复用单图逻辑，包含错误处理
                valid_features.append(feature)
                logger.debug(f"成功提取图片特征: {img if isinstance(img, (str, Path)) else 'PIL.Image'}")
            except Exception as e:
                logger.warning(f"提取图片特征失败（将跳过）: {img if isinstance(img, (str, Path)) else 'PIL.Image'} - {e}")

        if len(valid_features) < min_images:
            raise RuntimeError(f"商品有效图片数量不足（实际 {len(valid_features)}，要求至少 {min_images}）")

        # 平均所有有效特征向量
        avg_feature = np.mean(valid_features, axis=0)
        norm = np.linalg.norm(avg_feature)
        if norm > 0:
            avg_feature = avg_feature / norm

        logger.info(f"商品多图特征提取完成：{len(images)} 张输入 → {len(valid_features)} 张有效 → 平均向量")
        return avg_feature.astype(np.float32)