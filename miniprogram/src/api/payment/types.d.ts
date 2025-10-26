/** ------ [支付方式] ------ */
export interface PayWayResponse {
  channel: number; // 支付渠道
  shorter: string; // 渠道标识（短名）
  icon: string; // 渠道图标
}

/** ------ [支付监听入参] ------ */
export interface PayListenIn {
  order_id: number; // 订单ID
  attach: string; // 业务附加标识
}

/** ------ [支付监听响应] ------ */
export interface PayListenResponse {
  status: number; // 支付状态
  message: string; // 状态说明
}

/** ------ [发起支付入参] ------ */
export interface PrepayIn {
  order_id: number; // 订单ID
  pay_way: number; // 支付方式
  attach: string; // 业务附加标识
  redirect_url?: string; // 支付完成跳转地址（可选）
}