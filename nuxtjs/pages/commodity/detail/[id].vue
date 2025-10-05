<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full min-h-screen bg-gray-50">
				<div class="max-w-[1440px] mx-auto px-4 py-6">
					<!-- 面包屑导航 -->
					<nav
						class="mb-6"
						aria-label="breadcrumb">
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
							<li
								class="text-gray-900 font-medium truncate max-w-[200px]"
								:title="detail.title">
								{{ detail.title || "商品详情" }}
							</li>
						</ol>
					</nav>

					<!-- 返回按钮 -->
					<div class="mb-4">
						<button
							type="button"
							class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
							@click="handleGoBack">
							<Icon
								name="fa-solid fa-arrow-left"
								class="text-xs" />
							返回商品列表
						</button>
					</div>

					<!-- 商品详情主体 -->
					<article
						class="bg-white rounded-xl shadow-sm overflow-hidden">
						<div
							class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
							<!-- 左侧：商品图片展示区 -->
							<section class="flex flex-col">
								<!-- 主图 -->
								<div
									class="w-full aspect-square overflow-hidden bg-gray-50 rounded-xl mb-4 border border-gray-100">
									<el-image
										:src="currentImage"
										:alt="detail.title"
										class="w-full h-full object-contain"
										:preview-src-list="imageList"
										:initial-index="currentImageIndex"
										preview-teleported>
										<template #error>
											<div
												class="h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
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
												class="h-full flex items-center justify-center bg-gray-100">
												<div class="animate-pulse">
													<Icon
														name="fa-solid fa-image"
														class="text-5xl text-gray-300" />
												</div>
											</div>
										</template>
									</el-image>
								</div>

								<!-- 缩略图列表 -->
								<div
									v-if="imageList.length > 1"
									class="flex gap-2 overflow-x-auto pb-2">
									<button
										v-for="(img, index) in imageList"
										:key="index"
										type="button"
										class="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer"
										:class="
											currentImageIndex === index
												? 'border-indigo-500 ring-2 ring-indigo-200'
												: 'border-gray-200 hover:border-indigo-300'
										"
										@click="handleImageChange(index)">
										<el-image
											:src="img"
											:alt="`${detail.title} - 图片 ${
												index + 1
											}`"
											class="w-full h-full object-cover"
											fit="cover" />
									</button>
								</div>
							</section>

							<!-- 右侧：商品信息区 -->
							<section class="flex flex-col">
								<div class="flex-1">
									<!-- 商品标题 -->
									<h1
										class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
										{{ detail.title }}
									</h1>

									<!-- 商品标签 -->
									<div
										v-if="hasTags"
										class="flex flex-wrap gap-2 mb-4">
										<span
											v-if="detail.category"
											class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
											<Icon
												name="fa-solid fa-tag"
												class="mr-1.5 text-xs" />
											{{ detail.category }}
										</span>
										<span
											v-if="detail.is_recommend"
											class="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
											<Icon
												name="fa-solid fa-star"
												class="mr-1.5 text-xs" />
											推荐商品
										</span>
										<span
											v-if="detail.is_topping"
											class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
											<Icon
												name="fa-solid fa-fire"
												class="mr-1.5 text-xs" />
											置顶商品
										</span>
									</div>

									<!-- 商品价格 -->
									<div
										class="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
										<div
											class="flex items-center justify-between">
											<div>
												<p
													class="text-sm text-gray-500 mb-1">
													商品价格
												</p>
												<div
													class="flex items-baseline gap-1">
													<span
														class="text-red-500 font-bold text-xl"
														>¥</span
													>
													<span
														class="text-red-500 font-bold text-4xl">
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
													class="text-sm text-gray-500 mb-1">
													库存
												</p>
												<p
													class="text-lg font-semibold text-gray-900">
													{{ detail.stock }} 件
												</p>
											</div>
										</div>
									</div>

									<!-- 商品属性信息 -->
									<div
										class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-cube"
												class="text-indigo-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													库存
												</p>
												<p
													class="text-sm font-semibold text-gray-900">
													{{ detail.stock }} 件
												</p>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-shopping-bag"
												class="text-green-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													销量
												</p>
												<p
													class="text-sm font-semibold text-gray-900">
													{{ detail.sales }} 件
												</p>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-eye"
												class="text-blue-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													浏览量
												</p>
												<p
													class="text-sm font-semibold text-gray-900">
													{{ detail.browse }} 次
												</p>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-truck"
												class="text-amber-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													发货方式
												</p>
												<p
													class="text-sm font-semibold text-gray-900">
													{{
														getDeliveryType(
															detail.deliveryType ||
																0
														)
													}}
												</p>
											</div>
										</div>
										<!-- 数量 -->
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-cart-plus"
												class="text-amber-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													数量
												</p>
												<el-input
													v-model="formData.quantity"
													type="number"
													min="1"
													max="100"
													class="w-12 h-8 text-center" />
											</div>
										</div>
										<!-- 运费 -->
										<div class="flex items-center gap-2">
											<Icon
												name="fa-solid fa-money-bill"
												class="text-amber-500 text-sm" />
											<div>
												<p
													class="text-xs text-gray-500">
													运费
												</p>
												<p
													class="text-sm font-semibold text-gray-900">
													{{
														detail.fee
															? formatPrice(
																	detail.fee
															  )
															: "免运费"
													}}
												</p>
											</div>
										</div>
										<!-- sku -->
										<div
											v-if="detail.sku"
											class="flex items-center gap-2 col-span-2">
											<SKU
												:options="detail.sku"
												v-model="formData.sku" />
										</div>
										<!-- 地址 -->
										<div class="flex items-center gap-2 col-span-2">
											<AddressDisplay
												v-model="formData.address" />
										</div>
									</div>

									<!-- 库存警告 -->
									<div
										v-if="isLowStock"
										class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
										<div
											class="flex items-center gap-2 text-amber-700">
											<Icon
												name="fa-solid fa-exclamation-triangle"
												class="text-sm" />
											<span class="text-sm font-medium"
												>库存紧张，仅剩
												{{ detail.stock }} 件</span
											>
										</div>
									</div>

									<!-- 无货提示 -->
									<div
										v-if="isOutOfStock"
										class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
										<div
											class="flex items-center gap-2 text-red-700">
											<Icon
												name="fa-solid fa-times-circle"
												class="text-sm" />
											<span class="text-sm font-medium"
												>该商品暂时缺货</span
											>
										</div>
									</div>
								</div>

								<!-- 购买操作区 -->
								<div class="pt-6 border-t border-gray-100">
									<div class="flex flex-wrap gap-3">
										<button
											type="button"
											class="flex-1 min-w-[140px] px-6 py-3 bg-indigo-600 text-white text-base font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
											class="flex-1 min-w-[140px] px-6 py-3 bg-red-500 text-white text-base font-medium rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
											:disabled="
												isOutOfStock || isLoading
											"
											@click="handleAddToCart">
											<Icon
												name="fa-solid fa-shopping-cart"
												class="mr-2" />
											加入购物车
										</button>
										<button
											type="button"
											class="text-center px-3 bg-white border-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
											:class="
												detail.is_collect
													? 'border-red-500 text-red-500 hover:border-red-600 hover:text-red-600'
													: 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-600'
											"
											:disabled="isLoading"
											:aria-label="
												detail.is_collect
													? '取消收藏'
													: '添加收藏'
											"
											@click="handleCollect">
											<Icon
												:name="
													detail.is_collect
														? 'fa-solid fa-heart'
														: 'fa-regular fa-heart'
												"
												class="ml-1 text-lg align-middle" />
										</button>
									</div>
									<!-- <p
										class="mt-3 text-xs text-gray-500 text-center">
										暂不支持7天无理由退换 · 莆田保障
									</p> -->
								</div>
							</section>
						</div>
					</article>

					<!-- 详情标签页 -->
					<div
						class="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
						<div class="border-b border-gray-100">
							<nav
								class="flex"
								aria-label="商品详情标签">
								<button
									v-for="tab in tabs"
									:key="tab.key"
									type="button"
									class="flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2"
									:class="
										activeTab === tab.key
											? 'text-indigo-600 border-indigo-600 bg-indigo-50'
											: 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
									"
									@click="activeTab = tab.key">
									<Icon
										:name="tab.icon"
										class="mr-2" />
									{{ tab.label }}
								</button>
							</nav>
						</div>

						<!-- 商品详情内容 -->
						<div class="p-6">
							<div
								v-show="activeTab === 'detail'"
								class="prose prose-sm max-w-none">
								<div
									v-if="detail.intro"
									v-html="sanitizedIntro"></div>
								<div
									v-else
									class="text-center py-8 text-gray-400">
									<Icon
										name="fa-solid fa-file-alt"
										class="text-4xl mb-2" />
									<p>暂无商品详情</p>
								</div>
							</div>

							<div
								v-show="activeTab === 'params'"
								class="space-y-2">
								<div
									class="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100">
									<span class="text-gray-500 text-sm"
										>商品ID</span
									>
									<span
										class="text-gray-900 text-sm font-medium"
										>{{ detail.id }}</span
									>
								</div>
								<div
									class="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100">
									<span class="text-gray-500 text-sm"
										>商品分类</span
									>
									<span
										class="text-gray-900 text-sm font-medium"
										>{{ detail.category || "未分类" }}</span
									>
								</div>
								<div
									class="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100">
									<span class="text-gray-500 text-sm"
										>发货方式</span
									>
									<span
										class="text-gray-900 text-sm font-medium"
										>{{
											getDeliveryType(
												detail.deliveryType || 0
											)
										}}</span
									>
								</div>
								<div
									class="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-gray-100">
									<span class="text-gray-500 text-sm"
										>上架时间</span
									>
									<span
										class="text-gray-900 text-sm font-medium"
										>{{
											formatDate(detail.create_time)
										}}</span
									>
								</div>
								<div
									class="grid grid-cols-[120px_1fr] gap-4 py-3">
									<span class="text-gray-500 text-sm"
										>更新时间</span
									>
									<span
										class="text-gray-900 text-sm font-medium"
										>{{
											formatDate(detail.update_time)
										}}</span
									>
								</div>
							</div>

							<div
								v-show="activeTab === 'reviews'"
								class="text-center py-12 text-gray-400">
								<Icon
									name="fa-solid fa-comment-dots"
									class="text-5xl mb-3" />
								<p class="text-sm">暂无评价信息</p>
								<p class="text-xs mt-1">
									快来成为第一个评价的用户吧
								</p>
							</div>
						</div>
					</div>

					<!-- 相关推荐 -->
					<section
						v-if="relatedProducts.length > 0"
						class="mt-6 bg-white rounded-xl shadow-sm p-6">
						<div class="flex items-center justify-between mb-6">
							<h2
								class="text-xl font-bold text-gray-900 flex items-center gap-2">
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
								class="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
								<div
									class="aspect-square overflow-hidden bg-gray-50">
									<el-image
										:src="item.image"
										:alt="item.title"
										class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
										lazy />
								</div>
								<div class="p-3">
									<h3
										class="text-sm font-medium line-clamp-2 mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 min-h-[2.5rem]"
										:title="item.title">
										{{ item.title }}
									</h3>
									<div class="flex items-baseline gap-0.5">
										<span
											class="text-red-500 text-xs font-medium"
											>¥</span
										>
										<span
											class="text-red-500 text-base font-bold">
											{{ formatPrice(item.price) }}
										</span>
									</div>
								</div>
							</NuxtLink>
						</div>
					</section>
				</div>
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
		address: null
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
	const imageList = computed(() => {
		if (detail.value.image) {
			// 如果有多张图片（逗号分隔），则拆分
			return detail.value.image.split(",").filter(Boolean);
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
		if (!formData.quantity) {
			ElMessage.warning("请选择数量");
			return false;
		}
		// 先判断此商品是否有规格
		if (detail.value.sku ) {
			// 判断规格是否都选择了
			const isAllSelected = Object.keys(detail.value.sku).every(it => formData.sku?.[it]);
			if (!isAllSelected) {
				ElMessage.warning("请选择规格");
				return false;
			}
		}
		if (!formData.address) {
			ElMessage.warning("请选择配送地址");
			return false;
		}

		return true;
	};
	/**
	 * 立即购买
	 */
	const handleBuyNow = async () => {
		// 检查用户是否登录
		if (!userStore.isLogin) {
			ElMessage.warning("请先登录");
			return;
		}

		// 验证form是否填写完整
		if (!validateForm()) {
			return;
		}

		if (isOutOfStock.value) {
			ElMessage.warning("商品暂时缺货，无法购买");
			return;
		}

		isLoading.value = true;
		try {
			// 这里实现立即购买的逻辑
			const order = await orderApi.create({
				commodity_id: id.value,
				sku: formData.sku,
				quantity: formData.quantity,
				address_id: formData.address.id,
				is_from_cart: false,
			});
			ElMessage.success("正在跳转到支付页面...");
			router.push(`/commodity/order/checkout?order_id=${order.order_id}`);
		} catch (error) {
			ElMessage.error("购买失败，请稍后重试");
		} finally {
			isLoading.value = false;
		}
	};

	/**
	 * 加入购物车
	 */
	const handleAddToCart = async () => {
		// 检查用户是否登录
		if (!userStore.isLogin) {
			ElMessage.warning("请先登录");
			return;
		}

		// 验证form是否填写完整
		if (!validateForm()) {
			return;
		}

		if (isOutOfStock.value) {
			ElMessage.warning("商品暂时缺货，无法加入购物车");
			return;
		}

		isLoading.value = true;
		try {
			// 这里实现加入购物车的逻辑
			await shoppingCartApi.add({
				commodity_id: id.value,
				sku: formData.sku,
				quantity: formData.quantity,
			});
			ElMessage.success("已成功加入购物车");
		} catch (error) {
			ElMessage.error("加入购物车失败，请稍后重试");
		} finally {
			isLoading.value = false;
		}
	};

	/**
	 * 收藏/取消收藏
	 */
	const handleCollect = async () => {
		isLoading.value = true;
		try {
			await commodityApi.collect(id.value);
			detail.value.is_collect = detail.value.is_collect ? 0 : 1;
			ElMessage.success(
				detail.value.is_collect ? "收藏成功" : "已取消收藏"
			);
		} catch (error) {
			ElMessage.error("操作失败，请稍后重试");
			console.error("收藏操作失败:", error);
		} finally {
			isLoading.value = false;
		}
	};

	// ==================== SEO优化 ====================
	useHead({
		title: computed(() => detail.value.title || "商品详情"),
		meta: [
			{
				name: "description",
				content: computed(() => {
					const intro =
						detail.value.intro?.replace(/<[^>]*>/g, "") || "";
					return intro.substring(0, 150);
				}),
			},
			{
				property: "og:title",
				content: computed(() => detail.value.title),
			},
			{
				property: "og:image",
				content: computed(() => detail.value.image),
			},
		],
	});
</script>

<style scoped>
	/* Prose样式优化 */
	.prose {
		color: #374151;
		line-height: 1.75;
	}

	.prose :deep(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
	}

	.prose :deep(p) {
		margin: 1rem 0;
	}

	.prose :deep(h1),
	.prose :deep(h2),
	.prose :deep(h3) {
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #111827;
	}

	.prose :deep(ul),
	.prose :deep(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.prose :deep(li) {
		margin: 0.5rem 0;
	}

	/* 动画效果 */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	/* 滚动条样式 */
	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
