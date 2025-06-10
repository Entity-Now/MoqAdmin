import request from '@/utils/request'

const commodityApi = {
    /**
     * 所有商品
     */
    selects(): Promise<any> {
        return request.get({
            url: '/shopping/shop_commodity/selects'
        })
    },

    /**
     * 商品列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/shopping/shop_commodity/lists',
            params
        })
    },
    /**
     * 商品新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/shopping/shop_commodity/add',
            params
        })
    },

    /**
     * 商品编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/shopping/shop_commodity/edit',
            params
        })
    },

    /**
     * 商品删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/shopping/shop_commodity/delete',
            params: { id }
        })
    }
}

export default commodityApi
