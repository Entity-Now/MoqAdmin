<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full bg-gray-50">
				<!-- 顶部广告轮播 -->
				<Information
					class="w-full !h-[300px]"
					type="adv"
					:data="pageData.adv"
					height="300px" />

				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 py-4 md:py-6">
					<!-- 移动端：搜索和筛选栏 -->
					<div class="lg:hidden mb-4 space-y-3">
						<div class="flex gap-2">
							<div class="flex-1 relative">
								<input
									v-model="queryParams.keyword"
									type="search"
									placeholder="搜索商品..."
									class="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									@keyup.enter="handleSearch" />
								<Icon
									name="fa-solid fa-search"
									class="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
							</div>
							<button
								class="px-4 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2 text-sm font-medium"
								@click="showMobileFilter = true">
								<Icon name="fa-solid fa-filter" />
								筛选
							</button>
						</div>
					</div>

					<div
						class="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6">
						<!-- 左侧：筛选面板 (Desktop) -->
						<aside class="hidden lg:block">
							<FilterPanel
								:categories="categories"
								:query-params="queryParams"
								:price-range="priceRange"
								@change="handleFilterChange"
								@reset="handleFilterReset"
								@update:price-range="updatePriceRange" />
						</aside>

						<!-- 中间：商品列表 -->
						<main class="space-y-4">
							<!-- PC端搜索栏 -->
							<section
								class="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100">
								<form
									@submit.prevent="handleSearch"
									class="p-4">
									<div class="relative">
										<input
											v-model="queryParams.keyword"
											type="search"
											placeholder="搜索商品名称、描述..."
											class="w-full h-11 pl-11 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
											@keyup.enter="handleSearch" />
										<Icon
											name="fa-solid fa-search"
											class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
									</div>
								</form>
							</section>

							<!-- 结果信息 -->
							<div
								v-if="pager.lists.length > 0"
								class="flex items-center justify-between text-sm text-gray-500 px-1">
								<span
									>共找到
									<span class="font-medium text-gray-900">{{
										pager.total
									}}</span>
									件商品</span
								>
							</div>

							<!-- 商品瀑布流 -->
							<section
								v-if="pager.lists.length > 0"
								class="masonry-grid">
								<article
									v-for="item in pager.lists"
									:key="item.id"
									class="masonry-item">
									<NuxtLink
										:to="`/commodity/detail/${item.id}`"
										class="group block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
										<!-- 商品图片容器 -->
										<div
											class="relative overflow-hidden bg-white">
											<el-image
												:src="
													item.image?.[0] ||
													`/static/default/images/no-img.png`
												"
												:alt="item.title"
												fit="cover"
												class="w-full h-auto transition-opacity duration-300 group-hover:opacity-90"
												lazy>
												<template #error>
													<div
														class="aspect-square flex flex-col items-center justify-center bg-gray-100 text-gray-400">
														<Icon
															name="fa-solid fa-image"
															class="text-3xl mb-2" />
														<span class="text-xs"
															>图片加载失败</span
														>
													</div>
												</template>
												<template #placeholder>
													<div
														class="aspect-square flex items-center justify-center bg-gray-100">
														<div
															class="animate-pulse">
															<Icon
																name="fa-solid fa-image"
																class="text-3xl text-gray-300" />
														</div>
													</div>
												</template>
											</el-image>

											<!-- 商品标签 -->
											<div
												v-if="
													item.is_recommend ||
													item.is_topping
												"
												class="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5">
												<span
													v-if="item.is_topping"
													class="inline-flex items-center bg-red-500 text-white text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm">
													置顶
												</span>
												<span
													v-if="item.is_recommend"
													class="inline-flex items-center bg-amber-500 text-white text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm">
													推荐
												</span>
											</div>
										</div>

										<!-- 商品信息 -->
										<div
											class="p-3 md:p-4 space-y-2 md:space-y-3">
											<!-- 标题 -->
											<h3
												class="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors duration-200"
												:title="item.title">
												{{ item.title }}
											</h3>

											<!-- 价格和销量 -->
											<div
												class="flex items-end justify-between border-t border-gray-100 pt-2">
												<div
													class="flex items-baseline gap-0.5">
													<span
														class="text-red-500 text-xs font-medium"
														>¥</span
													>
													<span
														class="text-red-500 text-lg md:text-xl font-bold">
														{{
															formatPrice(
																item.price
															)
														}}
													</span>
												</div>
												<div
													class="text-xs text-gray-400">
													已售 {{ item.sales }}
												</div>
											</div>
										</div>
									</NuxtLink>
								</article>
							</section>

							<!-- 空状态 -->
							<div
								v-else
								class="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
								<Icon
									name="fa-solid fa-box-open"
									class="text-6xl text-gray-300 mb-4" />
								<p class="text-gray-500 text-sm">暂无商品</p>
								<button
									v-if="hasActiveFilters"
									type="button"
									class="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
									@click="handleFilterReset">
									清除筛选条件
								</button>
							</div>

							<!-- 分页器 -->
							<div
								v-if="pager.lists.length > 0"
								class="flex justify-center pt-2">
								<Paging
									v-model="pager"
									@change="queryLists" />
							</div>
						</main>

						<!-- 右侧：推荐区域 (Desktop & Mobile Bottom) -->
						<aside class="space-y-4">
							<RecommendationPanel :page-data="pageData" />
						</aside>
					</div>
				</div>

				<!-- 移动端筛选抽屉 -->
				<el-drawer
					v-model="showMobileFilter"
					title="商品筛选"
					direction="rtl"
					size="85%"
					:with-header="true">
					<div class="h-full overflow-y-auto p-4">
						<FilterPanel
							:categories="categories"
							:query-params="queryParams"
							:price-range="priceRange"
							@change="handleFilterChange"
							@reset="handleFilterReset"
							@update:price-range="updatePriceRange" />
					</div>
				</el-drawer>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import commodityApi from "~/api/commodity";
	import Information from "../article/_components/Information.vue";
	import Paging from "~/components/Paging/index.vue";
	import FilterPanel from "./_components/FilterPanel.vue";
	import RecommendationPanel from "./_components/RecommendationPanel.vue";
	import type {
		CommodityCategory,
		CommodityListsResponse,
		CommodityPagesResponse,
	} from "~/api/commodity/types.d";

	// ==================== 类型定义 ====================
	interface QueryParams {
		keyword: string;
		categoryId: number | null;
		minPrice: number | null;
		maxPrice: number | null;
		page?: number;
	}

	interface PriceRange {
		min: string | number;
		max: string | number;
	}

	// ==================== SEO Meta ====================
	useSeoMeta({
		title: "商品列表 - MoqAdmin",
		description:
			"浏览我们丰富的商品列表，发现最新、最热、最优惠的商品。支持多条件筛选，助您快速找到心仪好物。",
		keywords: "商品列表, 在线购物, 热门商品, 推荐商品, 价格筛选",
		ogTitle: "商品列表 - MoqAdmin",
		ogDescription: "浏览我们丰富的商品列表，发现最新、最热、最优惠的商品。",
		ogType: "website",
	});

	// ==================== 页面数据获取 ====================
	const { data: pageData } = await useAsyncData(
		"commodity-pages",
		() => commodityApi.pages(),
		{
			default: () =>
				({
					adv: [],
					topping: [],
					ranking: [],
				} as CommodityPagesResponse),
		}
	);

	const { data: categories } = await useAsyncData(
		"commodity-categories",
		() => commodityApi.categories(),
		{
			default: () => [] as CommodityCategory[],
		}
	);

	// ==================== 响应式状态 ====================
	const showMobileFilter = ref(false);

	const queryParams = reactive<QueryParams>({
		keyword: "",
		categoryId: null,
		minPrice: null,
		maxPrice: null,
	});

	const priceRange = reactive<PriceRange>({
		min: "",
		max: "",
	});

	// ==================== 分页处理 ====================
	const { pager, queryLists, resetPaging } =
		usePaging<CommodityListsResponse>({
			fetchFun: commodityApi.lists,
			params: queryParams,
		});

	// ==================== 计算属性 ====================
	const hasActiveFilters = computed(() => {
		return (
			queryParams.categoryId !== null ||
			queryParams.minPrice !== null ||
			queryParams.maxPrice !== null ||
			queryParams.keyword !== ""
		);
	});

	// ==================== 工具函数 ====================
	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};

	// ==================== 事件处理函数 ====================
	const updatePriceRange = (val: PriceRange) => {
		priceRange.min = val.min;
		priceRange.max = val.max;
	};

	const handleFilterChange = (newParams: Partial<QueryParams>) => {
		Object.assign(queryParams, newParams);
		resetPaging();
		showMobileFilter.value = false; // Close drawer on mobile after selection
	};

	const handleSearch = () => {
		resetPaging();
	};

	const handleFilterReset = () => {
		queryParams.keyword = "";
		queryParams.categoryId = null;
		queryParams.minPrice = null;
		queryParams.maxPrice = null;
		priceRange.min = "";
		priceRange.max = "";
		resetPaging();
		showMobileFilter.value = false;
	};

	// ==================== 生命周期 ====================
	onMounted(() => {
		queryLists();
	});
</script>

<style scoped>
	/* 瀑布流布局 */
	.masonry-grid {
		column-count: 1;
		column-gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.masonry-grid {
			column-count: 2;
			column-gap: 1rem;
		}
	}

	@media (min-width: 1280px) {
		.masonry-grid {
			column-count: 3;
			column-gap: 1rem;
		}
	}

	.masonry-item {
		break-inside: avoid;
		margin-bottom: 0.75rem;
	}

	@media (min-width: 640px) {
		.masonry-item {
			margin-bottom: 1rem;
		}
	}

	/* 自定义滚动条样式 */
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
