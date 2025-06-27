
import request from '@/utils/request'

const warehouseCardApi = {
    /**
     * 仓库列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/shopping/warehouse_card/lists',
            params
        })
    },

    /**
     * 仓库详情
     */
    detail(id: number): Promise<any> {
        return request.get({
            url: '/shopping/warehouse_card/detail',
            params: { id }
        })
    },

    /**
     * 仓库新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/shopping/warehouse_card/add',
            params
        })
    },

    /**
     * 仓库编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/shopping/warehouse_card/edit',
            params
        })
    },

    /**
     * 仓库删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/shopping/warehouse_card/delete',
            params: { id }
        })
    }
}

export default warehouseCardApi
