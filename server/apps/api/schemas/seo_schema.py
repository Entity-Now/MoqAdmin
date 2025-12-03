from pydantic import BaseModel, Field
from typing import Optional


class SitemapUrl(BaseModel):
    """Sitemap URL entry"""
    loc: str = Field(..., description="URL location")
    lastmod: Optional[str] = Field(None, description="Last modification date (YYYY-MM-DD)")
    changefreq: str = Field(default="weekly", description="Change frequency")
    priority: float = Field(default=0.5, description="Priority (0.0-1.0)")
