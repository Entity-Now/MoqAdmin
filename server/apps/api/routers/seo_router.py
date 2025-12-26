from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, JSONResponse
from apps.api.service.seo_service import SeoService
from kernels.utils import RequestUtil

router = APIRouter(prefix="/seo", tags=["SEO"])

@router.get("/sitemap", summary="Generate sitemap")
async def get_sitemap(type: str = 'xml'):
    """
    Generate and return sitemap in different formats
    
    Args:
        type: Response format - 'xml', 'json', or 'text'
    
    Returns:
        Sitemap content in the requested format
    """
    # Validate type parameter
    if type not in ['xml', 'json', 'text']:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'xml', 'json', or 'text'")
    
    base_url = RequestUtil.domain
    
    # Generate sitemap content
    content = await SeoService.generate_sitemap(base_url, type)
    
    # Return response based on type
    if type == 'json':
        return JSONResponse(content=content)
    elif type == 'text':
        return Response(
            content=content,
            media_type="text/plain; charset=utf-8",
            headers={
                "Content-Disposition": "inline; filename=sitemap.txt"
            }
        )
    else:  # xml
        return Response(
            content=content,
            media_type="application/xml; charset=utf-8",
            headers={
                "Content-Disposition": "inline; filename=sitemap.xml"
            }
        )

@router.get("/get_sitemap_file", summary="Get sitemap file")
async def get_sitemap_file(type: str = 'json'):
    """
    Get sitemap file (cached version if exists, otherwise generate new one)
    
    Args:
        type: File format - 'xml', 'json', or 'text'
    
    Returns:
        Sitemap content in the requested format
    """
    # Validate type parameter
    if type not in ['xml', 'json', 'text']:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'xml', 'json', or 'text'")
    
    base_url = RequestUtil.domain
    content = await SeoService.get_sitemap_file(base_url, type)
    
    # Return response based on type
    if type == 'json':
        return JSONResponse(content=content)
    elif type == 'text':
        return Response(
            content=content,
            media_type="text/plain; charset=utf-8",
            headers={
                "Content-Disposition": "inline; filename=sitemap.txt"
            }
        )
    else:  # xml
        return Response(
            content=content,
            media_type="application/xml; charset=utf-8",
            headers={
                "Content-Disposition": "inline; filename=sitemap.xml"
            }
        )