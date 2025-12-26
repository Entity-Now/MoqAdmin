<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="min-h-screen bg-white">
				<!-- 结果页顶部 (搜索和操作) -->
				<div
					class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
					<div
						class="max-w-[1920px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
						<!-- 标题/搜索按钮 (Mobile) -->
						<div class="lg:hidden flex items-center gap-3">
							<button
								class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
								@click="showMobileFilter = true">
								<Icon name="fa-solid fa-filter" />
							</button>
						</div>

						<!-- 搜索框 (Desktop & Mobile expanded) -->
						<div class="flex-1 max-w-2xl relative group">
							<input
								v-model="queryParams.keyword"
								type="text"
								placeholder="搜索商品..."
								class="w-full h-10 md:h-12 pl-12 pr-12 bg-gray-100 rounded-full border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 transition-all text-[15px]"
								@keyup.enter="handleSearch" />
							<Icon
								name="fa-solid fa-search"
								class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
							<button
								type="button"
								class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
								@click="openImageSearch"
								title="以图搜图">
								<Icon name="fa-solid fa-camera" />
							</button>
						</div>

						<!-- 右侧操作 -->
						<div class="hidden lg:flex items-center gap-6">
							<button
								v-if="hasActiveFilters"
								class="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity"
								@click="handleFilterReset">
								重置筛选
							</button>
						</div>
					</div>
				</div>

				<!-- 主体布局 -->
				<div class="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
					<div class="flex flex-col lg:flex-row items-start gap-8">
						<!-- 左侧：侧边栏 (Desktop) -->
						<aside
							v-show="showSidebar"
							class="hidden lg:block w-[260px] shrink-0 sticky top-20 md:top-24 h-[calc(100vh-120px)] overflow-hidden">
							<FilterSidebar
								:categories="categories"
								:page-data="pageData"
								:query-params="queryParams"
								:price-range="priceRange"
								@change="handleFilterChange"
								@reset="handleFilterReset"
								@update:price-range="updatePriceRange" />
						</aside>

						<!-- 右侧：商品网格 -->
						<main
							class="flex-1 min-w-0 max-h-full"
							:class="{ 'no-sidebar': !showSidebar }">
							<ProductGrid
								:pager="pager"
								:has-active-filters="hasActiveFilters"
								:show-sidebar="showSidebar"
								@load-more="loadMore"
								@reset="handleFilterReset"
								@toggle-filter="showSidebar = !showSidebar" />
						</main>
					</div>
				</div>

				<!-- 移动端筛选抽屉 -->
				<el-drawer
					v-model="showMobileFilter"
					title="筛选"
					direction="rtl"
					size="85%"
					:with-header="true">
					<div class="h-full p-4">
						<FilterSidebar
							:categories="categories"
							:page-data="pageData"
							:query-params="queryParams"
							:price-range="priceRange"
							@change="handleFilterChange"
							@reset="handleFilterReset"
							@update:price-range="updatePriceRange" />
					</div>
				</el-drawer>

				<!-- 以图搜图组件 -->
				<SearchByImage
					ref="searchByImageRef"
					@submit="handleImageSearch" />
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import commodityApi from "~/api/commodity";
	import FilterSidebar from "./components/FilterSidebar.vue";
	import ProductGrid from "./components/ProductGrid.vue";
	import SearchByImage from "~/components/SearchByImage/index.vue";
	import { ElMessage } from "element-plus";
	import type {
		CommodityCategory,
		CommodityListsResponse,
		CommodityPagesResponse,
	} from "~/api/commodity/types.d";

	// ==================== SEO Meta ====================
	useSeoMeta({
		title: "商品列表 - MoqAdmin",
		description:
			"浏览我们丰富的商品列表，发现最新、最热、最优惠的商品。支持多条件筛选，助您快速找到心仪好物。",
		keywords: "商品列表, 在线购物,热门商品, 推荐商品, 价格筛选",
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
	const showSidebar = ref(true);
	const showMobileFilter = ref(false);
	const searchByImageRef = ref<InstanceType<typeof SearchByImage> | null>(
		null
	);

	const queryParams = reactive({
		keyword: "",
		categoryId: null as number | null,
		minPrice: null as number | null,
		maxPrice: null as number | null,
	});

	const priceRange = reactive({
		min: "" as string | number,
		max: "" as string | number,
	});

	// ==================== 分页处理 ====================
	const { pager, queryLists, resetPaging } =
		usePaging<CommodityListsResponse>({
			fetchFun: commodityApi.lists,
			params: queryParams,
			limit: 25,
		});

	const loadMore = async () => {
		if (pager.loading || pager.finished) return;
		pager.page++;
		await queryLists(true);
	};

	// ==================== 计算属性 ====================
	const hasActiveFilters = computed(() => {
		return (
			queryParams.categoryId !== null ||
			queryParams.minPrice !== null ||
			queryParams.maxPrice !== null ||
			queryParams.keyword !== ""
		);
	});

	// ==================== 事件处理函数 ====================
	const updatePriceRange = (val: any) => {
		priceRange.min = val.min;
		priceRange.max = val.max;
	};

	const handleFilterChange = async (newParams: any) => {
		Object.assign(queryParams, newParams);
		await resetPaging();
		showMobileFilter.value = false;
	};

	const handleSearch = async () => {
		await resetPaging();
	};

	const handleFilterReset = async () => {
		queryParams.keyword = "";
		queryParams.categoryId = null;
		queryParams.minPrice = null;
		queryParams.maxPrice = null;
		priceRange.min = "";
		priceRange.max = "";
		await resetPaging();
		showMobileFilter.value = false;
	};

	const openImageSearch = () => {
		searchByImageRef.value?.open();
	};

	const handleImageSearch = async (file: File) => {
		try {
			const results = await commodityApi.search_image(file);
			if (results) {
				pager.lists = results.lists;
				pager.total = results.total;
				pager.page = 1;
				ElMessage.success(`找到 ${results.total} 件相似商品`);
			} else {
				pager.lists = [];
				pager.total = 0;
				ElMessage.warning("未找到相似商品");
			}
		} catch (error) {
			ElMessage.error("图片搜索失败");
		}
	};

	onMounted(() => {
		queryLists();
	});
</script>

<style scoped>
	:deep(.el-drawer__body) {
		padding: 0;
	}
</style>
