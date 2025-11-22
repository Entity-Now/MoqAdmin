import request from "@/utils/request";

// 订单搜索参数接口
export interface OrderSearchIn {
	page_no: number; // 当前页码，默认1
	page_size: number; // 每页条数，默认15
	user?: string | null; // 用户信息(用户ID、昵称、手机号)
	order_sn?: string | null; // 订单编号
	pay_way?: string | number | null; // 支付方式: [2=微信, 3=支付宝]
	pay_status?: string | number | null; // 支付状态: [0=未支付, 1=已支付, 2=已取消]
	start_time?: number | string | null; // 开始时间
	end_time?: number | string | null; // 结束时间
}

// 订单商品项接口
export interface OrderGoodsItem {
	sub_order_id: number; // 子订单ID
	commodity_id: number; // 商品ID
	title: string; // 商品标题
	image: string[]; // 商品图片
	price: number; // 商品价格
	fee?: number; // 商品运费
	quantity: number; // 购买数量
	sku?: Record<string, any> | null; // 规格信息
	delivery_type: number; // 配送方式: [1=到店自提, 2=配送]
	delivery_status: number; // 配送状态: [0=未发货, 1=待配送, 2=配送中, 3=已配送]
	logistics_company?: string | null; // 物流公司
	logistics_no?: string | null; // 物流单号
	status?: number; // 售后状态: [0=无, 1=申请售后, 2=同意退货, 3=退货成功, 4=拒绝退货]
	work_order_id?: number; // 售后工单ID
}

// 订单列表项接口
export interface OrderListVo {
	id: number; // 订单ID
	user_id: number; // 用户ID
	user_account: string; // 用户昵称
	order_sn: string; // 订单编号
	total_amount: number; // 订单总金额
	actual_pay_amount: number; // 实际支付金额
	order_type: number; // 订单类型: [1=充值订单, 2=商品订单， 3=购买会员]
	pay_status: number; // 支付状态: [0=未支付, 1=已支付, 2=已取消]
	pay_time: string; // 支付时间
	create_time: string; // 创建时间
	receiver_name: string; // 收货人姓名
	receiver_phone: string; // 收货人手机号
	receiver_address: string; // 收货地址
	remark: string; // 订单备注
	goods_list: OrderGoodsItem[]; // 商品列表
}

// 分页结果接口
export interface PagingResult<T> {
	current_page: number; // 当前页码
	last_page: number; // 最后页码
	per_page: number; // 每页数量
	total: number; // 总数量
	extend?: Record<string, any>; // 扩展数据
	lists: T[]; // 数据列表
}

const orderApi = {
	/**
	 * 订单列表
	 */
	lists(params: OrderSearchIn): Promise<PagingResult<OrderListVo>> {
		return request.get({
			url: "/finance/order/lists",
			params,
		});
	},
	/**
	 * 发货订单
	 */
	deliveryOrder(
		sub_order_id: number,
		logistics_company: string,
		logistics_no: string
	): Promise<void> {
		return request.post({
			url: "/finance/order/delivery",
			data: {},
			params: {
				sub_order_id,
				logistics_company,
				logistics_no,
			},
		});
	},
	/**
	 * 处理售后
	 */
	handleAfterSales(params: WorkOrderHandleIn): Promise<void> {
		return request.post({
			url: "/finance/order/after_sales/handle",
			data: params,
		});
	},
};

// 售后处理参数接口
export interface WorkOrderHandleIn {
	work_order_id: number; // 售后工单ID
	action: "agree" | "refuse" | "confirm"; // 操作类型: agree=同意, refuse=拒绝, confirm=确认退货
	refuse_reason?: string | null; // 拒绝原因
}

export default orderApi;
