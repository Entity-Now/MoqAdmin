import type { CommodityCategory, CommodityListsResponse, CommodityDetailResponse, CommodityPagesResponse } from './types.d'

const commodityApi = {
    /**
     * 商品轮播海报
     */
    banner(): Promise<_AppHomingAdv[]> {
        return $request.get<_AppHomingAdv[]>({
            url: '/commodity/banner'
        })
    },
    
    /**
     * 商品页面数据
     */
    pages(): Promise<CommodityPagesResponse> {
        return $request.get<CommodityPagesResponse>({
            url: '/commodity/pages'
        })
    },
    
    /**
     * 获取商品分类列表
     */
    categories(): Promise<CommodityCategory[]> {
        return $request.get<CommodityCategory[]>({
            url: '/commodity/category'
        })
    },
    
    /**
     * 商品列表
     * 
     * @param {Object} params
     * @param {number} params.page - 当前页码
     * @param {number} params.categoryId - 分类ID
     * @param {string} params.keyword - 搜索关键词
     * @param {number} params.minPrice - 最低价格
     * @param {number} params.maxPrice - 最高价格
     * @returns {Promise<CommodityListsResponse>}
     */
    lists(params: {
        page?: number,
        categoryId?: number | null,
        keyword?: string,
        minPrice?: number | null,
        maxPrice?: number | null
    }): Promise<CommodityListsResponse> {
        return $request.get<CommodityListsResponse>({
            url: '/commodity/lists',
            params
        })
    },
    
    /**
     * 商品详情
     * 
     * @param {number} id - 商品ID
     * @returns {Promise<CommodityDetailResponse>}
     */
    detail(id: number): Promise<CommodityDetailResponse> {
        return $request.get<CommodityDetailResponse>({
            url: '/commodity/detail',
            params: { id }
        })
    },
    
    /**
     * 相关商品
     * 
     * @param {number} id - 商品ID
     * @returns {Promise<CommodityListsResponse[]>}
     */
    related(id: number): Promise<CommodityListsResponse[]> {
        return $request.get<CommodityListsResponse[]>({
            url: '/commodity/related',
            params: { id }
        })
    },
    
    /**
     * 商品收藏/取消收藏
     * 
     * @param {number} id - 商品ID
     * @returns {Promise<any>}
     */
    collect(id: number): Promise<any> {
        return $request.post({
            url: '/commodity/collect',
            params: { id }
        })
    }
}

export default commodityApi