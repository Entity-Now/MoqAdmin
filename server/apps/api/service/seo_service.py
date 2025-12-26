import json
import os
from typing import List, Union, Dict
from datetime import datetime
from common.models.commodity import Commodity, Category
from common.models.article import ArticleModel, ArticleCategoryModel
from apps.api.schemas.seo_schema import SitemapUrl


class SeoService:
    """SEO service for generating sitemaps in multiple formats"""

    @classmethod
    async def generate_sitemap(cls, base_url: str = "https://yourdomain.com", type: str = 'xml') -> Union[str, List[Dict]]:
        """
        Generate sitemap in different formats
        
        Args:
            base_url: Base URL of the website
            type: Output format - 'xml', 'json', or 'text'
            
        Returns:
            Sitemap content in the requested format:
            - xml: XML string
            - json: List of dictionaries
            - text: Text string with URLs separated by newlines
        """
        # Collect all URLs
        urls: List[SitemapUrl] = await cls._collect_urls(base_url)
        
        # Generate output based on type
        if type == 'json':
            return cls._generate_json(urls)
        elif type == 'text':
            return cls._generate_text(urls)
        else:  # xml
            return cls._generate_xml(urls)
    
    @classmethod
    async def _collect_urls(cls, base_url: str) -> List[SitemapUrl]:
        """
        Collect all URLs for the sitemap
        
        Args:
            base_url: Base URL of the website
            
        Returns:
            List of SitemapUrl objects
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
        
        return urls
    
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
    def _generate_json(urls: List[SitemapUrl]) -> List[Dict]:
        """
        Generate JSON-serializable list from URL list
        
        Args:
            urls: List of SitemapUrl objects
            
        Returns:
            List of dictionaries (JSON-serializable)
        """
        return [url.model_dump(exclude_none=True) for url in urls]
    
    @staticmethod
    def _generate_text(urls: List[SitemapUrl]) -> str:
        """
        Generate plain text with URLs separated by newlines
        
        Args:
            urls: List of SitemapUrl objects
            
        Returns:
            Text string with one URL per line
        """
        return '\n'.join([url.loc for url in urls])

    @classmethod
    async def get_sitemap_file(cls, base_url: str, type: str = 'xml') -> Union[str, List[Dict]]:
        """
        Get sitemap file (cached version if exists for today, otherwise generate new one)
        
        Args:
            base_url: Base URL of the website
            type: File format - 'xml', 'json', or 'text'
            
        Returns:
            Sitemap content in the requested format
        """
        # Configuration
        dir_path = "./public/static/"
        date_str = datetime.now().strftime("%Y-%m-%d")
        
        # Determine file extension based on type
        file_extension = type if type in ['xml', 'json', 'txt'] else 'xml'
        if type == 'text':
            file_extension = 'txt'
        
        file_name = os.path.join(dir_path, f"sitemap_{date_str}.{file_extension}")
        
        # Ensure directory exists
        os.makedirs(dir_path, exist_ok=True)
        
        # Read existing file if it exists
        if os.path.exists(file_name):
            with open(file_name, "r", encoding="utf-8") as f:
                content = f.read()
                # For JSON, parse it back to list
                if type == 'json':
                    return json.loads(content)
                return content
        
        # Generate new content
        content = await cls.generate_sitemap(base_url=base_url, type=type)
        
        # Write to file
        with open(file_name, "w", encoding="utf-8") as f:
            if type == 'json':
                # Write JSON with proper formatting
                json.dump(content, f, ensure_ascii=False, indent=2)
            else:
                # Write XML or text directly
                f.write(content)
        
        return content