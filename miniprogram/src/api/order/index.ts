import request from "../../utils/request";
import type {
  CreateOrderRequest,
  OrderCreateResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderListVo,
  OrderOperationResponse,
  WorkOrderCreateRequest,
  WorkOrderCancelRequest,
  WorkOrderLogisticsRequest,
  WorkOrderResubmitRequest,
  WorkOrderOperationResponse,
} from "./types";

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
      url: "order/create",
      method: "POST",
      data: params,
    });
  },

  /**
   * 订单详情
   * @param orderId 订单ID
   * @returns Promise<OrderDetailResponse>
   */
  detail(orderId?: number, orderSn?: string): Promise<OrderDetailResponse> {
    return request<OrderDetailResponse>({
      url: "order/detail",
      method: "GET",
      data: { order_id: orderId, order_sn: orderSn },
    });
  },

  /**
   * 订单列表
   * @param page 页码
   * @param size 每页数量
   * @returns Promise<OrderListResponse>
   */
  lists(
    keyword?: string,
    status?: number,
    query_type?: string,
    page: number = 1,
    size: number = 10
  ): Promise<OrderListVo[]> {
    return request<OrderListVo[]>({
      url: "order/lists",
      method: "GET",
      data: { keyword, status, query_type, page, size },
    });
  },

  /**
   * 删除订单
   * @param orderId 订单ID
   * @returns Promise<OrderOperationResponse>
   */
  delete(orderId: number): Promise<OrderOperationResponse> {
    return request<OrderOperationResponse>({
      url: "order/delete",
      method: "POST",
      params: { order_id: orderId },
    });
  },

  /**
   * 申请售后
   * @param params 申请售后参数
   * @returns Promise<WorkOrderOperationResponse>
   */
  applyAfterSales(
    params: WorkOrderCreateRequest
  ): Promise<WorkOrderOperationResponse> {
    return request<WorkOrderOperationResponse>({
      url: "order/after_sales/apply",
      method: "POST",
      data: params,
    });
  },

  /**
   * 取消售后
   * @param params 取消售后参数
   * @returns Promise<WorkOrderOperationResponse>
   */
  cancelAfterSales(
    params: WorkOrderCancelRequest
  ): Promise<WorkOrderOperationResponse> {
    return request<WorkOrderOperationResponse>({
      url: "order/after_sales/cancel",
      method: "POST",
      data: params,
    });
  },

  /**
   * 填写退货物流
   * @param params 填写退货物流参数
   * @returns Promise<WorkOrderOperationResponse>
   */
  fillReturnLogistics(
    params: WorkOrderLogisticsRequest
  ): Promise<WorkOrderOperationResponse> {
    return request<WorkOrderOperationResponse>({
      url: "order/after_sales/logistics",
      method: "POST",
      data: params,
    });
  },

  /**
   * 重新提交售后
   * @param params 重新提交售后参数
   * @returns Promise<WorkOrderOperationResponse>
   */
  resubmitAfterSales(
    params: WorkOrderResubmitRequest
  ): Promise<WorkOrderOperationResponse> {
    return request<WorkOrderOperationResponse>({
      url: "order/after_sales/resubmit",
      method: "POST",
      data: params,
    });
  },
};

export default orderApi;
