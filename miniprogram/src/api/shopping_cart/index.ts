import request from '../../utils/request';
import type {
  ShoppingCartListResponse,
  AddToCartIn,
  DeleteFromCartIn,
  UpdateCartIn,
  SelectCartItemsIn
} from './types';

/**
 * 购物车相关API接口
 */
const shoppingCartApi = {
  /**
   * 获取购物车列表
   * @returns Promise<ShoppingCartListResponse>
   */
  lists(): Promise<ShoppingCartListResponse> {
    return request<ShoppingCartListResponse>({
      url: 'shopping_cart/lists',
      method: 'GET'
    });
  },

  /**
   * 添加商品到购物车
   * @param params 添加参数
   * @returns Promise<any>
   */
  add(params: AddToCartIn): Promise<any> {
    return request({
      url: 'shopping_cart/add',
      method: 'POST',
      params
    });
  },

  /**
   * 删除购物车商品
   * @param params 删除参数
   * @returns Promise<any>
   */
  delete(params: DeleteFromCartIn): Promise<any> {
    return request({
      url: 'shopping_cart/delete',
      method: 'POST',
      params
    });
  },

  /**
   * 更新购物车商品数量
   * @param params 更新参数
   * @returns Promise<any>
   */
  update(params: UpdateCartIn): Promise<any> {
    return request({
      url: 'shopping_cart/update',
      method: 'POST',
      params
    });
  },

  /**
   * 选择购物车商品
   * @param params 选择参数
   * @returns Promise<any>
   */
  select(params: SelectCartItemsIn): Promise<any> {
    return request({
      url: 'shopping_cart/select',
      method: 'POST',
      params
    });
  },

  /**
   * 清空购物车
   * @returns Promise<any>
   */
  clear(): Promise<any> {
    return request({
      url: 'shopping_cart/clear',
      method: 'POST'
    });
  }
};

export default shoppingCartApi;