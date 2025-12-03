import json
import os
from typing import List
from datetime import datetime
from common.models.commodity import Commodity, Category
from common.models.article import ArticleModel, ArticleCategoryModel
from apps.api.schemas.seo_schema import SitemapUrl


class SeoService:
    """SEO service for generating sitemaps"""

    @classmethod
    async def generate_sitemap(cls, base_url: str = "https://yourdomain.com", type: str = 'json'):
        """
        Generate sitemap XML
        
        Args:
            base_url: Base URL of the website
            
        Returns:
            XML string of the sitemap
        """
        urls: List[SitemapUrl] = []
        
        # Add homepage
        urls.append(SitemapUrl(
            loc=f"{base_url}/",
            changefreq="daily",
            priority=1.0
        ))
        
        # Add commodity list page
        urls.append(SitemapUrl(
            loc=f"{base_url}/commodity",
            changefreq="daily",
            priority=0.9
        ))
        
        # Add commodity category pages
        categories = await Category.filter(
            is_show=1,
            is_delete=0
        ).all()
        
        for category in categories:
            urls.append(SitemapUrl(
                loc=f"{base_url}/commodity?categoryId={category.id}",
                changefreq="weekly",
                priority=0.8
            ))
        
        # Add commodity detail pages
        commodities = await Commodity.filter(
            is_show=1,
            is_delete=0
        ).all()
        
        for commodity in commodities:
            # Convert timestamp to date string
            lastmod = None
            if commodity.update_time:
                lastmod = datetime.fromtimestamp(commodity.update_time).strftime("%Y-%m-%d")
            
            urls.append(SitemapUrl(
                loc=f"{base_url}/commodity/detail/{commodity.id}",
                lastmod=lastmod,
                changefreq="weekly",
                priority=0.7
            ))
        
        # Add article list page
        urls.append(SitemapUrl(
            loc=f"{base_url}/article/lists",
            changefreq="daily",
            priority=0.9
        ))
        
        # Add article category pages
        article_categories = await ArticleCategoryModel.filter(
            is_disable=0,
            is_delete=0
        ).all()
        
        for category in article_categories:
            urls.append(SitemapUrl(
                loc=f"{base_url}/article/lists?categoryId={category.id}",
                changefreq="weekly",
                priority=0.8
            ))
        
        # Add article detail pages
        articles = await ArticleModel.filter(
            is_show=1,
            is_delete=0
        ).all()
        
        for article in articles:
            # Convert timestamp to date string
            lastmod = None
            if article.update_time:
                lastmod = datetime.fromtimestamp(article.update_time).strftime("%Y-%m-%d")
            
            urls.append(SitemapUrl(
                loc=f"{base_url}/article/detail/{article.id}",
                lastmod=lastmod,
                changefreq="monthly",
                priority=0.6
            ))
        if type == 'json':
            return urls
        
        # Generate XML
        xml = cls._generate_xml(urls)
        return xml
    
    @staticmethod
    def _generate_xml(urls: List[SitemapUrl]) -> str:
        """
        Generate XML string from URL list
        
        Args:
            urls: List of SitemapUrl objects
            
        Returns:
            XML string
        """
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        
        for url in urls:
            xml_lines.append('  <url>')
            xml_lines.append(f'    <loc>{url.loc}</loc>')
            
            if url.lastmod:
                xml_lines.append(f'    <lastmod>{url.lastmod}</lastmod>')
            
            xml_lines.append(f'    <changefreq>{url.changefreq}</changefreq>')
            xml_lines.append(f'    <priority>{url.priority}</priority>')
            xml_lines.append('  </url>')
        
        xml_lines.append('</urlset>')
        
        return '\n'.join(xml_lines)

    @staticmethod
    async def get_sitemap_file(base_url: str , type: str = 'json'):
        """
        生成sitemap_今天.xml文件（优化后：指定时区、编码、确保目录存在）
        """
        # 1. 配置参数（统一管理，便于维护）
        dir_path = "./public/static/"
        date_str = datetime.now().strftime("%Y-%m-%d")
        file_name = os.path.join(dir_path, f"sitemap_{date_str}.xml")
        
        # 2. 确保目录存在（避免FileNotFoundError）
        os.makedirs(dir_path, exist_ok=True)
        
        # 3. 读取已存在的文件
        if os.path.exists(file_name):
            with open(file_name, "r", encoding="utf-8") as f:
                return f.read()
        
        # 4. 生成并写入新文件
        xml = await SeoService.generate_sitemap(base_url=base_url, type=type)
        with open(file_name, "w", encoding="utf-8") as f:
            if type == 'json':
                f.write(json.dumps([url.model_dump(exclude_none=True) for url in xml]))
            else:
                f.write(xml)
        
        return xml