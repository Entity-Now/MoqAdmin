import time
import json
import random
import re
from pathlib import Path
from decimal import Decimal
from typing import List, Dict, Union
from common.utils.times import TimeUtil
from common.utils.config import ConfigUtil
from common.utils.urls import UrlUtil
from pydantic import TypeAdapter
from hypertext import PagingResult
from exception import AppException
from common.models.commodity import Category, Commodity
from apps.admin.schemas.shopping import category_schema as schema
from apps.admin.schemas.common_schema import SelectItem


class CategoryService:
    
    
    @classmethod
    async def list(cls, param: schema.CategorySearchIn) ->  PagingResult[schema.CategoryDetail]:
        """类目列表

        Args:
            param (schema.CategorySearchIn): 搜索参数

        Returns:
            PagingResult[schema.CategoryDetail]: 返回一个类目的列表
        """
        where = Category.build_search({
            "=": ["is_show"],
            "%like%": ["title"]
        }, param.__dict__)

        _model = Category.filter(is_delete=0).filter(*where).order_by("-sort", "-id")
        _pager = await Category.paginate(
            model=_model,
            page_no=param.page_no,
            page_size=param.page_size,
            schema=schema.CategoryDetail,
            fields=Category.without_field("is_delete,delete_time")
        )
        
        categories = []
        for item in _pager.lists:
            vo = TypeAdapter(schema.CategoryDetail).validate_python(item)
            vo.image = await UrlUtil.to_absolute_url(vo.image)
            categories.append(vo)
        
        _pager.lists = categories
        
        return _pager

    @classmethod
    async def selected(cls) -> List[SelectItem]:
        """查询分类的options列表"""
        
        selects = await Category.filter(is_delete=0).values("id", "title", 'level')
        ## 将level和title拼接起来，如果level为null，则默认一级分类
        for item in selects:
            item["title"] = "L" + str(item["level"]) + " || " + item["title"]
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results
        

    @classmethod
    async def add(cls, post: schema.CategoryCreate):
        """添加分类

        Args:
            post (schema.CategoryCreate): 分类实体

        Returns:
            无返回值，方法不报错即为执行成功
        """

        cate = await Category.filter(title=post.title, is_delete=0).first()
        if cate:
            raise AppException(f"名称为{post.title}的分类已经存在！")

        # 如果是二级分类，检查父级分类是否存在
        if post.parent_id > 0:
            parent = await Category.filter(id=post.parent_id, is_delete=0).first()
            if not parent:
                raise AppException(f"父级分类不存在！")
            # 确保父级分类是一级分类
            if parent.level != 0:
                raise AppException(f"只能选择一级分类作为父级！")

        insertRes = await Category.create(
            **post.dict(),
            create_time=int(time.time()),
            update_time=int(time.time())
        )


    @classmethod
    async def edit(cls, post: schema.CategoryUpdate):
        """
        商品分类编辑
        :param post: 商品编辑参数
        :return: 无返回值，方法不报错即为执行成功
        """

        _post = await Category.filter(id=post.id, is_delete=0).first()
        if not _post:
            raise AppException("商品分类不存在")

        # 检查标题是否重复
        if post.title:
            _post3 = await Category.filter(title=post.title, id__not=post.id, is_delete=0).values("id")
            if _post3:
                raise AppException("商品分类名称已被占用")

        # 检查父级分类是否存在且为一级分类
        if post.parent_id is not None and post.parent_id > 0:
            parent = await Category.filter(id=post.parent_id, is_delete=0).first()
            if not parent:
                raise AppException(f"父级分类不存在！")
            # 确保父级分类是一级分类
            if parent.level != 0:
                raise AppException(f"只能选择一级分类作为父级！")
            # 不能选择自己作为父级
            if post.parent_id == post.id:
                raise AppException(f"不能选择自己作为父级！")

        params = post.dict()
        del params["id"]

        updateRes = await Category.filter(id=post.id).update(
            **params,
            update_time=int(time.time())
        )

    @classmethod
    async def delete(cls, id_: int):
        """
        删除一个分类
        :param id_: 分类的唯一Id
        :return: 无返回值，方法不报错即为执行成功
        """

        p = await Category.filter(id=id_, is_delete=0).first()
        if not p:
            raise AppException("商品分类不存在")

        # 检查分类是否有子分类
        sub_categories = await Category.filter(parent_id=id_, is_delete=0).first()
        if sub_categories:
            raise AppException("该分类下有子分类，不能删除")

        # 检查分类是否有商品
        admin = await Commodity.filter(cid=id_, is_delete=0).first()
        if admin:
            raise AppException("商品分类已被使用不能删除")

        await Category.filter(id=id_).update(is_delete=1, delete_time=int(time.time()))

    @classmethod
    async def selected_by_level(cls, level: int = 0) -> List[SelectItem]:
        """根据级别查询分类的options列表
        
        Args:
            level: 分类级别，默认为0（顶级分类）
            
        Returns:
            List[SelectItem]: 分类选项列表
        """
        
        selects = await Category.filter(is_delete=0, level=level).values("id", "title")
        
        results = TypeAdapter(List[SelectItem]).validate_python(selects)

        return results

    @classmethod
    async def initial_goods(cls):
        """初始化商品数据
        
        从 goods_details.json 文件读取商品数据，创建分类和商品。
        """
        print("开始初始化商品数据")
        # 顶级分类映射
        top_category = [
            {'key': 'AJ', 'category': 'AJ'},
            {'key': 'NK', 'category': 'Nike'},
            {'key': '空军', 'category': 'Nike'},
            {'key': 'dunk', 'category': 'Nike'},
            {'key': '皮蓬', 'category': 'Nike'},
            {'key': '耐克', 'category': 'Nike'},
            {'key': 'Nike', 'category': 'Nike'},
            {'key': 'NB', 'category': 'NB'},
            {'key': '匡威', 'category': '匡威'},
            {'key': 'MLB', 'category': 'MLB'},
            {'key': '亚瑟士', 'category': '亚瑟士'},
            {'key': '开拓者', 'category': 'AJ'},
            {'key': '登月', 'category': '登月'},
            {'key': '巴黎世家', 'category': '巴黎世家'},
            {'key': '拖鞋', 'category': '拖鞋'},
            {'key': 'vans', 'category': '万斯'},
            {'key': '彪马', 'category': '彪马'},
            {'key': '萨洛蒙', 'category': '萨洛蒙'},
            {'key': '椰子', 'category': '阿迪'},
            {'key': '马丁靴', 'category': '马丁靴'},
            {'key': 'UGG', 'category': 'UGG'},
            {'key': '德训鞋', 'category': '阿迪'},
            {'key': '阿迪', 'category': '阿迪'},
            {'key': 'Adidas', 'category': '阿迪'},
        ]
        
        # 价格映射
        price_map = [
            {'key': 'AJ1低', 'price': 268},
            {'key': 'AJ1中', 'price': 280},
            {'key': 'AJ3', 'price': 330},
            {'key': 'AJ4', 'price': 299},
            {'key': 'AJ5', 'price': 358},
            {'key': 'AJ6', 'price': 358},
            {'key': 'AJ11', 'price': 358},
            {'key': 'AJ12', 'price': 358},
            {'key': 'AJ13', 'price': 358},
            {'key': 'AJ23', 'price': 358},
            {'key': 'AJ34', 'price': 358},
            {'key': 'AJ31', 'price': 290},
            {'key': 'dunk', 'price': 300},
            {'key': 'force', 'price': 240},
            {'key': '空军', 'price': 240},
            {'key': '皮蓬', 'price': 358},
            {'key': '马丁靴', 'price': 380},
            {'key': '萨洛蒙', 'price': 398},
            {'key': 'UGG', 'price': 330},
            {'key': '德训鞋', 'price': 220},
            {'key': '阿迪', 'price': 220},
            {'key': 'Adidas', 'price': 220},
        ]
        
        # 读取商品详情文件
        goods_details_file = Path('./data/local_goods_detail.json')
        if not goods_details_file.exists():
            raise AppException("商品详情文件不存在")
        
        with open(goods_details_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 用于缓存已创建的分类
        top_category_cache = {}  # {category_name: category_id}
        second_category_cache = {}  # {category_name: category_id}
        
        created_count = 0
        skipped_count = 0
        
        for item in data:
            try:
                item_id = item.get("id")
                parent_id = item.get("parentId")
                category_name = item.get("breadcrumbTitle")
                title = item.get("goodsTitle")
                article_no = item.get("articleNo")
                main_image = item.get("mainImage")  # 提取主图
                image_urls = item.get("imageUrls", [])
                sizes = item.get("sizes")
                
                # 跳过无效数据
                if not category_name or not title:
                    skipped_count += 1
                    continue
                
                # 1. 匹配顶级分类
                matched_top_category = None
                for top_cat in top_category:
                    if top_cat['key'].lower() in category_name.lower():
                        matched_top_category = top_cat['category']
                        break
                
                # 如果没有匹配到，使用默认分类
                if not matched_top_category:
                    matched_top_category = "其他"
                
                # 2. 创建或获取一级分类
                if matched_top_category in top_category_cache:
                    top_cat_id = top_category_cache[matched_top_category]
                else:
                    top_cat = await Category.filter(
                        title=matched_top_category,
                        level=0,
                        is_delete=0
                    ).first()
                    
                    if not top_cat:
                        # 随机选择一张图片作为分类图片
                        cat_image = ""
                        if image_urls:
                            random_img = random.choice(image_urls)
                            # 构建本地图片路径
                            if random_img and isinstance(random_img, str):
                                img_ext = random_img.split('.')[-1] if '.' in random_img else 'webp'
                                cat_image = f"static/goods_image/{item_id}_{parent_id}_0.{img_ext}"
                        
                        top_cat = await Category.create(
                            title=matched_top_category,
                            is_show=1,
                            level=0,
                            parent_id=0,
                            image=cat_image,
                            sort=0,
                            create_time=int(time.time()),
                            update_time=int(time.time())
                        )
                    
                    top_cat_id = top_cat.id
                    top_category_cache[matched_top_category] = top_cat_id
                
                # 3. 创建或获取二级分类
                if category_name in second_category_cache:
                    second_cat_id = second_category_cache[category_name]
                else:
                    second_cat = await Category.filter(
                        title=category_name,
                        level=1,
                        parent_id=top_cat_id,
                        is_delete=0
                    ).first()
                    
                    if not second_cat:
                        # 随机选择一张图片作为分类图片
                        cat_image = ""
                        if image_urls:
                            random_img = random.choice(image_urls)
                            if random_img and isinstance(random_img, str):
                                img_ext = random_img.split('.')[-1] if '.' in random_img else 'webp'
                                cat_image = f"static/goods_image/{item_id}_{parent_id}_0.{img_ext}"
                        
                        second_cat = await Category.create(
                            title=category_name,
                            is_show=1,
                            level=1,
                            parent_id=top_cat_id,
                            image=cat_image,
                            sort=0,
                            create_time=int(time.time()),
                            update_time=int(time.time())
                        )
                    
                    second_cat_id = second_cat.id
                    second_category_cache[category_name] = second_cat_id
                
                # 4. 提取尺码信息
                size_list = []
                if sizes:
                    # 如果 sizes 字段有值，直接分割
                    size_list = sizes.split()
                elif article_no:
                    # 从 articleNo 中提取尺码
                    # 匹配 Size、尺寸、大小、尺码 等关键字
                    size_pattern = re.compile(r'(Size|尺寸|大小|尺码)[：:]\s*(.+)', re.IGNORECASE)
                    match = size_pattern.search(article_no)
                    if match:
                        size_str = match.group(2).strip()
                        # 提取数字和小数点
                        size_list = re.findall(r'\d+\.?\d*', size_str)
                        # 更新 article_no，去除尺码部分
                        article_no = article_no[:match.start()].strip()
                
                # 5. 构建 SKU
                sku_data = {}
                if size_list:
                    sku_data = {"尺码": size_list}
                
                # 6. 匹配价格
                hot_good = False
                matched_price = 299.0  # 默认价格
                search_text = f"{title} {category_name}".lower()
                for price_item in price_map:
                    if price_item['key'].lower() in search_text:
                        matched_price = float(price_item['price'])
                        hot_good = True
                        break
                
                # 7. 构建图片列表（保持原始顺序，索引与下载时一致）
                image_list = []
                for idx, img_url in enumerate(image_urls):
                    if img_url and isinstance(img_url, str):
                        img_ext = img_url.split('.')[-1] if '.' in img_url else 'webp'
                        # 使用原始索引，与 grab_goods.py 中下载时的索引保持一致
                        local_path = f"static/goods_image/{item_id}_{parent_id}_{idx}.{img_ext}"
                        image_list.append(local_path)
                
                # 8. 检查商品是否已存在
                existing_commodity = await Commodity.filter(
                    code=article_no if article_no else "",
                    title=title,
                    is_delete=0
                ).first()
                
                if existing_commodity:
                    skipped_count += 1
                    continue
                
                # 9. 创建商品
                # 处理主图：如果有 mainImage 则使用，否则使用第一张图片
                commodity_main_image = ""
                if main_image and isinstance(main_image, str):
                    # 从 mainImage URL 中提取文件名，构建本地路径
                    img_ext = main_image.split('.')[-1] if '.' in main_image else 'webp'
                    commodity_main_image = f"static/goods_image/{item_id}_{parent_id}_main.{img_ext}"
                elif image_list:
                    # 如果没有 mainImage，使用第一张图片
                    commodity_main_image = image_list[0]
                
                await Commodity.create(
                    code=article_no if article_no else "",
                    cid=second_cat_id,
                    title=title,
                    price=matched_price,
                    original_price=matched_price,
                    fee=0,
                    stock=99,
                    sales= random.randint(2000, 10000) if hot_good else random.randint(10, 200),
                    deliveryType=3,
                    main_image=commodity_main_image,
                    image=image_list,
                    intro=title,
                    browse=random.randint(2000, 10000) if hot_good else random.randint(10, 200),
                    collect=random.randint(200, 1000) if hot_good else random.randint(10, 100),
                    is_show=1,
                    sku=sku_data,
                    create_time=int(time.time()),
                    update_time=int(time.time())
                )
                
                created_count += 1
                
            except Exception as e:
                print(f"处理商品失败: {title}, 错误: {str(e)}")
                skipped_count += 1
                continue
        
        return {
            "created": created_count,
            "skipped": skipped_count,
            "total": len(data)
        }
