import request from '@/utils/request'

const aiModelConfigApi = {
    /**
     * AI模型配置列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/ai-model-config/lists',
            params
        })
    },

    /**
     * AI模型配置详情
     */
    detail(id: number): Promise<any> {
        return request.get({
            url: '/ai-model-config/detail',
            params: { id }
        })
    },

    /**
     * 创建AI模型配置
     */
    create(params: any): Promise<any> {
        return request.post({
            url: '/ai-model-config/create',
            params
        })
    },

    /**
     * 更新AI模型配置
     */
    update(params: any): Promise<any> {
        return request.post({
            url: '/ai-model-config/update',
            params
        })
    },

    /**
     * 删除AI模型配置
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/ai-model-config/delete',
            params: { id }
        })
    },

    /**
     * 更改AI模型配置状态
     */
    changeStatus(params: any): Promise<any> {
        return request.post({
            url: '/ai-model-config/status',
            params
        })
    },

    /**
     * 获取所有启用的AI模型配置
     */
    getActiveList(): Promise<any> {
        return request.get({
            url: '/ai-model-config/active-list'
        })
    }
}

export default aiModelConfigApi