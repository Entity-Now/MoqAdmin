import request from '@/utils/request'

const categoryCateApi = {
    /**
     * 所有商品分类
     */
    selects(): Promise<any> {
        return request.get({
            url: '/shopping/shop_category/selects'
        })
    },

    /**
     * 商品分类列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/shopping/shop_category/lists',
            params
        })
    },
    /**
     * 商品分类新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/shopping/shop_category/add',
            params
        })
    },

    /**
     * 商品分类编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/shopping/shop_category/edit',
            params
        })
    },

    /**
     * 商品分类删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/shopping/shop_category/delete',
            params: { id }
        })
    }
}

export default categoryCateApi
