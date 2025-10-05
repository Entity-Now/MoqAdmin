<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full min-h-screen bg-gray-50 ">
				<div class="max-w-[1200px] mx-auto px-4 py-6">
					<!-- 面包屑导航 -->
					<nav class="mb-6" aria-label="breadcrumb">
						<ol class="flex items-center gap-2 text-sm">
							<li>
								<NuxtLink
									to="/"
									class="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
									首页
								</NuxtLink>
							</li>
							<li class="text-gray-400">/</li>
							<li>
								<NuxtLink
									to="/commodity"
									class="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
									商品列表
								</NuxtLink>
							</li>
							<li class="text-gray-400">/</li>
							<li class="text-indigo-600 font-medium">订单结算</li>
						</ol>
					</nav>

					<!-- 订单结算主体 -->
					<article class="bg-white rounded-xl shadow-sm overflow-hidden">
						<div class="p-4 sm:p-6 lg:p-8">
							<!-- 页面标题 -->
							<div class="flex items-center justify-between mb-6">
								<h1 class="text-xl sm:text-2xl font-bold text-gray-900">订单结算</h1>
								<button
									type="button"
									class="text-gray-500 hover:text-gray-700 transition-colors"
									@click="handleGoBack">
									<Icon name="fa-solid fa-arrow-left" class="mr-2" />
									<span class="hidden sm:inline">返回</span>
								</button>
							</div>

							<!-- 订单信息 -->
							<div v-if="orderDetail && !isLoading" class="space-y-6">
								<!-- 收货地址 -->
								<section class="border border-gray-200 rounded-xl overflow-hidden">
									<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
										<div class="flex items-center gap-2">
											<Icon name="fa-solid fa-location-dot" class="text-indigo-600" />
											<h2 class="text-base font-semibold text-gray-900">收货地址</h2>
										</div>
									</div>
									<div class="p-4 bg-white">
										<div class="flex items-start justify-between gap-4">
											<div class="flex-1 min-w-0">
												<div class="flex items-center gap-3 mb-2">
													<p class="font-semibold text-gray-900">{{ orderDetail.receiver_name }}</p>
													<p class="text-gray-600">{{ orderDetail.receiver_phone }}</p>
												</div>
												<p class="text-gray-600 text-sm leading-relaxed">{{ orderDetail.receiver_address }}</p>
											</div>
											<!-- <button
												type="button"
												class="flex-shrink-0 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
												@click="handleSelectAddress">
												修改
											</button> -->
										</div>
									</div>
								</section>

								<!-- 订单商品列表 -->
								<section class="border border-gray-200 rounded-xl overflow-hidden">
									<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<Icon name="fa-solid fa-shopping-bag" class="text-indigo-600" />
												<h2 class="text-base font-semibold text-gray-900">订单商品</h2>
											</div>
											<span class="text-sm text-gray-500">共 {{ orderDetail.goods_list.length }} 件</span>
										</div>
									</div>

									<div class="divide-y divide-gray-100">
										<div
											v-for="(item, index) in orderDetail.goods_list"
											:key="index"
											class="p-4 hover:bg-gray-50 transition-colors duration-200">
											<div class="flex gap-4">
												<!-- 商品图片 -->
												<div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
													<el-image
														:src="item.image?.[0] || `/static/default/images/no-img.png`"
														:alt="item.title"	
														fit="cover"
														class="w-full h-full"
														lazy>
														<template #error>
															<div class="w-full h-full flex items-center justify-center bg-gray-100">
																<Icon name="fa-solid fa-image" class="text-gray-400 text-2xl" />
															</div>
														</template>
													</el-image>
												</div>

												<!-- 商品信息 -->
												<div class="flex-1 min-w-0">
													<h3 class="text-gray-900 font-medium mb-2 line-clamp-2 text-sm sm:text-base" :title="item.title">
														{{ item.title }}
													</h3>
													<div class="flex items-end justify-between mt-auto">
														<div class="flex flex-col gap-1">
															<span class="text-red-500 font-bold text-lg">¥{{ formatPrice(item.price) }}</span>
															<span class="text-gray-400 text-xs">x{{ item.quantity }}</span>
														</div>
														<div class="text-right">
															<p class="text-xs text-gray-500 mb-1">小计</p>
															<p class="text-red-500 font-semibold">¥{{ formatPrice(item.price * item.quantity) }}</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>

								<!-- 支付方式 -->
								<section v-if="payWays.length > 0" class="border border-gray-200 rounded-xl overflow-hidden">
									<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
										<div class="flex items-center gap-2">
											<Icon name="fa-solid fa-credit-card" class="text-indigo-600" />
											<h2 class="text-base font-semibold text-gray-900">支付方式</h2>
										</div>
									</div>

									<div class="p-4 bg-white">
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div
												v-for="(payWay, index) in payWays"
												:key="index"
												class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
												:class="{
													'border-indigo-500 bg-indigo-50 shadow-sm': selectedPayWay === payWay.channel,
													'border-gray-200 hover:border-indigo-300 hover:bg-gray-50': selectedPayWay !== payWay.channel
												}"
												@click="selectedPayWay = payWay.channel">
												<!-- 选中标记 -->
												<div
													v-if="selectedPayWay === payWay.channel"
													class="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-indigo-500 border-l-transparent rounded-tr-xl">
													<Icon
														name="fa-solid fa-check"
														class="absolute -top-6 -right-0.5 text-white text-xs" />
												</div>

												<!-- 支付图标 -->
												<div class="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm flex-shrink-0">
													<el-image
														:src="payWay.icon || `/default-pay-icon.png`"
														:alt="payWay.shorter"
														fit="contain"
														class="w-10 h-10">
														<template #error>
															<Icon name="fa-solid fa-wallet" class="text-gray-400 text-xl" />
														</template>
													</el-image>
												</div>

												<!-- 支付方式名称 -->
												<div class="ml-3 flex-1">
													<p class="text-gray-900 font-semibold">{{ payWay.shorter }}</p>
													<p class="text-xs text-gray-500 mt-0.5">安全快捷支付</p>
												</div>
											</div>
										</div>
									</div>
								</section>

								<!-- 订单备注 -->
								<section v-if="orderDetail.remark" class="border border-gray-200 rounded-xl overflow-hidden">
									<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
										<div class="flex items-center gap-2">
											<Icon name="fa-solid fa-comment" class="text-indigo-600" />
											<h2 class="text-base font-semibold text-gray-900">订单备注</h2>
										</div>
									</div>
									<div class="p-4 bg-white">
										<p class="text-gray-600 text-sm leading-relaxed">{{ orderDetail.remark || '无备注' }}</p>
									</div>
								</section>

								<!-- 订单金额 -->
								<section class="border border-gray-200 rounded-xl overflow-hidden">
									<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
										<div class="flex items-center gap-2">
											<Icon name="fa-solid fa-calculator" class="text-indigo-600" />
											<h2 class="text-base font-semibold text-gray-900">费用明细</h2>
										</div>
									</div>
									<div class="p-4 bg-white space-y-3">
										<div class="flex justify-between items-center py-2">
											<span class="text-gray-600">商品总价</span>
											<span class="text-gray-900 font-medium">¥{{ formatPrice(orderDetail.total_amount) }}</span>
										</div>
										<div class="flex justify-between items-center py-2">
											<span class="text-gray-600">优惠金额</span>
											<span class="text-green-600 font-medium">-¥{{ formatPrice(orderDetail.discount_amount || 0) }}</span>
										</div>
										<div class="border-t border-gray-200 pt-3 flex justify-between items-center">
											<span class="text-gray-900 font-semibold text-lg">实付金额</span>
											<span class="text-red-500 font-bold text-2xl">¥{{ formatPrice(orderDetail.actual_pay_amount) }}</span>
										</div>
									</div>
								</section>
							</div>

							<!-- 加载状态 -->
							<div v-else-if="isLoading" class="py-20 text-center">
								<div class="inline-flex flex-col items-center gap-4">
									<div class="relative w-16 h-16">
										<div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
										<div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
									</div>
									<p class="text-gray-500 font-medium">加载订单信息中...</p>
								</div>
							</div>

							<!-- 订单不存在 -->
							<div v-else class="py-20 text-center">
								<div class="inline-flex flex-col items-center gap-4">
									<div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
										<Icon name="fa-solid fa-circle-exclamation" class="text-4xl text-amber-500" />
									</div>
									<div>
										<p class="text-gray-900 font-semibold text-lg mb-1">订单不存在</p>
										<p class="text-gray-500 text-sm">订单可能已失效或被删除</p>
									</div>
									<button
										type="button"
										class="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
										@click="handleGoBack">
										返回上一页
									</button>
								</div>
							</div>
						</div>
					</article>
				</div>

				<!-- 底部操作栏 -->
				<div class="position bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
					<div class="max-w-[1200px] mx-auto px-4 py-3">
						<div class="flex items-center justify-between gap-4">
							<!-- 价格信息 -->
							<div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
								<span class="text-gray-600 text-sm">实付金额：</span>
								<div class="flex items-baseline gap-1">
									<span class="text-red-500 font-bold text-xl sm:text-2xl">
										¥{{ orderDetail ? formatPrice(orderDetail.actual_pay_amount) : '0.00' }}
									</span>
								</div>
							</div>

							<!-- 支付按钮 -->
							<button
								type="button"
								class="px-6 sm:px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center gap-2"
								:disabled="!orderDetail || isPayLoading || !selectedPayWay"
								@click="handlePay">
								<Icon
									v-if="isPayLoading"
									name="fa-solid fa-spinner"
									class="animate-spin" />
								<span>{{ isPayLoading ? '支付中...' : '确认支付' }}</span>
							</button>
						</div>

						<!-- 支付提示 -->
						<div v-if="!selectedPayWay && orderDetail" class="mt-2 text-center">
							<p class="text-amber-600 text-xs">
								<Icon name="fa-solid fa-circle-info" class="mr-1" />
								请选择支付方式
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon/index.vue';
import orderApi from '~/api/order';
import paymentApi from '~/api/payment';
import { ElMessage } from 'element-plus';
import type { OrderDetailResponse } from '~/api/order/types';

