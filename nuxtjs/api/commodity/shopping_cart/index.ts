// 购物车API接口

// 定义响应类型接口
interface BaseResponse {
  code: number;
  message: string;
  data?: any;
}

// 从shopping_cart_schema.py推断的类型定义
interface ShoppingCartItem {
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

interface ShoppingCartListResponse extends BaseResponse {
  data: {
    total_count: number;
    selected_count: number;
    selected_price: number;
    items: ShoppingCartItem[];
  };
}

const shoppingCartApi = {
  /**
   * 获取购物车列表
   */
  lists(): Promise<ShoppingCartListResponse> {
    return $request.get({
      url: '/shopping_cart/lists'
    });
  },

  /**
   * 添加商品到购物车
   * 
   * @param {Object} data
   * @param {number} data.commodity_id - 商品ID
   * @param {number} data.quantity - 购买数量
   * @param {Object} [data.sku] - 规格
   */
  add(data: {
    commodity_id: number;
    quantity: number;
    sku?: Record<string, any>;
  }): Promise<BaseResponse> {
    return $request.post({
      url: '/shopping_cart/add',
      params: data
    });
  },

  /**
   * 删除购物车商品
   * 
   * @param {Object} data
   * @param {number[]} data.ids - 购物车ID列表
   */
  delete(data: {
    ids: number[];
  }): Promise<BaseResponse> {
    return $request.post({
      url: '/shopping_cart/delete',
      params: data
    });
  },

  /**
   * 更新购物车商品数量
   * 
   * @param {Object} data
   * @param {number} data.id - 购物车ID
   * @param {number} data.quantity - 购买数量
   */
  update(data: {
    id: number;
    quantity: number;
  }): Promise<BaseResponse> {
    return $request.post({
      url: '/shopping_cart/update',
      params: data
    });
  },

  /**
   * 选择购物车商品
   * 
   * @param {Object} data
   * @param {number[]} data.ids - 购物车ID列表
   * @param {number} data.is_selected - 是否选中: [0=否, 1=是]
   */
  select(data: {
    ids: number[];
    is_selected: 0 | 1;
  }): Promise<BaseResponse> {
    return $request.post({
      url: '/shopping_cart/select',
      params: data
    });
  },

  /**
   * 清空购物车
   */
  clear(): Promise<BaseResponse> {
    return $request.post({
      url: '/shopping_cart/clear'
    });
  }
};

export default shoppingCartApi;