import time
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Commodity
from common.models.commodity import WarehouseCard
from apps.admin.schemas.shopping import commodity_schema as schema
from apps.admin.schemas.common_schema import SelectItem
from plugins.pyTorch.embedding_extractor import EmbeddingExtractor
from plugins.milvus.milvus_service import milvus_service
from PIL import Image
import os
from common.utils.urls import UrlUtil


class CommodityService:
    
    @classmethod
    async def sku_by_commodity_id(cls, commodityId: int) -> Dict[str, List[str]]:
        """根据商品ID查询规格

        Args:
            commodityId (int): 商品ID

        Returns:
            Dict[str, List[str]]: 规格，例如：{"颜色": ["红色", "蓝色"], "尺寸": ["S", "M"]}
        """
        _stock = await WarehouseCard.filter(commodity_id=commodityId, is_delete=0).values("sku")
        if not _stock:
            return {}
        # sku是一个字典，将sku的key作为规格的key，value作为规格的value
        sku = {}
        for item in _stock:
            sku.update(item["sku"])
        return sku
    
    @classmethod
    async def list(cls, param: schema.CommoditySearchIn) ->  PagingResult[schema.CommodityDetail]:
        """商品列表

        Args:
            param (schema.CommoditySearchIn): 搜索参数

        Returns:
            PagingResult[schema.CommodityDetail]: 返回一个商品的列表
        """
        whereParam = {
            "=": ["is_show"],
            "%like%": ["title"]
        }
        if param.cid is not None:
            whereParam["="].append("cid")
            whereParam["="].append("is_topping")
            whereParam["="].append("is_recommend")
        if param.code is not None:
            whereParam["%like%"].append(param.code)
        where = Commodity.build_search(whereParam, param.__dict__)

        _model = Commodity.filter(is_delete=0).filter(*where).order_by("-sort", "-id")
        _pager = await Commodity.paginate(
            model=_model,
            page_no=param.page_no,
            page_size=param.page_size,
            schema=schema.CommodityDetail,
            fields=Commodity.without_field("is_delete,delete_time")
        )
        for item in _pager.lists:
            if item.image:
                item.image = [await UrlUtil.to_absolute_url(img) for img in item.image]
            if item.main_image:
                item.main_image = await UrlUtil.to_absolute_url(item.main_image)
        return _pager

    @classmethod
    async def selected(cls) -> List[SelectItem]:
        """查询商品的options列表"""
        
        selects = await Commodity.filter(is_delete=0).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results
        

    @classmethod
    async def add(cls, post: schema.CommodityCreate):
        """添加商品

        Args:
            post (schema.CommodityCreate): 商品实体

        Returns:
            无返回值，方法不报错即为执行成功
        """

        cate = await Commodity.filter(title=post.title, is_delete=0).first()
        if cate:
            raise AppException(f"名称为{post.title}的商品已经存在！")

        insertRes = await Commodity.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )

        # 同步到 Milvus（使用多张图片）
        try:
            if insertRes.image and len(insertRes.image) > 0:
                # 处理多张图片路径
                local_paths = []
                for img_path in insertRes.image:
                    if img_path.startswith("storage") or img_path.startswith("static"):
                        local_path = f"public/{img_path}"
                    else:
                        local_path = img_path
                    
                    if os.path.exists(local_path):
                        local_paths.append(local_path)
                
                if local_paths:
                    extractor = EmbeddingExtractor()
                    # 使用多图特征提取
                    vector = extractor.extract_commodity_feature(local_paths, min_images=1)
                    
                    milvus_service.insert_commodities([{
                        "id": insertRes.id,
                        "vector": vector,
                        "commodity_id": insertRes.id,
                        "payload": {"title": insertRes.title}
                    }])
        except Exception as e:
            print(f"Failed to sync to Milvus: {e}")


    @classmethod
    async def edit(cls, post: schema.CommodityUpdate):
        """
        商品编辑
        :param post: 商品编辑参数
        :return: 无返回值，方法不报错即为执行成功
        """

        _post = await Commodity.filter(id=post.id, is_delete=0).exists()
        if not _post:
            raise AppException("商品不存在")

        _post3 = await Commodity.filter(title=post.title, id__not=post.id, is_delete=0).exists()
        if _post3:
            raise AppException("商品名称已被占用")

        params = post.dict()
        del params["id"]

        updateRes = await Commodity.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

        # 同步到 Milvus（使用多张图片）
        try:
            # 如果更新了图片或标题，需要更新向量库
            # 为了保证一致性，先查询最新数据
            current_goods = await Commodity.filter(id=post.id).first()
            if current_goods and current_goods.image and len(current_goods.image) > 0:
                # 处理多张图片路径
                local_paths = []
                for img_path in current_goods.image:
                    if img_path.startswith("storage") or img_path.startswith("static"):
                        local_path = f"public/{img_path}"
                    else:
                        local_path = img_path
                    
                    if os.path.exists(local_path):
                        local_paths.append(local_path)
                
                if local_paths:
                    extractor = EmbeddingExtractor()
                    # 使用多图特征提取
                    vector = extractor.extract_commodity_feature(local_paths, min_images=1)
                    
                    # Milvus Lite 不支持直接 Update，通常是 Delete + Insert 或者 Upsert
                    # pymilvus 的 insert 在某些模式下是 upsert，但为了安全，先 delete 再 insert
                    milvus_service.delete_commodities([post.id])
                    milvus_service.insert_commodities([{
                        "id": post.id,
                        "vector": vector,
                        "commodity_id": post.id,
                        "payload": {"title": current_goods.title}
                    }])
        except Exception as e:
            print(f"Failed to sync to Milvus: {e}")

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个商品
        :param id_: 商品的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await Commodity.filter(id=id_, is_delete=0).first().values("id")
        if not p:
            raise AppException("商品不存在")
        ## 判断商品下面是否有库存
        warehouse = await WarehouseCard.filter(commodity_id=id_, is_delete=0).first().values("id")
        if warehouse:
            raise AppException("商品下面有库存不能删除")

        await Commodity.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))

        # 同步删除 Milvus
        try:
            milvus_service.delete_commodities([id_])
        except Exception as e:
            print(f"Failed to delete from Milvus: {e}")

    @classmethod
    async def sync_all_to_milvus(cls):
        """
        初始化/同步所有商品到向量数据库
        """
        print("开始同步所有商品到 Milvus...")
        commodities = await Commodity.filter(is_delete=0).all()
        
        extractor = EmbeddingExtractor()
        
        # 先清空集合（可选，或者直接覆盖）
        # milvus.client.drop_collection(milvus.collection_name)
        # milvus.init_collection()
        
        data_to_insert = []
        count = 0

        print(len(commodities))
        
        for goods in commodities:
            try:
                # 使用多张图片
                if not goods.image or len(goods.image) == 0:
                    print(f"Skipping goods {goods.id}: no images")
                    continue
                
                # 处理多张图片路径
                local_paths = []
                for img_path in goods.image:
                    if img_path.startswith("http"):
                        print(f"Skipping remote image: {img_path}")
                        continue
                    
                    if img_path.startswith("storage") or img_path.startswith("static"):
                        local_path = f"public/{img_path}"
                    else:
                        local_path = img_path

                    if os.path.exists(local_path):
                        local_paths.append(local_path)
                    else:
                        print(f"Image not found: {local_path}")
                
                if not local_paths:
                    print(f"Skipping goods {goods.id}: no valid local images")
                    continue
                
                # 使用多图特征提取
                vector = extractor.extract_commodity_feature(local_paths, min_images=1)
                
                data_to_insert.append({
                    "id": goods.id,
                    "vector": vector,
                    "commodity_id": goods.id,
                    "payload": {"title": goods.title}
                })
                
                if len(data_to_insert) >= 100:
                    milvus_service.insert_commodities(data_to_insert)
                    count += len(data_to_insert)
                    data_to_insert = []
                    print(f"Synced {count} items...")
                    
            except Exception as e:
                print(f"Error processing goods {goods.id}: {e}")
                
        if data_to_insert:
            milvus_service.insert_commodities(data_to_insert)
            count += len(data_to_insert)
            
        print(f"Sync complete. Total {count} items synced.")
        return {"synced_count": count}