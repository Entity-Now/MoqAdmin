
import request from '@/utils/request'

const announcementApi = {
    /**
     * 发布软件公告，可绑定到指定软件列表
     */
    lists(params: any): Promise<any> {
        return request.get({
            url: '/software/announcement/lists',
            params
        })
    },

    /**
     * 发布软件公告，可绑定到指定软件详情
     */
    detail(id: number): Promise<any> {
        return request.get({
            url: '/software/announcement/detail',
            params: { id }
        })
    },

    /**
     * 发布软件公告，可绑定到指定软件新增
     */
    add(params: any): Promise<any> {
        return request.post({
            url: '/software/announcement/add',
            params
        })
    },

    /**
     * 发布软件公告，可绑定到指定软件编辑
     */
    edit(params: any): Promise<any> {
        return request.post({
            url: '/software/announcement/edit',
            params
        })
    },

    /**
     * 发布软件公告，可绑定到指定软件删除
     */
    delete(id: number): Promise<any> {
        return request.post({
            url: '/software/announcement/delete',
            params: { id }
        })
    }
}

export default announcementApi