// 定义支付方式类型
interface PayWayResponse {
	channel: number;
	shorter: string;
	icon?: string;
}

// ==================== 路由相关 ====================
const router = useRouter();
const route = useRoute();
const orderId = computed(() => {
	const id = Number(route.query.order_id);
	return isNaN(id) ? 0 : id;
});
const orderSn = computed(() => {
	return (route.query.order_sn as string) || '';
});

// ==================== 响应式状态 ====================
const isLoading = ref(true);
const isPayLoading = ref(false);
const orderDetail = ref<OrderDetailResponse | null>(null);
const payWays = ref<PayWayResponse[]>([]);
const selectedPayWay = ref<number>(0);

// ==================== 方法 ====================
/**
 * 格式化价格
 */
const formatPrice = (price: number): string => {
	return price.toFixed(2);
};

/**
 * 获取订单详情
 */
const getOrderDetail = async () => {
	try {
		isLoading.value = true;
		let detail: OrderDetailResponse | null = null;

		// 优先使用orderId查询
		if (orderId.value > 0) {
			const res = await orderApi.detail(orderId.value);
			detail = res;
		}

		if (detail) {
			orderDetail.value = detail;
		} else {
			ElMessage.error('订单不存在或已失效');
		}
	} catch (error) {
		ElMessage.error('获取订单信息失败');
		console.error('获取订单信息失败:', error);
	} finally {
		isLoading.value = false;
	}
};

