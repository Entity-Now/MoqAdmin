/** ------ [充值套餐] ------ */
export interface RechargePackageResponse {
  id: string; // 套餐ID
  name: string; // 套餐名称
  money: number; // 充值金额
  give_money: number; // 赠送金额
}

/** ------ [充值下单参数] ------ */
export interface RechargePlaceIn {
  money: number; // 充值金额
  source_id?: number; // 支付来源ID(可选)
}