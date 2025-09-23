import request from '@/utils/request'

const softwareVersionApi = {
    /**
     * 软件选项列表
     */
    selectSoftware(): Promise<any> {
        return request.get({
            url: '/software/software_version/select_software'
        })
    },
    
    /**
     * 软件版本列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/software/software_version/lists',
            params
        })
    },

    /**
     * 软件版本详情
     */
    detail(id: number): Promise<any> {
        return request.get({
            url: '/software/software_version/detail',
            params: { id }
        })
    },

    /**
     * 软件版本新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/software/software_version/add',
            params
        })
    },

    /**
     * 软件版本编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/software/software_version/edit',
            params
        })
    },

    /**
     * 软件版本删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/software/software_version/delete',
            params: { id }
        })
    }
}

export default softwareVersionApi