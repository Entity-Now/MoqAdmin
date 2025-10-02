// 购物车相关类型定义

/**
 * 购物车商品项接口
 */
export interface ShoppingCartItem {
  id: number;
  commodity_id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  quantity: number;
  sku?: Record<string, any> | null;
  is_selected: number;
  create_time: string;
  update_time: string;
}

/**
 * 购物车列表响应接口
 */
export interface ShoppingCartListResponse {
  total_count: number;
  selected_count: number;
  selected_price: number;
  items: ShoppingCartItem[];
}

/**
 * 添加购物车请求接口
 */
export interface AddToCartRequest {
  commodity_id: number;
  quantity: number;
  sku?: Record<string, any> | null;
}

/**
 * 删除购物车请求接口
 */
export interface DeleteFromCartRequest {
  ids: number[];
}

/**
 * 更新购物车请求接口
 */
export interface UpdateCartRequest {
  id: number;
  quantity: number;
}

/**
 * 选择购物车商品请求接口
 */
export interface SelectCartItemsRequest {
  ids: number[];
  is_selected: 0 | 1;
}