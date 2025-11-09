import request from '../../utils/request';
import type {
  AddressAddIn,
  AddressEditIn,
  AddressItem,
  AddressIdParam
} from './types';

const addressApi = {
  /**
   * 获取地址列表
   */
  lists(): Promise<AddressItem[]> {
    return request<AddressItem[]>({
      url: 'address/lists',
      method: 'GET'
    });
  },
  
  /**
   * 获取地址详情
   * 
   * @param {Object} params
   * @param {number} params.id - 地址ID
   */
  detail(params: AddressIdParam): Promise<AddressItem> {
    return request<AddressItem>({
      url: 'address/detail',
      method: 'GET',
      data: {
        id: params.id
      }
    });
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
   */
  add(params: AddressAddIn): Promise<any> {
    return request({
      url: 'address/add',
      method: 'POST',
      data: params
    });
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
   */
  edit(params: AddressEditIn): Promise<any> {
    return request({
      url: 'address/edit',
      method: 'POST',
      data: params
    });
  },
  
  /**
   * 删除地址
   * 
   * @param {Object} params
   * @param {number} params.id - 地址ID
   */
  delete(params: AddressIdParam): Promise<any> {
    return request({
      url: 'address/delete',
      method: 'POST',
      data: {
        id: params.id
      }
    });
  },
  
  /**
   * 设置默认地址
   * 
   * @param {Object} params
   * @param {number} params.id - 地址ID
   */
  setDefault(params: AddressIdParam): Promise<any> {
    return request({
      url: 'address/set_default',
      method: 'POST',
      data: params
    });
  },
  
  /**
   * 获取地址信息
   */
  getAddress(): Promise<any> {
    return request({
      url: 'static/address.json',
      method: 'GET',
      isTransformResponse: false
    });
  },
  
  /**
   * 获取当前地址
   */
  current(): Promise<any> {
    return request({
      url: 'address/current',
      method: 'GET'
    });
  }
};

export default addressApi;