// 订单API接口
import type { 
  CreateOrderRequest, 
  OrderCreateResponse, 
  OrderDetailResponse, 
  OrderListResponse, 
  OrderOperationResponse 
} from './types';

const orderApi = {
  /**
   * 创建订单
   * 
   * @param {CreateOrderRequest} params - 创建订单参数
   * @returns {Promise<OrderCreateResponse>} - 订单创建响应
   */
  create(params: CreateOrderRequest): Promise<OrderCreateResponse> {
    return $request.post<OrderCreateResponse>({
      url: '/order/create',
      params
    });
  },

  /**
   * 获取订单详情
   * 
   * @param {number} orderId - 订单ID
   * @returns {Promise<OrderDetailResponse>} - 订单详情响应
   */
  detail(orderId: number): Promise<OrderDetailResponse> {
    return $request.get<OrderDetailResponse>({
      url: '/order/detail',
      params: {
        order_id: orderId
      }
    });
  },

  /**
   * 获取订单列表
   * 
   * @param {number} page - 页码
   * @param {number} size - 每页数量
   * @returns {Promise<OrderListResponse>} - 订单列表响应
   */
  lists(keyword?: string, status?: number, page: number = 1, size: number = 10): Promise<OrderListResponse> {
    return $request.get<OrderListResponse>({
      url: '/order/lists',
      params: {
        keyword,
        status,
        page,
        size
      }
    });
  },

  /**
   * 取消订单
   * 
   * @param {number} orderId - 订单ID
   * @returns {Promise<OrderOperationResponse>} - 订单操作结果
   */
  cancel(orderId: number): Promise<OrderOperationResponse> {
    return $request.post<OrderOperationResponse>({
      url: '/order/cancel',
      params: {
        order_id: orderId
      }
    });
  },

  /**
   * 删除订单
   * 
   * @param {number} orderId - 订单ID
   * @returns {Promise<OrderOperationResponse>} - 订单操作结果
   */
  delete(orderId: number): Promise<OrderOperationResponse> {
    return $request.post<OrderOperationResponse>({
      url: '/order/delete',
      params: {
        order_id: orderId
      }
    });
  }
};

export default orderApi;