import request from '../../utils/request';
import type { PayWayResponse, PayListenIn, PayListenResponse, PrepayIn } from './types';

const paymentApi = {
  /**
   * 支付方式
   */
  payWay(): Promise<PayWayResponse> {
    return request<PayWayResponse>({
      url: 'payment/pay_way',
      method: 'GET'
    });
  },

  /**
   * 支付监听
   * @param params 监听参数
   */
  listen(params: PayListenIn): Promise<PayListenResponse> {
    return request<PayListenResponse>({
      url: 'payment/listen',
      method: 'GET',
      data: params  
    });
  },
  /**
   * 检查支付状态
   * @param params 检查参数
   */
  checkPayStatus(params: PayListenIn): Promise<boolean> {
    return request<boolean>({
      url: 'payment/check_pay_status',
      method: 'GET',
      data: params  
    });
  },
  
  /**
   * 发起支付
   * @param params 支付参数
   */
  prepay(params: PrepayIn): Promise<any> {
    return request({
      url: 'payment/prepay',
      method: 'POST',
      data: params
    });
  }
};

export default paymentApi;