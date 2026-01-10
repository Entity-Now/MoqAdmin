<template>
	<NuxtLayout name="default">
		<template #container>
			<div
				class="w-full min-h-screen bg-background transition-colors duration-300">
				<div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
					<!-- 面包屑导航 -->
					<nav
						class="mb-6 hidden sm:block"
						aria-label="breadcrumb">
						<ol
							class="flex items-center gap-2 text-[13px] font-medium tracking-wide">
							<li>
								<NuxtLink
									to="/"
									class="text-muted-foreground hover:text-primary transition-colors duration-200">
									首页
								</NuxtLink>
							</li>
							<li class="text-border">/</li>
							<li>
								<NuxtLink
									to="/commodity"
									class="text-muted-foreground hover:text-primary transition-colors duration-200">
									商店
								</NuxtLink>
							</li>
							<li class="text-border">/</li>
							<li
								class="text-foreground truncate max-w-[200px]"
								:title="detail.title">
								{{ detail.title || "详情" }}
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

					<!-- 商品详情主体 (Nike 风格：Nike Inspired Refactored) -->
					<article
						class="bg-background rounded-3xl overflow-hidden shadow-xl border border-border/40">
						<div
							class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
							<!-- 左侧：图片展示区 -->
							<div
								class="p-4 lg:p-8 lg:border-r border-border/40 bg-white dark:bg-black/5">
								<ProductGallery
									:images="imageList"
									:title="detail.title" />
							</div>

							<!-- 右侧：商品信息与购买操作 (Sticky) -->
							<aside class="relative p-6 lg:p-12">
								<div class="lg:sticky lg:top-24">
									<ProductInfo
										:detail="detail"
										:form-data="formData"
										:is-loading="isLoading"
										@buy-now="handleBuyNow"
										@add-to-cart="handleAddToCart"
										@collect="handleCollect" />
								</div>
							</aside>
						</div>
					</article>

					<!-- 底部详情与推荐 -->
					<div class="mt-8">
						<ProductDetailsFooter
							:intro="sanitizedIntro"
							:param-list="computedParamList" />
					</div>

					<!-- 相关推荐 (保持现状或微调) -->
					<section
						v-if="relatedProducts.length > 0"
						class="mt-20">
						<!-- ... existing related products code ... -->
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
									class="aspect-3/2 overflow-hidden bg-white dark:bg-slate-800">
									<el-image
										:src="item.main_image"
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
					class="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/40 p-4 lg:hidden z-50 pb-safe">
					<div class="flex gap-4">
						<button
							type="button"
							class="flex flex-col items-center justify-center w-12 gap-1 text-muted-foreground"
							@click="handleCollect">
							<Icon
								:name="
									detail.is_collect
										? 'fa-solid fa-heart'
										: 'fa-regular fa-heart'
								"
								class="text-xl"
								:class="
									detail.is_collect ? 'text-destructive' : ''
								" />
						</button>
						<button
							type="button"
							class="flex-1 h-12 bg-secondary text-foreground text-sm font-nike font-bold rounded-full uppercase tracking-widest"
							:disabled="isOutOfStock || isLoading"
							@click="handleAddToCart">
							加入购物车
						</button>
						<button
							type="button"
							class="flex-1 h-12 bg-primary text-primary-foreground text-sm font-nike font-bold rounded-full shadow-lg shadow-primary/20 uppercase tracking-widest"
							:disabled="isOutOfStock || isLoading"
							@click="handleBuyNow">
							{{ isOutOfStock ? "已售罄" : "立即购买" }}
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
	import ProductGallery from "~/components/Commodity/Detail/ProductGallery.vue";
	import ProductInfo from "~/components/Commodity/Detail/ProductInfo.vue";
	import ProductDetailsFooter from "~/components/Commodity/Detail/ProductDetailsFooter.vue";

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
	const isLoading = ref(false);
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
					main_image: "",
					image: "",
					sku: null,
					config: null,
					content: "",
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

	/**
	 * 列表参数 (用于 Footer 组件)
	 */
	const computedParamList = computed(() => [
		{ label: "商品ID", value: detail.value.id },
		{ label: "商品分类", value: detail.value.category || "未分类" },
		{
			label: "发货方式",
			value: getDeliveryType(detail.value.deliveryType || 0),
		},
		{ label: "上架时间", value: formatDate(detail.value.create_time) },
	]);

	/**
	 * 图片列表
	 */
	const imageList = computed<any>(() => {
		if (detail.value.image) {
			return detail.value.image;
		}
		return [];
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
	 * 标签页配置 (已弃用)
	 */

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

	const handleBuyNow = () => {
		if (!validateForm()) return;
		console.log("Buy Now", formData);
		ElMessage.success("订单已创建（演示）");
	};

	const handleAddToCart = () => {
		if (!validateForm()) return;
		console.log("Add to Cart", formData);
		ElMessage.success("已加入购物车");
	};

	const handleCollect = () => {
		detail.value.is_collect = detail.value.is_collect ? 0 : 1;
		ElMessage.success(
			detail.value.is_collect ? "已加入收藏" : "已取消收藏"
		);
	};

	/**
	 * 验证form是否填写完整
	 */
	const validateForm = () => {
		// TODO: 实现校验逻辑
		return true;
	};

	useSeoMeta({
		title: () => detail.value.title,
		description: () => detail.value.intro,
	});
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
