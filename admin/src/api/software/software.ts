
import request from '@/utils/request'

const softwareApi = {
    /**
     * 管理软件的名称、标识、图标、描述等基础信息列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/software/software/lists',
            params
        })
    },

    /**
     * 管理软件的名称、标识、图标、描述等基础信息详情
     */
    detail(id: number): Promise<any> {
        return request.get({
            url: '/software/software/detail',
            params: { id }
        })
    },

    /**
     * 管理软件的名称、标识、图标、描述等基础信息新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/software/software/add',
            params
        })
    },

    /**
     * 管理软件的名称、标识、图标、描述等基础信息编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/software/software/edit',
            params
        })
    },

    /**
     * 管理软件的名称、标识、图标、描述等基础信息删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/software/software/delete',
            params: { id }
        })
    }
}

export default softwareApi
