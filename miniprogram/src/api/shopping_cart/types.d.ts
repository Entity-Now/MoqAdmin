/** ------ [购物车商品项] ------ */
export interface ShoppingCartItem {
  id: number; // 购物车项ID
  commodity_id: number; // 商品ID
  title: string; // 商品标题
  image: string; // 商品图片
  price: number; // 商品价格
  fee?: number | null; // 运费
  stock: number; // 库存
  sales: number; // 销量
  quantity: number; // 购买数量
  sku?: Record<string, any> | null; // 规格
  is_selected: number; // 是否选中: [0=否, 1=是]
  create_time: string; // 创建时间
  update_time: string; // 更新时间
}

/** ------ [购物车列表响应] ------ */
export interface ShoppingCartListResponse {
  total_count: number; // 总商品数
  selected_count: number; // 已选中商品数
  selected_price: number; // 已选中总价
  items: ShoppingCartItem[]; // 购物车商品项
}

/** ------ [添加到购物车参数] ------ */
export interface AddToCartIn {
  commodity_id: number; // 商品ID
  quantity: number; // 购买数量
  sku?: Record<string, any> | null; // 规格
}

/** ------ [删除购物车商品参数] ------ */
export interface DeleteFromCartIn {
  ids: number[]; // 购物车项ID列表
}

/** ------ [更新购物车数量参数] ------ */
export interface UpdateCartIn {
  id: number; // 购物车项ID
  quantity: number; // 购买数量
}

/** ------ [选择购物车商品参数] ------ */
export interface SelectCartItemsIn {
  ids: number[]; // 购物车项ID列表
  is_selected: 0 | 1; // 是否选中
}