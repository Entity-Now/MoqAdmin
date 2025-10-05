// 订单相关类型定义

/**
 * 创建订单请求接口
 */
export interface CreateOrderRequest {
  commodity_id?: number;
  quantity?: number;
  sku?: Record<string, any> | null;
  address_id: number;
  is_from_cart: boolean;
  cart_ids?: number[];
  remark?: string;
}

/**
 * 订单商品项接口
 */
export interface OrderGoodsItem {
  commodity_id: number;
  title: string;
  image: string;
  price: number;
  fee: any;
  quantity: number;
  sku: any;
}

/**
 * 订单创建响应接口
 */
export interface OrderCreateResponse {
  order_id: number;
  order_sn: string;
  total_amount: number;
  actual_pay_amount: number;
}

/**
 * 订单详情响应接口
 */
export interface OrderDetailResponse {
  id: number;
  order_sn: string;
  total_amount: number;
  discount_amount: number;
  actual_pay_amount: number;
  pay_status: number;
  pay_way: number;
  pay_time?: string;
  delivery_time?: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  remark: string;
  create_time: string;
  goods_list: OrderGoodsItem[];
}

/**
 * 订单列表项接口
 */
export interface OrderListVo {
  id: number;
  order_sn: string;
  total_amount: number;
  actual_pay_amount: number;
  pay_status: number;
  pay_way: number;
  create_time: string;
  total_goods: number;
  goods_list: OrderGoodsItem[];
}

/**
 * 订单列表响应接口
 */
export interface OrderListResponse {
  lists: OrderListVo[];
  total: number;
  page: number;
  size: number;
}

/**
 * 订单操作结果接口
 */
export interface OrderOperationResponse {
  code: number;
  msg: string;
}