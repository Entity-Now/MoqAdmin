// 订单相关类型定义

/** ------ [创建订单请求] ------ */
export interface CreateOrderRequest {
  commodity_id?: number; // 商品ID（非购物车下单时必填）
  quantity?: number; // 购买数量（非购物车下单时必填）
  sku?: Record<string, any> | null; // 规格信息
  address_id?: number; // 收货地址ID
  is_from_cart: boolean; // 是否来自购物车
  cart_ids?: number[]; // 购物车项ID列表（购物车下单时必填）
  remark?: string; // 备注
}

/** ------ [订单商品项] ------ */
export interface OrderGoodsItem {
  sub_order_id: number; // 子订单ID
  commodity_id: number; // 商品ID
  title: string; // 商品标题
  image: string; // 商品图片
  price: number; // 商品价格
  fee: any; // 运费
  quantity: number; // 购买数量
  sku: any; // 规格信息
  delivery_type: number; // 配送类型
  delivery_status: number; // 配送状态
  logistics_company: string; // 物流公司
  logistics_no: string; // 物流单号
}

/** ------ [订单创建响应] ------ */
export interface OrderCreateResponse {
  order_id: number; // 订单ID
  order_sn: string; // 订单编号
  total_amount: number; // 订单总金额
  actual_pay_amount: number; // 实际支付金额
}

/** ------ [订单详情响应] ------ */
export interface OrderDetailResponse {
  id: number; // 订单ID
  order_sn: string; // 订单编号
  total_amount: number; // 订单总金额
  discount_amount: number; // 优惠金额
  actual_pay_amount: number; // 实际支付金额
  pay_status: number; // 支付状态
  pay_way: number; // 支付方式
  pay_time?: string; // 支付时间
  delivery_time?: string; // 发货时间
  receiver_name: string; // 收货人姓名
  receiver_phone: string; // 收货人电话
  receiver_address: string; // 收货人地址
  remark: string; // 备注
  create_time: string; // 创建时间
  goods_list: OrderGoodsItem[]; // 商品列表
}

/** ------ [订单列表项] ------ */
export interface OrderListVo {
  id: number; // 订单ID
  order_sn: string; // 订单编号
  total_amount: number; // 订单总金额
  actual_pay_amount: number; // 实际支付金额
  pay_status: number; // 支付状态
  pay_way: number; // 支付方式
  create_time: string; // 创建时间
  total_goods: number; // 商品总数
  goods_list: OrderGoodsItem[]; // 商品列表
}

/** ------ [订单列表响应] ------ */
export interface OrderListResponse {
  lists: OrderListVo[]; // 订单列表
  total: number; // 总条数
  page: number; // 当前页
  size: number; // 每页数量
}

/** ------ [订单操作结果] ------ */
export interface OrderOperationResponse {
  code: number; // 状态码
  msg: string; // 信息
}