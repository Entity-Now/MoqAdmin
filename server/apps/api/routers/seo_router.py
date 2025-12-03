from fastapi import APIRouter
from fastapi.responses import Response
from apps.api.service.seo_service import SeoService
from kernels.utils import RequestUtil

router = APIRouter(prefix="/seo", tags=["SEO"])

@router.get("/sitemap", summary="Generate sitemap.xml")
async def get_sitemap(type: str = 'json'):
    """
    Generate and return sitemap.xml file
    
    Returns:
        XML response with sitemap content
    """
    # TODO: Replace with your actual domain
    base_url = RequestUtil.domain
    
    # Generate sitemap XML
    xml_content = await SeoService.generate_sitemap(base_url, type)
    
    # Return XML response
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Content-Disposition": "inline; filename=sitemap.xml"
        }
    )

@router.get("/get_sitemap_file", summary="Get sitemap.xml file")
async def get_sitemap_file(type: str = 'json'):
    """
    Get sitemap.xml file
    
    Returns:
        XML response with sitemap content
    """
    base_url = RequestUtil.domain
    xml_content = await SeoService.get_sitemap_file(base_url, type)
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Content-Disposition": "inline; filename=sitemap.xml"
        }
    )