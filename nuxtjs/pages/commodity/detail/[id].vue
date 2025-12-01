<template>
	<NuxtLayout name="default">
		<template #container>
			<div
				class="w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
				<div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
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
							<li
								class="text-slate-900 dark:text-white font-medium truncate max-w-[200px]"
								:title="detail.title">
								{{ detail.title || "商品详情" }}
							</li>
						</ol>
					</nav>

					<!-- 移动端返回按钮 -->
					<div class="mb-4 sm:hidden">
						<button
							type="button"
							class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"
							@click="handleGoBack">
							<Icon name="fa-solid fa-arrow-left" />
							<span>返回</span>
						</button>
					</div>

					<!-- 商品详情主体 -->
					<article
						class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
						<div
							class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-0 lg:p-8">
							<!-- 左侧：商品图片展示区 -->
							<section
								class="flex flex-col bg-white dark:bg-slate-800">
								<!-- 主图 -->
								<div
									class="relative w-full aspect-square overflow-hidden bg-white dark:bg-slate-800 lg:rounded-xl border-b lg:border border-slate-100 dark:border-slate-600">
									<el-image
										:src="currentImage"
										:alt="detail.title"
										fit="contain"
										class="w-full h-full"
										:preview-src-list="imageList"
										:initial-index="currentImageIndex"
										preview-teleported>
										<template #error>
											<div
												class="h-full flex flex-col items-center justify-center text-slate-400">
												<Icon
													name="fa-solid fa-image"
													class="text-5xl mb-3" />
												<span class="text-sm"
													>图片加载失败</span
												>
											</div>
										</template>
										<template #placeholder>
											<div
												class="h-full flex items-center justify-center">
												<div class="animate-pulse">
													<Icon
														name="fa-solid fa-image"
														class="text-5xl text-slate-300" />
												</div>
											</div>
										</template>
									</el-image>
								</div>

								<!-- 缩略图列表 -->
								<div
									v-if="imageList.length > 1"
									class="flex gap-3 overflow-x-auto p-4 lg:px-0 scrollbar-hide">
									<button
										v-for="(img, index) in imageList"
										:key="index"
										type="button"
										class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800"
										:class="
											currentImageIndex === index
												? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
												: 'border-slate-200 dark:border-slate-600 hover:border-indigo-300'
										"
										@click="handleImageChange(index)">
										<el-image
											:src="img"
											fit="contain"
											class="w-full h-full" />
									</button>
								</div>
							</section>

							<!-- 右侧：商品信息区 -->
							<section class="flex flex-col px-4 pb-6 lg:p-0">
								<div class="flex-1">
									<!-- 商品标题 -->
									<h1
										class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
										{{ detail.title }}
									</h1>

									<!-- 商品标签 -->
									<div
										v-if="hasTags"
										class="flex flex-wrap gap-2 mb-6">
										<span
											v-if="detail.category"
											class="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
											<Icon
												name="fa-solid fa-tag"
												class="mr-1.5 text-[10px]" />
											{{ detail.category }}
										</span>
										<span
											v-if="detail.is_recommend"
											class="inline-flex items-center px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md text-xs font-medium">
											<Icon
												name="fa-solid fa-star"
												class="mr-1.5 text-[10px]" />
											推荐
										</span>
										<span
											v-if="detail.is_topping"
											class="inline-flex items-center px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium">
											<Icon
												name="fa-solid fa-fire"
												class="mr-1.5 text-[10px]" />
											置顶
										</span>
									</div>

									<!-- 商品价格 -->
									<div
										class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 mb-6 border border-slate-100 dark:border-slate-700">
										<div
											class="flex items-center justify-between">
											<div>
												<p
													class="text-xs text-slate-500 dark:text-slate-400 mb-1">
													价格
												</p>
												<div
													class="flex items-baseline gap-1">
													<span
														class="text-red-500 font-bold text-xl"
														>¥</span
													>
													<span
														class="text-red-500 font-extrabold text-4xl tracking-tight">
														{{
															formatPrice(
																detail.price
															)
														}}
													</span>
												</div>
											</div>
											<div
												v-if="detail.stock > 0"
												class="text-right">
												<p
													class="text-xs text-slate-500 dark:text-slate-400 mb-1">
													库存
												</p>
												<p
													class="text-lg font-bold text-slate-900 dark:text-white">
													{{ detail.stock }}
												</p>
											</div>
										</div>
									</div>

									<!-- 商品属性信息 -->
									<div class="grid grid-cols-2 gap-4 mb-8">
										<div
											class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
											<div
												class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
												<Icon
													name="fa-solid fa-shopping-bag"
													class="text-xs" />
											</div>
											<div>
												<p
													class="text-xs text-slate-500 dark:text-slate-400">
													销量
												</p>
												<p
													class="text-sm font-bold text-slate-900 dark:text-white">
													{{ detail.sales }}
												</p>
											</div>
										</div>
										<div
											class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
											<div
												class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
												<Icon
													name="fa-solid fa-eye"
													class="text-xs" />
											</div>
											<div>
												<p
													class="text-xs text-slate-500 dark:text-slate-400">
													浏览
												</p>
												<p
													class="text-sm font-bold text-slate-900 dark:text-white">
													{{ detail.browse }}
												</p>
											</div>
										</div>
										<div
											class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
											<div
												class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
												<Icon
													name="fa-solid fa-truck"
													class="text-xs" />
											</div>
											<div>
												<p
													class="text-xs text-slate-500 dark:text-slate-400">
													发货
												</p>
												<p
													class="text-sm font-bold text-slate-900 dark:text-white">
													{{
														getDeliveryType(
															detail.deliveryType ||
																0
														)
													}}
												</p>
											</div>
										</div>
										<div
											class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
											<div
												class="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500">
												<Icon
													name="fa-solid fa-money-bill"
													class="text-xs" />
											</div>
											<div>
												<p
													class="text-xs text-slate-500 dark:text-slate-400">
													运费
												</p>
												<p
													class="text-sm font-bold text-slate-900 dark:text-white">
													{{
														detail.fee
															? `¥${formatPrice(
																	detail.fee
															  )}`
															: "免运费"
													}}
												</p>
											</div>
										</div>
									</div>

									<!-- 购买选项 -->
									<div class="space-y-6">
										<!-- 数量 -->
										<div
											class="flex items-center justify-between">
											<span
												class="text-sm font-medium text-slate-700 dark:text-slate-300"
												>购买数量</span
											>
											<el-input-number
												v-model="formData.quantity"
												:min="1"
												:max="100"
												size="default" />
										</div>

										<!-- SKU -->
										<div
											v-if="detail.sku"
											class="space-y-2">
											<SKU
												:options="detail.sku"
												v-model="formData.sku" />
										</div>

										<!-- 地址 -->
										<div class="space-y-2">
											<span
												class="text-sm font-medium text-slate-700 dark:text-slate-300"
												>收货地址</span
											>
											<AddressDisplay
												v-model="formData.address" />
										</div>
									</div>

									<!-- 状态提示 -->
									<div
										v-if="isLowStock"
										class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
										<Icon
											name="fa-solid fa-exclamation-triangle"
											class="text-sm" />
										<span class="text-sm font-medium"
											>库存紧张，仅剩
											{{ detail.stock }} 件</span
										>
									</div>

									<div
										v-if="isOutOfStock"
										class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
										<Icon
											name="fa-solid fa-times-circle"
											class="text-sm" />
										<span class="text-sm font-medium"
											>该商品暂时缺货</span
										>
									</div>
								</div>

								<!-- 购买操作区 (桌面端) -->
								<div
									class="hidden lg:block mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
									<div class="flex gap-4">
										<button
											type="button"
											class="flex-1 px-6 py-3.5 bg-indigo-600 text-white text-base font-bold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
											:disabled="
												isOutOfStock || isLoading
											"
											@click="handleBuyNow">
											<Icon
												v-if="isLoading"
												name="fa-solid fa-spinner"
												class="animate-spin mr-2" />
											{{
												isOutOfStock
													? "暂时缺货"
													: "立即购买"
											}}
										</button>
										<button
											type="button"
											class="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-base font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
											:disabled="
												isOutOfStock || isLoading
											"
											@click="handleAddToCart">
											加入购物车
										</button>
										<button
											type="button"
											class="w-14 flex items-center justify-center rounded-xl border-2 transition-all duration-200"
											:class="
												detail.is_collect
													? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
													: 'border-slate-200 dark:border-slate-600 text-slate-400 hover:border-slate-300'
											"
											:disabled="isLoading"
											@click="handleCollect">
											<Icon
												:name="
													detail.is_collect
														? 'fa-solid fa-heart'
														: 'fa-regular fa-heart'
												"
												class="text-xl" />
										</button>
									</div>
								</div>
							</section>
						</div>
					</article>

					<!-- 详情标签页 -->
					<div
						class="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
						<div
							class="border-b border-slate-100 dark:border-slate-700">
							<nav
								class="flex overflow-x-auto scrollbar-hide"
								aria-label="商品详情标签">
								<button
									v-for="tab in tabs"
									:key="tab.key"
									type="button"
									class="flex-shrink-0 px-6 py-4 text-sm font-bold transition-all duration-200 border-b-2 whitespace-nowrap"
									:class="
										activeTab === tab.key
											? 'text-indigo-600 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
											: 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200'
									"
									@click="activeTab = tab.key">
									<Icon
										:name="tab.icon"
										class="mr-2" />
									{{ tab.label }}
								</button>
							</nav>
						</div>

						<div class="p-6 min-h-[300px]">
							<div
								v-show="activeTab === 'detail'"
								class="prose prose-slate dark:prose-invert max-w-none">
								<div
									v-if="detail.intro"
									v-html="sanitizedIntro"></div>
								<div
									v-else
									class="flex flex-col items-center justify-center py-12 text-slate-400">
									<Icon
										name="fa-solid fa-file-alt"
										class="text-5xl mb-4 opacity-50" />
									<p>暂无商品详情</p>
								</div>
							</div>

							<div
								v-show="activeTab === 'params'"
								class="space-y-0">
								<div
									class="grid grid-cols-[100px_1fr] gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50">
									<span
										class="text-slate-500 dark:text-slate-400 text-sm"
										>商品ID</span
									>
									<span
										class="text-slate-900 dark:text-white text-sm font-medium"
										>{{ detail.id }}</span
									>
								</div>
								<div
									class="grid grid-cols-[100px_1fr] gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50">
									<span
										class="text-slate-500 dark:text-slate-400 text-sm"
										>商品分类</span
									>
									<span
										class="text-slate-900 dark:text-white text-sm font-medium"
										>{{ detail.category || "未分类" }}</span
									>
								</div>
								<div
									class="grid grid-cols-[100px_1fr] gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50">
									<span
										class="text-slate-500 dark:text-slate-400 text-sm"
										>发货方式</span
									>
									<span
										class="text-slate-900 dark:text-white text-sm font-medium"
										>{{
											getDeliveryType(
												detail.deliveryType || 0
											)
										}}</span
									>
								</div>
								<div
									class="grid grid-cols-[100px_1fr] gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50">
									<span
										class="text-slate-500 dark:text-slate-400 text-sm"
										>上架时间</span
									>
									<span
										class="text-slate-900 dark:text-white text-sm font-medium"
										>{{
											formatDate(detail.create_time)
										}}</span
									>
								</div>
							</div>

							<div
								v-show="activeTab === 'reviews'"
								class="flex flex-col items-center justify-center py-16 text-slate-400">
								<Icon
									name="fa-solid fa-comment-dots"
									class="text-6xl mb-4 opacity-50" />
								<p class="text-sm font-medium">暂无评价信息</p>
								<p class="text-xs mt-1 opacity-75">
									快来成为第一个评价的用户吧
								</p>
							</div>
						</div>
					</div>

					<!-- 相关推荐 -->
					<section
						v-if="relatedProducts.length > 0"
						class="mt-8">
						<div class="flex items-center justify-between mb-6">
							<h2
								class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
								<Icon
									name="fa-solid fa-layer-group"
									class="text-indigo-500" />
								相关推荐
							</h2>
							<NuxtLink
								to="/commodity"
								class="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
								查看更多
								<Icon
									name="fa-solid fa-arrow-right"
									class="text-xs" />
							</NuxtLink>
						</div>
						<div
							class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
							<NuxtLink
								v-for="item in relatedProducts"
								:key="item.id"
								:to="`/commodity/detail/${item.id}`"
								class="group bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
								<div
									class="aspect-square overflow-hidden bg-white dark:bg-slate-800">
									<el-image
										:src="item.image?.[0]"
										:alt="item.title"
										fit="contain"
										class="w-full h-full transition-opacity duration-300 group-hover:opacity-90"
										lazy />
								</div>
								<div class="p-3">
									<h3
										class="text-sm font-bold line-clamp-2 mb-2 text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors min-h-[2.5rem]"
										:title="item.title">
										{{ item.title }}
									</h3>
									<div class="flex items-baseline gap-0.5">
										<span
											class="text-red-500 text-xs font-bold"
											>¥</span
										>
										<span
											class="text-red-500 text-base font-extrabold">
											{{ formatPrice(item.price) }}
										</span>
									</div>
								</div>
							</NuxtLink>
						</div>
					</section>
				</div>

				<!-- 移动端底部操作栏 -->
				<div
					class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 lg:hidden z-50 pb-safe">
					<div class="flex gap-3">
						<button
							type="button"
							class="flex flex-col items-center justify-center w-12 gap-0.5 text-slate-500 dark:text-slate-400"
							@click="handleCollect">
							<Icon
								:name="
									detail.is_collect
										? 'fa-solid fa-heart'
										: 'fa-regular fa-heart'
								"
								class="text-xl"
								:class="
									detail.is_collect ? 'text-red-500' : ''
								" />
							<span class="text-[10px]">收藏</span>
						</button>
						<button
							type="button"
							class="flex-1 h-10 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-full"
							:disabled="isOutOfStock || isLoading"
							@click="handleAddToCart">
							加入购物车
						</button>
						<button
							type="button"
							class="flex-1 h-10 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-200 dark:shadow-none"
							:disabled="isOutOfStock || isLoading"
							@click="handleBuyNow">
							{{ isOutOfStock ? "缺货" : "立即购买" }}
						</button>
					</div>
				</div>
				<!-- 底部占位 -->
				<div class="h-20 lg:hidden"></div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import commodityApi from "~/api/commodity";
	// 订单Api
	import orderApi from "~/api/order";
	// 购物车Api
	import shoppingCartApi from "~/api/commodity/shopping_cart/index";
	// 用户Store
	import useUserStore from "~/stores/user";

	import SKU from "~/components/SKU/index.vue";
	// 地址组件
	import AddressDisplay from "~/components/AddressDisplay/index.vue";

	import { ElMessage } from "element-plus";
	import type { CommodityDetailResponse } from "~/api/commodity/types.d";

	// ==================== 类型定义 ====================
	interface Tab {
		key: string;
		label: string;
		icon: string;
	}

	// ==================== 路由相关 ====================
	const router = useRouter();
	const route = useRoute();
	const id = computed(() => Number(route.params.id));

	// ==================== 响应式状态 ====================
	// 用户Store
	const userStore = useUserStore();
	const isLoading = ref(false);
	const currentImageIndex = ref(0);
	const activeTab = ref<string>("detail");
	const formData = reactive<any>({
		sku: null,
		// 数量
		quantity: 1,
		address: null,
	});

	// ==================== 数据获取 ====================
	const { data: detail, refresh: refreshDetail } = await useAsyncData(
		`commodity-detail-${id.value}`,
		() => commodityApi.detail(id.value),
		{
			default: () =>
				({
					id: 0,
					title: "",
					price: 0,
					fee: null,
					stock: 0,
					sales: 0,
					deliveryType: 0,
					image: "",
					intro: "",
					browse: 0,
					collect: 0,
					is_collect: 0,
					is_recommend: 0,
					is_topping: 0,
					category: "",
					create_time: "",
					update_time: "",
				} as CommodityDetailResponse),
		}
	);

	const { data: relatedProducts } = await useAsyncData(
		`commodity-related-${id.value}`,
		() => commodityApi.related(id.value),
		{
			default: () => [],
		}
	);

	// ==================== 计算属性 ====================
	/**
	 * 图片列表
	 */
	const imageList = computed<any>(() => {
		if (detail.value.image) {
			// 如果有多张图片（逗号分隔），则拆分
			return detail.value.image;
		}
		return [];
	});

	/**
	 * 当前显示的图片
	 */
	const currentImage = computed(() => {
		return imageList.value[currentImageIndex.value] || detail.value.image;
	});

	/**
	 * 是否库存紧张
	 */
	const isLowStock = computed(() => {
		return detail.value.stock > 0 && detail.value.stock <= 10;
	});

	/**
	 * 是否无货
	 */
	const isOutOfStock = computed(() => {
		return detail.value.stock <= 0;
	});

	/**
	 * 是否有标签
	 */
	const hasTags = computed(() => {
		return (
			detail.value.category ||
			detail.value.is_recommend ||
			detail.value.is_topping
		);
	});

	/**
	 * 净化后的商品详情HTML
	 */
	const sanitizedIntro = computed(() => {
		// 这里可以添加HTML净化逻辑，防止XSS攻击
		return detail.value.intro;
	});

	/**
	 * 标签页配置
	 */
	const tabs = computed<Tab[]>(() => [
		{ key: "detail", label: "商品详情", icon: "fa-solid fa-info-circle" },
		{ key: "params", label: "规格参数", icon: "fa-solid fa-list-ul" },
		{ key: "reviews", label: "用户评价", icon: "fa-solid fa-star" },
	]);

	// ==================== 工具函数 ====================
	/**
	 * 格式化价格
	 */
	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};

	/**
	 * 获取发货方式文本
	 */
	const getDeliveryType = (type: number): string => {
		const deliveryTypes: Record<number, string> = {
			0: "快递配送",
			1: "到店自提",
			2: "人工发货",
			3: "自动发货",
		};
		return deliveryTypes[type] || "未知方式";
	};

	/**
	 * 格式化日期
	 */
	const formatDate = (dateString: string): string => {
		if (!dateString) return "暂无";
		try {
			const date = new Date(dateString);
			return date.toLocaleString("zh-CN", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateString;
		}
	};

	// ==================== 事件处理函数 ====================
	/**
	 * 返回上一页
	 */
	const handleGoBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.push("/commodity");
		}
	};

	/**
	 * 切换图片
	 */
	const handleImageChange = (index: number) => {
		currentImageIndex.value = index;
	};

	/**
	 * 验证form是否填写完整
	 */
	const validateForm = () => {
		// TODO: 实现校验逻辑
		return true;
	};

	const handleBuyNow = () => {
		if (!validateForm()) return;
		// TODO: 实现购买逻辑
	};

	const handleAddToCart = () => {
		if (!validateForm()) return;
		// TODO: 实现加入购物车逻辑
	};

	const handleCollect = () => {
		// TODO: 实现收藏逻辑
	};
</script>

<style scoped>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
