<template>
	<NuxtLayout name="default">
		<template #container>
			<div
				class="w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
				<div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
					<!-- 面包屑导航 -->
					<nav
						class="mb-6 hidden sm:block"
						aria-label="breadcrumb">
						<ol class="flex items-center gap-2 text-sm">
							<li>
								<NuxtLink
									to="/"
									class="text-slate-500 hover:text-indigo-600 transition-colors duration-200">
									首页
								</NuxtLink>
							</li>
							<li class="text-slate-400">/</li>
							<li>
								<NuxtLink
									to="/commodity"
									class="text-slate-500 hover:text-indigo-600 transition-colors duration-200">
									商品列表
								</NuxtLink>
							</li>
							<li class="text-slate-400">/</li>
							<li class="text-indigo-600 font-medium">
								订单结算
							</li>
						</ol>
					</nav>

					<!-- 移动端顶部标题 -->
					<div
						class="flex items-center justify-between mb-4 sm:hidden">
						<button
							type="button"
							class="text-slate-600 dark:text-slate-300"
							@click="handleGoBack">
							<Icon name="fa-solid fa-arrow-left" />
						</button>
						<h1
							class="text-lg font-bold text-slate-900 dark:text-white">
							订单结算
						</h1>
						<div class="w-6"></div>
						<!-- 占位 -->
					</div>

					<!-- 订单结算主体 -->
					<article
						class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 mb-20 sm:mb-0">
						<div class="p-4 sm:p-6 lg:p-8">
							<!-- 页面标题 (桌面端) -->
							<div
								class="hidden sm:flex items-center justify-between mb-6">
								<h1
									class="text-2xl font-bold text-slate-900 dark:text-white">
									订单结算
								</h1>
							</div>

							<!-- 订单信息 -->
							<div
								v-if="orderDetail && !isLoading"
								class="space-y-6">
								<!-- 收货地址 -->
								<section
									class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
									<div
										class="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-location-dot"
												class="text-indigo-600 dark:text-indigo-400" />
											<h2
												class="text-base font-bold text-slate-900 dark:text-white">
												收货地址
											</h2>
										</div>
									</div>
									<div class="p-4 bg-white dark:bg-slate-800">
										<div
											class="flex items-start justify-between gap-4">
											<div class="flex-1 min-w-0">
												<div
													class="flex items-center gap-3 mb-2">
													<p
														class="font-bold text-slate-900 dark:text-white">
														{{
															orderDetail.receiver_name
														}}
													</p>
													<p
														class="text-slate-600 dark:text-slate-400">
														{{
															orderDetail.receiver_phone
														}}
													</p>
												</div>
												<p
													class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
													{{
														orderDetail.receiver_address
													}}
												</p>
											</div>
										</div>
									</div>
								</section>

								<!-- 订单商品列表 -->
								<section
									class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
									<div
										class="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
										<div
											class="flex items-center justify-between">
											<div
												class="flex items-center gap-2">
												<Icon
													name="fa-solid fa-shopping-bag"
													class="text-indigo-600 dark:text-indigo-400" />
												<h2
													class="text-base font-bold text-slate-900 dark:text-white">
													订单商品
												</h2>
											</div>
											<span
												class="text-sm text-slate-500 dark:text-slate-400"
												>共
												{{
													orderDetail.goods_list
														.length
												}}
												件</span
											>
										</div>
									</div>

									<div
										class="divide-y divide-slate-100 dark:divide-slate-700">
										<div
											v-for="(
												item, index
											) in orderDetail.goods_list"
											:key="index"
											class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200">
											<div class="flex gap-4">
												<!-- 商品图片 -->
												<div
													class="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
													<el-image
														:src="
															item.image?.[0] ||
															`/static/default/images/no-img.png`
														"
														:alt="item.title"
														fit="cover"
														class="w-full h-full"
														lazy>
														<template #error>
															<div
																class="w-full h-full flex items-center justify-center text-slate-400">
																<Icon
																	name="fa-solid fa-image"
																	class="text-2xl" />
															</div>
														</template>
													</el-image>
												</div>

												<!-- 商品信息 -->
												<div
													class="flex-1 min-w-0 flex flex-col justify-between">
													<h3
														class="text-slate-900 dark:text-white font-medium mb-2 line-clamp-2 text-sm sm:text-base"
														:title="item.title">
														{{ item.title }}
													</h3>
													<div
														class="flex items-end justify-between">
														<div
															class="flex flex-col gap-1">
															<span
																class="text-red-500 font-bold text-lg"
																>¥{{
																	formatPrice(
																		item.price
																	)
																}}</span
															>
															<span
																class="text-slate-400 text-xs"
																>x{{
																	item.quantity
																}}</span
															>
														</div>
														<div class="text-right">
															<p
																class="text-xs text-slate-500 dark:text-slate-400 mb-1">
																小计
															</p>
															<p
																class="text-red-500 font-bold">
																¥{{
																	formatPrice(
																		item.price *
																			item.quantity
																	)
																}}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>

								<!-- 支付方式 -->
								<section
									v-if="payWays.length > 0"
									class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
									<div
										class="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-credit-card"
												class="text-indigo-600 dark:text-indigo-400" />
											<h2
												class="text-base font-bold text-slate-900 dark:text-white">
												支付方式
											</h2>
										</div>
									</div>

									<div class="p-4 bg-white dark:bg-slate-800">
										<div
											class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div
												v-for="(
													payWay, index
												) in payWays"
												:key="index"
												class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
												:class="{
													'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm':
														selectedPayWay ===
														payWay.channel,
													'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-700/50':
														selectedPayWay !==
														payWay.channel,
												}"
												@click="
													selectedPayWay =
														payWay.channel
												">
												<!-- 选中标记 -->
												<div
													v-if="
														selectedPayWay ===
														payWay.channel
													"
													class="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-indigo-500 border-l-transparent rounded-tr-xl">
													<Icon
														name="fa-solid fa-check"
														class="absolute -top-6 -right-0.5 text-white text-xs" />
												</div>

												<!-- 支付图标 -->
												<div
													class="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm flex-shrink-0 p-1">
													<el-image
														:src="
															payWay.icon ||
															`/default-pay-icon.png`
														"
														:alt="payWay.shorter"
														fit="contain"
														class="w-full h-full">
														<template #error>
															<Icon
																name="fa-solid fa-wallet"
																class="text-slate-400 text-xl" />
														</template>
													</el-image>
												</div>

												<!-- 支付方式名称 -->
												<div class="ml-3 flex-1">
													<p
														class="text-slate-900 dark:text-white font-bold text-sm">
														{{ payWay.shorter }}
													</p>
													<p
														class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
														安全快捷支付
													</p>
												</div>
											</div>
										</div>
									</div>
								</section>

								<!-- 订单备注 -->
								<section
									v-if="orderDetail.remark"
									class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
									<div
										class="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-comment"
												class="text-indigo-600 dark:text-indigo-400" />
											<h2
												class="text-base font-bold text-slate-900 dark:text-white">
												订单备注
											</h2>
										</div>
									</div>
									<div class="p-4 bg-white dark:bg-slate-800">
										<p
											class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
											{{ orderDetail.remark || "无备注" }}
										</p>
									</div>
								</section>

								<!-- 订单金额 -->
								<section
									class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
									<div
										class="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-calculator"
												class="text-indigo-600 dark:text-indigo-400" />
											<h2
												class="text-base font-bold text-slate-900 dark:text-white">
												费用明细
											</h2>
										</div>
									</div>
									<div
										class="p-4 bg-white dark:bg-slate-800 space-y-3">
										<div
											class="flex justify-between items-center py-1">
											<span
												class="text-slate-600 dark:text-slate-400 text-sm"
												>商品总价</span
											>
											<span
												class="text-slate-900 dark:text-white font-medium"
												>¥{{
													formatPrice(
														orderDetail.total_amount
													)
												}}</span
											>
										</div>
										<div
											class="flex justify-between items-center py-1">
											<span
												class="text-slate-600 dark:text-slate-400 text-sm"
												>优惠金额</span
											>
											<span
												class="text-green-600 font-medium"
												>-¥{{
													formatPrice(
														orderDetail.discount_amount ||
															0
													)
												}}</span
											>
										</div>
										<div
											class="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between items-center">
											<span
												class="text-slate-900 dark:text-white font-bold text-lg"
												>实付金额</span
											>
											<span
												class="text-red-500 font-extrabold text-2xl"
												>¥{{
													formatPrice(
														orderDetail.actual_pay_amount
													)
												}}</span
											>
										</div>
									</div>
								</section>
							</div>

							<!-- 加载状态 -->
							<div
								v-else-if="isLoading"
								class="py-20 text-center">
								<div
									class="inline-flex flex-col items-center gap-4">
									<div class="relative w-12 h-12">
										<div
											class="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
										<div
											class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
									</div>
									<p
										class="text-slate-500 dark:text-slate-400 font-medium text-sm">
										加载订单信息中...
									</p>
								</div>
							</div>

							<!-- 订单不存在 -->
							<div
								v-else
								class="py-20 text-center">
								<div
									class="inline-flex flex-col items-center gap-4">
									<div
										class="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
										<Icon
											name="fa-solid fa-circle-exclamation"
											class="text-4xl text-amber-500" />
									</div>
									<div>
										<p
											class="text-slate-900 dark:text-white font-bold text-lg mb-1">
											订单不存在
										</p>
										<p
											class="text-slate-500 dark:text-slate-400 text-sm">
											订单可能已失效或被删除
										</p>
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
				<div
					class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-safe">
					<div class="max-w-[1200px] mx-auto px-4 py-3">
						<div class="flex items-center justify-between gap-4">
							<!-- 价格信息 -->
							<div
								class="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
								<span
									class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm"
									>实付金额：</span
								>
								<div class="flex items-baseline gap-1">
									<span
										class="text-red-500 font-bold text-xl sm:text-2xl">
										¥{{
											orderDetail
												? formatPrice(
														orderDetail.actual_pay_amount
												  )
												: "0.00"
										}}
									</span>
								</div>
							</div>

							<!-- 支付按钮 -->
							<button
								type="button"
								class="px-6 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 transition-all duration-200 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
								:disabled="
									!orderDetail ||
									isPayLoading ||
									!selectedPayWay
								"
								@click="handlePay">
								<Icon
									v-if="isPayLoading"
									name="fa-solid fa-spinner"
									class="animate-spin" />
								<span>{{
									isPayLoading ? "支付中..." : "确认支付"
								}}</span>
							</button>
						</div>

						<!-- 支付提示 -->
						<div
							v-if="!selectedPayWay && orderDetail"
							class="mt-2 text-center">
							<p
								class="text-amber-600 dark:text-amber-400 text-xs">
								<Icon
									name="fa-solid fa-circle-info"
									class="mr-1" />
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
	import Icon from "~/components/Icon/index.vue";
	import orderApi from "~/api/order";
	import paymentApi from "~/api/payment";
	import { ElMessage } from "element-plus";
	import type { OrderDetailResponse } from "~/api/order/types";

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
		return (route.query.order_sn as string) || "";
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
				ElMessage.error("订单不存在或已失效");
			}
		} catch (error) {
			ElMessage.error("获取订单信息失败");
			console.error("获取订单信息失败:", error);
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
			console.error("获取支付方式失败:", error);
		}
	};

	/**
	 * 处理支付
	 */
	const handlePay = async () => {
		if (!orderDetail.value) {
			ElMessage.warning("订单信息无效");
			return;
		}

		if (!selectedPayWay.value) {
			ElMessage.warning("请选择支付方式");
			return;
		}

		try {
			isPayLoading.value = true;
			const result = await paymentApi.prepay({
				order_id: orderDetail.value.id,
				pay_way: selectedPayWay.value,
				attach: "order_checkout",
				redirect_url: "/user/orders",
			});

			ElMessage.success("支付请求已发送");
			console.log("支付结果:", result);

			// 延迟跳转，让用户看到成功提示
			setTimeout(() => {
				router.push("/user/orders");
			}, 1000);
		} catch (error) {
			ElMessage.error("发起支付失败");
			console.error("发起支付失败:", error);
		} finally {
			isPayLoading.value = false;
		}
	};

	/**
	 * 选择地址
	 */
	const handleSelectAddress = () => {
		// 跳转到地址选择页面，并携带当前订单ID
		ElMessage.info("地址选择功能待实现");
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
	useSeoMeta({
		title: "订单结算",
	});
</script>

<style scoped>
	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 文字截断 */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
