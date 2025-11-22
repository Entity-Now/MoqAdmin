<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<!-- 搜索栏 -->
		<el-card
			class="!border-none mb-4 shadow-sm"
			shadow="never">
			<el-form
				class="mb-[-16px]"
				:model="queryParams"
				:inline="true">
				<el-form-item label="用户信息">
					<el-input
						v-model="queryParams.user"
						class="w-[250px]"
						placeholder="请输入用户编号/昵称/手机号"
						clearable
						@keyup.enter="resetPaging" />
				</el-form-item>
				<el-form-item label="订单编号">
					<el-input
						v-model="queryParams.order_sn"
						class="w-[250px]"
						placeholder="请输入订单编号"
						clearable
						@keyup.enter="resetPaging" />
				</el-form-item>
				<el-form-item label="支付方式">
					<el-select
						v-model="queryParams.pay_way"
						class="w-[250px]"
						placeholder="请选择">
						<el-option
							value=""
							label="全部" />
						<el-option
							v-for="(value, key) in pager.extend?.payWay"
							:key="key"
							:label="value"
							:value="key" />
					</el-select>
				</el-form-item>
				<el-form-item label="支付状态">
					<el-select
						v-model="queryParams.pay_status"
						class="w-[250px]"
						placeholder="请选择">
						<el-option
							value=""
							label="全部" />
						<el-option
							v-for="(value, key) in pager.extend?.payStatus"
							:key="key"
							:label="value"
							:value="key" />
					</el-select>
				</el-form-item>
				<el-form-item label="下单时间">
					<date-picker
						v-model:startTime="queryParams.start_time"
						v-model:endTime="queryParams.end_time" />
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="resetPaging"
						>查询</el-button
					>
					<el-button @click="resetParams">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 订单列表卡片 -->
		<div
			v-loading="pager.loading"
			class="space-y-4">
			<div
				v-for="order in pager.lists"
				:key="order.id"
				class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
				<!-- 订单头部 -->
				<div class="bg-gray-100 border-b border-gray-200 px-6 py-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-6">
							<div class="flex items-center space-x-3">
								<span class="text-sm text-gray-500"
									>订单号:</span
								>
								<span
									class="text-sm font-medium text-gray-900"
									>{{ order.order_sn }}</span
								>
							</div>
							<div class="flex items-center space-x-3">
								<span class="text-sm text-gray-500">用户:</span>
								<span class="text-sm text-gray-900">{{
									order.user_account
								}}</span>
							</div>
							<div class="flex items-center space-x-3">
								<span class="text-sm text-gray-500"
									>下单时间:</span
								>
								<span class="text-sm text-gray-900">{{
									order.create_time
								}}</span>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<el-tag
								:type="getOrderTypeTagType(order.order_type)"
								size="small">
								{{ getOrderTypeLabel(order.order_type) }}
							</el-tag>
							<el-tag
								:type="getPayStatusTagType(order.pay_status)"
								size="small">
								{{ getPayStatusLabel(order.pay_status) }}
							</el-tag>
						</div>
					</div>
				</div>

				<!-- 订单商品列表 -->
				<div class="px-6 py-4">
					<div
						v-for="(goods, index) in order.goods_list"
						:key="goods.sub_order_id"
						:class="[
							'flex items-start space-x-4',
							index > 0
								? 'mt-4 pt-4 border-t border-gray-100'
								: '',
						]">
						<!-- 商品图片 -->
						<div class="flex-shrink-0">
							<el-image
								:src="goods.image[0]"
								class="w-20 h-20 rounded-lg object-cover"
								fit="cover">
								<template #error>
									<div
										class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg">
										<span class="text-gray-400 text-xs"
											>暂无图片</span
										>
									</div>
								</template>
							</el-image>
						</div>

						<!-- 商品信息 -->
						<div class="flex-1 min-w-0">
							<h3 class="text-sm font-medium text-gray-900 mb-2">
								{{ goods.title }}
							</h3>
							<div
								class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
								<span v-if="goods.sku"
									>规格: {{ formatSku(goods.sku) }}</span
								>
								<span>数量: {{ goods.quantity }}</span>
								<span>单价: ¥{{ goods.price }}</span>
								<span v-if="goods.fee"
									>运费: ¥{{ goods.fee }}</span
								>
								<span>
									配送方式:
									<el-tag
										size="small"
										type="info"
										>{{
											getDeliveryTypeLabel(
												goods.delivery_type
											)
										}}</el-tag
									>
								</span>
								<template v-if="order.order_type == 2">
									<span>
										配送状态:
										<el-tag
											size="small"
											:type="
												getDeliveryStatusTagType(
													goods.delivery_status
												)
											">
											{{
												getDeliveryStatusLabel(
													goods.delivery_status
												)
											}}
										</el-tag>
									</span>
									<span v-if="goods.delivery_status == 1">
										<span
											class="text-sm font-medium text-gray-900"
											>快递公司{{
												goods.logistics_company
											}}</span
										>
										<span class="ml-4 text-sm text-gray-900"
											>物流单号{{
												goods.logistics_no
											}}</span
										>
									</span>
									<span v-if="goods.status">
										售后状态:
										<el-tag
											size="small"
											:type="
												getAfterSalesStatusTagType(
													goods.status
												)
											">
											{{
												getAfterSalesStatusLabel(
													goods.status
												)
											}}
										</el-tag>
									</span>
								</template>
							</div>
							<div
								v-if="goods.logistics_company"
								class="mt-2 text-xs text-gray-500">
								<span>物流: {{ goods.logistics_company }}</span>
								<span class="ml-4"
									>单号: {{ goods.logistics_no }}</span
								>
							</div>
						</div>

						<!-- 商品小计 -->
						<div class="flex-shrink-0 text-right">
							<div class="text-sm font-medium text-gray-900">
								¥{{
									(
										goods.price * goods.quantity +
										(goods.fee || 0)
									).toFixed(2)
								}}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								子订单: {{ goods.sub_order_id }}
							</div>
						</div>
						<div class="text-xs text-gray-500 mt-1 space-x-2">
							<el-button
								v-if="
									order.pay_status == 1 &&
									goods.delivery_status == 0
								"
								type="primary"
								size="small"
								@click="() => openDeliverPopup(goods)"
								>发货</el-button
							>
							<el-button
								v-if="goods.status && goods.status !== 3"
								type="warning"
								size="small"
								@click="() => openWorkOrderHandlePopup(goods)"
								>处理售后</el-button
							>
						</div>
					</div>
				</div>

				<!-- 订单底部 -->
				<div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-6 text-sm">
							<div v-if="order.receiver_name">
								<span class="text-gray-500">收货人:</span>
								<span class="ml-2 text-gray-900">{{
									order.receiver_name
								}}</span>
								<span class="ml-2 text-gray-900">{{
									order.receiver_phone
								}}</span>
							</div>
							<div
								v-if="order.receiver_address"
								class="max-w-md truncate">
								<span class="text-gray-500">收货地址:</span>
								<span
									class="ml-2 text-gray-900"
									:title="order.receiver_address"
									>{{ order.receiver_address }}</span
								>
							</div>
							<div v-if="order.remark">
								<span class="text-gray-500">备注:</span>
								<span class="ml-2 text-gray-900">{{
									order.remark
								}}</span>
							</div>
							<div v-if="order.pay_time">
								<span class="text-gray-500">支付时间:</span>
								<span class="ml-2 text-gray-900">{{
									order.pay_time
								}}</span>
							</div>
						</div>
						<div class="text-right">
							<div class="text-xs text-gray-500 mb-1">
								订单总额:
								<span class="line-through"
									>¥{{ order.total_amount }}</span
								>
							</div>
							<div class="text-lg font-semibold text-red-600">
								实付金额: ¥{{ order.actual_pay_amount }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 空状态 -->
			<div
				v-if="!pager.loading && pager.lists.length === 0"
				class="bg-white rounded-lg shadow-sm py-16">
				<div class="text-center text-gray-400">
					<svg
						class="mx-auto h-12 w-12 text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<p class="mt-4 text-sm">暂无订单数据</p>
				</div>
			</div>

			<!-- 分页 -->
			<div
				v-if="pager.lists.length > 0"
				class="flex justify-end mt-4">
				<paging
					v-model="pager"
					@change="queryLists" />
			</div>
		</div>
		<!-- 发货弹窗 -->
		<deliverPopup
			ref="deliverPopupRef"
			@success="queryLists" />
		<!-- 售后处理弹窗 -->
		<workOrderHandlePopup
			ref="workOrderHandlePopupRef"
			@success="queryLists" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";
	import { usePaging } from "@/hooks/usePaging";
	import orderApi from "@/api/finance/order";
	import DatePicker from "@/components/DatePicker/index.vue";
	import deliverPopup from "@/views/finance/deliver/index.vue";
	import workOrderHandlePopup from "@/views/finance/workOrderHandle/index.vue";

	// 发货弹窗引用
	const deliverPopupRef = ref<InstanceType<typeof deliverPopup>>();
	// 售后处理弹窗引用
	const workOrderHandlePopupRef =
		ref<InstanceType<typeof workOrderHandlePopup>>();
	// 查询参数
	const queryParams = reactive({
		user: "",
		order_sn: "",
		pay_way: "",
		pay_status: "",
		start_time: "",
		end_time: "",
	});

	// 分页查询
	const { pager, queryLists, resetParams, resetPaging } = usePaging({
		fetchFun: orderApi.lists,
		params: queryParams,
	});

	// 订单类型标签
	const getOrderTypeLabel = (type: number) => {
		const typeMap: Record<number, string> = {
			1: "充值订单",
			2: "商品订单",
			3: "购买会员",
		};
		return typeMap[type] || "未知";
	};

	const getOrderTypeTagType = (type: number) => {
		const typeMap: Record<number, any> = {
			1: "warning",
			2: "primary",
			3: "success",
		};
		return typeMap[type] || "info";
	};

	// 支付状态标签
	const getPayStatusLabel = (status: number) => {
		const statusMap: Record<number, string> = {
			0: "未支付",
			1: "已支付",
			2: "已取消",
		};
		return statusMap[status] || "未知";
	};

	const getPayStatusTagType = (status: number) => {
		const typeMap: Record<number, any> = {
			0: "warning",
			1: "success",
			2: "info",
		};
		return typeMap[status] || "info";
	};

	// 配送方式标签
	const getDeliveryTypeLabel = (type: number) => {
		const typeMap: Record<number, string> = {
			0: "无需发货",
			1: "自动发卡",
			2: "人工发货",
			3: "物流发货",
		};
		return typeMap[type] || "未知";
	};

	// 配送状态标签
	const getDeliveryStatusLabel = (status: number) => {
		const statusMap: Record<number, string> = {
			0: "待发货",
			1: "已发货",
			2: "已退货",
		};
		return statusMap[status] || "未知";
	};

	const getDeliveryStatusTagType = (status: number) => {
		const typeMap: Record<number, any> = {
			0: "info",
			1: "warning",
			2: "primary",
			3: "success",
		};
		return typeMap[status] || "info";
	};

	// 格式化SKU
	const formatSku = (sku: Record<string, any>) => {
		if (!sku) return "-";
		return Object.entries(sku)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ");
	};

	// open 发货弹窗
	const openDeliverPopup = (row?: any) => {
		if (deliverPopupRef.value) {
			deliverPopupRef.value.open(row);
		}
	};

	// open 售后处理弹窗
	const openWorkOrderHandlePopup = (row?: any) => {
		if (workOrderHandlePopupRef.value) {
			// TODO: 这里需要从后端获取work_order_id，暂时使用sub_order_id
			workOrderHandlePopupRef.value.open({
				work_order_id: row?.work_order_id || 0,
				sub_order_id: row?.sub_order_id,
			});
		}
	};

	// 售后状态标签
	const getAfterSalesStatusLabel = (status: number) => {
		const statusMap: Record<number, string> = {
			0: "无",
			1: "申请售后",
			2: "同意退货",
			3: "退货成功",
			4: "拒绝退货",
		};
		return statusMap[status] || "未知";
	};

	const getAfterSalesStatusTagType = (status: number) => {
		const typeMap: Record<number, any> = {
			0: "info",
			1: "warning",
			2: "primary",
			3: "success",
			4: "danger",
		};
		return typeMap[status] || "info";
	};

	onMounted(async () => {
		await queryLists();
	});
</script>

<style scoped>
	/* 自定义滚动条 */
	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
