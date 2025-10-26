import request from '../../utils/request';
import type { RechargePackageResponse, RechargePlaceIn } from './types';

const rechargeApi = {
  /**
   * 套餐列表
   */
  package(): Promise<RechargePackageResponse[]> {
    return request<RechargePackageResponse[]>({
      url: 'recharge/package',
      method: 'GET'
    });
  },

  /**
   * 充值下单
   * @param params 下单参数
   */
  place(params: RechargePlaceIn): Promise<any> {
    return request({
      url: 'recharge/place',
      method: 'POST',
      params
    });
  }
};

export default rechargeApi;