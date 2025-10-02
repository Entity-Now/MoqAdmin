# +----------------------------------------------------------------------
# | WaitAdmin(fastapi)快速开发后台管理系统
# +----------------------------------------------------------------------
# | 欢迎阅读学习程序代码,建议反馈是我们前进的动力
# | 程序完全开源可支持商用,允许去除界面版权信息
# | gitee:   https://gitee.com/wafts/waitadmin-python
# | github:  https://github.com/topwait/waitadmin-python
# | 官方网站: https://www.waitadmin.cn
# | WaitAdmin团队版权所有并拥有最终解释权
# +----------------------------------------------------------------------
# | Author: WaitAdmin Team <2474369941@qq.com>
# +----------------------------------------------------------------------
from fastapi import APIRouter, Request, Depends
from hypertext import R, response_json
from apps.api.schemas import shopping_cart_schema as schema
from apps.api.service.shopping_cart_service import ShoppingCartService


router = APIRouter(prefix="/shopping_cart", tags=["购物车管理"])


@router.get("/lists", summary="获取购物车列表", response_model=R[schema.ShoppingCartListVo])
@response_json
async def lists(request: Request):
    """
    获取当前用户的购物车列表
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.lists(user_id)


@router.post("/add", summary="添加商品到购物车", response_model=R)
@response_json
async def add(request: Request, post: schema.ShoppingCartAddIn):
    """
    添加商品到购物车
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.add(user_id, post)


@router.post("/delete", summary="删除购物车商品", response_model=R)
@response_json
async def delete(request: Request, post: schema.ShoppingCartDeleteIn):
    """
    删除购物车商品
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.delete(user_id, post)


@router.post("/update", summary="更新购物车商品数量", response_model=R)
@response_json
async def update(request: Request, post: schema.ShoppingCartUpdateIn):
    """
    更新购物车商品数量
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.update(user_id, post)


@router.post("/select", summary="选择或取消选择购物车商品", response_model=R)
@response_json
async def select(request: Request, post: schema.ShoppingCartSelectIn):
    """
    选择或取消选择购物车商品
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.select(user_id, post)


@router.post("/clear", summary="清空购物车", response_model=R)
@response_json
async def clear(request: Request):
    """
    清空购物车
    """
    user_id: int = request.state.user_id
    return await ShoppingCartService.clear(user_id)