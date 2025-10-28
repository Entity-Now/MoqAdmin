import request from '../../utils/request';
import type {
  CreateOrderRequest,
  OrderCreateResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderListVo,
  OrderOperationResponse
} from './types';

/**
 * 订单相关API接口
 */
const orderApi = {
  /**
   * 创建订单
   * @param params 创建订单参数
   * @returns Promise<OrderCreateResponse>
   */
  create(params: CreateOrderRequest): Promise<OrderCreateResponse> {
    return request<OrderCreateResponse>({
      url: 'order/create',
      method: 'POST',
      params
    });
  },

  /**
   * 订单详情
   * @param orderId 订单ID
   * @returns Promise<OrderDetailResponse>
   */
  detail(orderId: number): Promise<OrderDetailResponse> {
    return request<OrderDetailResponse>({
      url: 'order/detail',
      method: 'GET',
      params: { order_id: orderId }
    });
  },

  /**
   * 订单列表
   * @param page 页码
   * @param size 每页数量
   * @returns Promise<OrderListResponse>
   */
  lists(status: number, page: number = 1, size: number = 10): Promise<OrderListVo[]> {
    return request<OrderListVo[]>({
      url: 'order/lists',
      method: 'GET',
      params: { status, page, size }
    });
  },

  /**
   * 取消订单
   * @param orderId 订单ID
   * @returns Promise<OrderOperationResponse>
   */
  cancel(orderId: number): Promise<OrderOperationResponse> {
    return request<OrderOperationResponse>({
      url: 'order/cancel',
      method: 'POST',
      params: { order_id: orderId }
    });
  },

  /**
   * 删除订单
   * @param orderId 订单ID
   * @returns Promise<OrderOperationResponse>
   */
  delete(orderId: number): Promise<OrderOperationResponse> {
    return request<OrderOperationResponse>({
      url: 'order/delete',
      method: 'POST',
      params: { order_id: orderId }
    });
  }
};

export default orderApi;