/**
 * 获取支付方式
 */
const getPayWays = async () => {
	try {
		const res = await paymentApi.payWay();
		// 根据实际返回数据结构调整
		payWays.value = Array.isArray(res) ? res : [res];
		
		// 默认选择第一个支付方式
		if (payWays.value.length > 0) {
			selectedPayWay.value = payWays.value[0].channel;
		}
	} catch (error) {
		console.error('获取支付方式失败:', error);
	}
};

/**
 * 处理支付
 */
const handlePay = async () => {
	if (!orderDetail.value) {
		ElMessage.warning('订单信息无效');
		return;
	}

	if (!selectedPayWay.value) {
		ElMessage.warning('请选择支付方式');
		return;
	}

	try {
		isPayLoading.value = true;
		const result = await paymentApi.prepay({
			order_id: orderDetail.value.id,
			pay_way: selectedPayWay.value,
			attach: 'order_checkout',
			redirect_url: '/user/orders'
		});

		ElMessage.success('支付请求已发送');
		console.log('支付结果:', result);

		// 延迟跳转，让用户看到成功提示
		setTimeout(() => {
			router.push('/user/orders');
		}, 1000);
	} catch (error) {
		ElMessage.error('发起支付失败');
		console.error('发起支付失败:', error);
	} finally {
		isPayLoading.value = false;
	}
};

/**
 * 选择地址
 */
const handleSelectAddress = () => {
	// 跳转到地址选择页面，并携带当前订单ID
	ElMessage.info('地址选择功能待实现');
	// router.push(`/user/address/select?order_id=${orderId.value}`);
};

/**
 * 返回上一页
 */
const handleGoBack = () => {
	router.back();
};

// ==================== 生命周期 ====================
// 页面加载时获取订单信息和支付方式
onMounted(async () => {
	// 并行获取订单详情和支付方式
	await Promise.all([getOrderDetail(), getPayWays()]);
});

// 页面标题
useHead({
	title: '订单结算'
});
</script>

<style scoped>
/* 动画优化 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

section {
	animation: fadeIn 0.3s ease-out;
}

/* 确保底部有足够的空间 */
.pb-24 {
	padding-bottom: 6rem;
}

/* 移动端优化 */
@media (max-width: 640px) {
	.pb-24 {
		padding-bottom: 7rem;
	}
}

/* 文字截断 */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>