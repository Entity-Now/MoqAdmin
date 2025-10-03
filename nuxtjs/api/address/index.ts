const addressApi = {
    /**
     * 获取地址列表
     *
     * @returns {Promise<any>}
     * @author zero
     */
    lists(): Promise<any> {
        return $request.get<any>({
            url: '/address/lists'
        })
    },

    /**
     * 获取地址详情
     *
     * @param {Object} params
     * @param {number} params.id - 地址ID
     * @returns {Promise<any>}
     * @author zero
     */
    detail(params: { id: number }): Promise<any> {
        return $request.get<any>({
            url: '/address/detail',
            params: {
                id: params.id
            }
        })
    },

    /**
     * 添加地址
     *
     * @param {Object} params
     * @param {string} params.name - 收货人姓名
     * @param {string} params.phone - 收货人电话
     * @param {string} params.province - 省份
     * @param {string} params.city - 城市
     * @param {string} params.district - 区县
     * @param {string} params.address - 详细地址
     * @param {number} params.is_default - 是否默认地址(0:否,1:是)
     * @returns {Promise<any>}
     * @author zero
     */
    add(params: {
        name: string,
        phone: string,
        province: string,
        city: string,
        district: string,
        address: string,
        is_default: number
    }): Promise<any> {
        return $request.post({
            url: '/address/add',
            params
        })
    },

    /**
     * 编辑地址
     *
     * @param {Object} params
     * @param {number} params.id - 地址ID
     * @param {string} params.name - 收货人姓名
     * @param {string} params.phone - 收货人电话
     * @param {string} params.province - 省份
     * @param {string} params.city - 城市
     * @param {string} params.district - 区县
     * @param {string} params.address - 详细地址
     * @param {number} params.is_default - 是否默认地址(0:否,1:是)
     * @returns {Promise<any>}
     * @author zero
     */
    edit(params: {
        id: number,
        name: string,
        phone: string,
        province: string,
        city: string,
        district: string,
        address: string,
        is_default: number
    }): Promise<any> {
        return $request.post({
            url: '/address/edit',
            params
        })
    },

    /**
     * 删除地址
     *
     * @param {Object} params
     * @param {number} params.id - 地址ID
     * @returns {Promise<any>}
     * @author zero
     */
    delete(params: { id: number }): Promise<any> {
        return $request.post({
            url: '/address/delete',
            params: {
                id: params.id
            }
        })
    },

    /**
     * 设置默认地址
     *
     * @param {Object} params
     * @param {number} params.id - 地址ID
     * @returns {Promise<any>}
     * @author zero
     */
    setDefault(params: { id: number }): Promise<any> {
        return $request.post({
            url: '/address/set_default',
            params: {
                id: params.id
            }
        })
    },
    getAddress(){
        return $request.get<any>({
            url: '/static/address.json'
        },{
                isReturnDefaultResponse: true
            })
    },
    
    /**
     * 获取当前地址
     *
     * @returns {Promise<any>}
     * @author zero
     */
    current(): Promise<any> {
        return $request.get<any>({
            url: '/address/current'
        })
    }
}

export default addressApi