<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full bg-gray-50">
				<!-- 顶部广告轮播 -->
				<Information
					class="w-full !h-[300px]"
					type="adv"
					:data="pageData.adv"
					height="300px"
				/>
				
				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 py-6">
					<div class="grid grid-cols-[240px_1fr_320px] gap-6">
						<!-- 左侧：筛选面板 -->
						<aside class="space-y-4">
							<!-- 分类筛选 -->
							<section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
								<div class="px-4 py-3 border-b border-gray-100">
									<h3 class="text-base font-semibold flex items-center gap-2">
										<Icon name="fa-solid fa-list" class="text-indigo-500 text-sm" />
										商品分类
									</h3>
								</div>
								<nav class="p-2">
									<ul class="space-y-1">
										<li>
											<button
												type="button"
												class="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
												:class="
													queryParams.categoryId === null
														? 'bg-indigo-50 text-indigo-600 font-medium'
														: 'text-gray-700 hover:bg-gray-50'
												"
												@click="handleCategoryChange(null)"
											>
												全部商品
											</button>
										</li>
										<li
											v-for="category in categories"
											:key="category.id"
										>
											<button
												type="button"
												class="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
												:class="
													queryParams.categoryId === category.id
														? 'bg-indigo-50 text-indigo-600 font-medium'
														: 'text-gray-700 hover:bg-gray-50'
												"
												@click="handleCategoryChange(category.id)"
											>
												{{ category.name }}
											</button>
										</li>
									</ul>
								</nav>
							</section>

							<!-- 价格筛选 -->
							<section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
								<div class="px-4 py-3 border-b border-gray-100">
									<h3 class="text-base font-semibold flex items-center gap-2">
										<Icon name="fa-solid fa-filter" class="text-indigo-500 text-sm" />
										价格筛选
									</h3>
								</div>
								<div class="p-4">
									<form @submit.prevent="handleFilterApply">
										<div class="space-y-3">
											<div>
												<label class="block text-xs font-medium text-gray-500 mb-1.5">
													价格区间
												</label>
												<div class="flex items-center gap-2">
													<input
														v-model.number="priceRange.min"
														type="number"
														min="0"
														step="0.01"
														placeholder="最低价"
														class="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
													/>
													<span class="text-gray-400 text-sm">至</span>
													<input
														v-model.number="priceRange.max"
														type="number"
														min="0"
														step="0.01"
														placeholder="最高价"
														class="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
													/>
												</div>
											</div>
											<button
												type="submit"
												class="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200"
											>
												应用筛选
											</button>
											<button
												v-if="hasActiveFilters"
												type="button"
												class="w-full py-2 bg-white text-gray-600 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
												@click="handleFilterReset"
											>
												清除筛选
											</button>
										</div>
									</form>
								</div>
							</section>
						</aside>

						<!-- 中间：商品列表 -->
						<main class="space-y-4">
							<!-- 搜索栏 -->
							<section class="bg-white rounded-xl shadow-sm border border-gray-100">
								<form @submit.prevent="handleSearch" class="p-4">
									<div class="relative">
										<input
											v-model="queryParams.keyword"
											type="search"
											placeholder="搜索商品名称、描述..."
											class="w-full h-11 pl-11 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
											@keyup.enter="handleSearch"
										/>
										<Icon
											name="fa-solid fa-search"
											class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
										/>
									</div>
								</form>
							</section>

							<!-- 结果信息 -->
							<div v-if="pager.lists.length > 0" class="flex items-center justify-between text-sm text-gray-500 px-1">
								<span>共找到 <span class="font-medium text-gray-900">{{ pager.total }}</span> 件商品</span>
							</div>

							<!-- 商品网格 -->
							<section v-if="pager.lists.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
								<article
									v-for="item in pager.lists"
									:key="item.id"
								>
									<NuxtLink
										:to="`/commodity/detail/${item.id}`"
										class="group block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
									>
										<!-- 商品图片容器 -->
										<div class="relative aspect-square overflow-hidden bg-gray-50">
											<el-image
												:src="item.image"
												:alt="item.title"
												class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
												lazy
											>
												<template #error>
													<div class="h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
														<Icon name="fa-solid fa-image" class="text-3xl mb-2" />
														<span class="text-xs">图片加载失败</span>
													</div>
												</template>
												<template #placeholder>
													<div class="h-full flex items-center justify-center bg-gray-100">
														<div class="animate-pulse">
															<Icon name="fa-solid fa-image" class="text-3xl text-gray-300" />
														</div>
													</div>
												</template>
											</el-image>

											<!-- 商品标签 -->
											<div
												v-if="item.is_recommend || item.is_topping"
												class="absolute top-3 left-3 flex gap-1.5"
											>
												<span
													v-if="item.is_topping"
													class="inline-flex items-center bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
												>
													置顶
												</span>
												<span
													v-if="item.is_recommend"
													class="inline-flex items-center bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
												>
													推荐
												</span>
											</div>
										</div>

										<!-- 商品信息 -->
										<div class="p-4 space-y-3">
											<!-- 标题 -->
											<h3
												class="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors duration-200 min-h-[2.5rem]"
												:title="item.title"
											>
												{{ item.title }}
											</h3>

											<!-- 简介 -->
											<p
												v-if="item.intro"
												class="text-xs text-gray-500 line-clamp-1"
												:title="item.intro"
											>
												{{ item.intro }}
											</p>

											<!-- 价格和销量 -->
											<div class="flex items-end justify-between pt-2 border-t border-gray-100">
												<div class="flex items-baseline gap-0.5">
													<span class="text-red-500 text-xs font-medium">¥</span>
													<span class="text-red-500 text-xl font-bold">
														{{ formatPrice(item.price) }}
													</span>
												</div>
												<div class="text-xs text-gray-400">
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
								class="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center"
							>
								<Icon name="fa-solid fa-box-open" class="text-6xl text-gray-300 mb-4" />
								<p class="text-gray-500 text-sm">暂无商品</p>
								<button
									v-if="hasActiveFilters"
									type="button"
									class="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
									@click="handleFilterReset"
								>
									清除筛选条件
								</button>
							</div>

							<!-- 分页器 -->
							<div v-if="pager.lists.length > 0" class="flex justify-center pt-2">
								<Paging v-model="pager" @change="queryLists" />
							</div>
						</main>

						<!-- 右侧：推荐区域 -->
						<aside class="space-y-4">
							<!-- 热门商品 -->
							<section
								v-if="pageData.ranking?.length"
								class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
							>
								<div class="px-4 py-3 border-b border-gray-100">
									<h3 class="text-base font-semibold flex items-center gap-2">
										<Icon name="fa-solid fa-fire" class="text-red-500 text-sm" />
										热门商品
									</h3>
								</div>
								<div class="p-2 space-y-2">
									<NuxtLink
										v-for="(item, index) in pageData.ranking"
										:key="item.id"
										:to="`/commodity/detail/${item.id}`"
										class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
									>
										<div class="flex-shrink-0 w-5 text-center">
											<span
												class="text-sm font-bold"
												:class="
													index < 3
														? 'text-red-500'
														: 'text-gray-400'
												"
											>
												{{ index + 1 }}
											</span>
										</div>
										<div class="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg">
											<el-image
												:src="item.image"
												:alt="item.title"
												class="w-full h-full object-cover"
												lazy
											/>
										</div>
										<div class="flex-1 min-w-0">
											<h4
												class="text-sm font-medium line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 leading-relaxed"
												:title="item.title"
											>
												{{ item.title }}
											</h4>
											<div class="mt-1 text-red-500 text-sm font-bold">
												¥{{ formatPrice(item.price) }}
											</div>
										</div>
									</NuxtLink>
								</div>
							</section>

							<!-- 推荐商品 -->
							<section
								v-if="pageData.topping?.length"
								class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
							>
								<div class="px-4 py-3 border-b border-gray-100">
									<h3 class="text-base font-semibold flex items-center gap-2">
										<Icon name="fa-solid fa-star" class="text-amber-500 text-sm" />
										推荐商品
									</h3>
								</div>
								<div class="p-2 space-y-2">
									<NuxtLink
										v-for="item in pageData.topping"
										:key="item.id"
										:to="`/commodity/detail/${item.id}`"
										class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
									>
										<div class="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg">
											<el-image
												:src="item.image"
												:alt="item.title"
												class="w-full h-full object-cover"
												lazy
											/>
										</div>
										<div class="flex-1 min-w-0">
											<h4
												class="text-sm font-medium line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 leading-relaxed"
												:title="item.title"
											>
												{{ item.title }}
											</h4>
											<div class="mt-1 text-red-500 text-sm font-bold">
												¥{{ formatPrice(item.price) }}
											</div>
										</div>
									</NuxtLink>
								</div>
							</section>
						</aside>
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import Icon from "~/components/Icon/index.vue";
import commodityApi from "~/api/commodity";
import Information from "../article/_components/Information.vue";
import Paging from "~/components/Paging/index.vue";
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

// ==================== 页面数据获取 ====================
const { data: pageData } = await useAsyncData(
	"commodity-pages",
	() => commodityApi.pages(),
	{
		default: () => ({
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
const { pager, queryLists, resetPaging } = usePaging<CommodityListsResponse>({
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
/**
 * 格式化价格显示
 */
const formatPrice = (price: number | string): string => {
	const numPrice = typeof price === "string" ? parseFloat(price) : price;
	return numPrice.toFixed(2);
};

/**
 * 验证价格范围
 */
const validatePriceRange = (): boolean => {
	const min = priceRange.min ? Number(priceRange.min) : null;
	const max = priceRange.max ? Number(priceRange.max) : null;

	if (min !== null && max !== null && min > max) {
		// 可以添加提示逻辑
		return false;
	}
	return true;
};

// ==================== 事件处理函数 ====================
/**
 * 处理分类选择
 */
const handleCategoryChange = (categoryId: number | null) => {
	queryParams.categoryId = categoryId;
	resetPaging();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
	resetPaging();
};

/**
 * 应用价格筛选
 */
const handleFilterApply = () => {
	if (!validatePriceRange()) {
		return;
	}

	queryParams.minPrice = priceRange.min ? Number(priceRange.min) : null;
	queryParams.maxPrice = priceRange.max ? Number(priceRange.max) : null;
	resetPaging();
};

/**
 * 重置筛选条件
 */
const handleFilterReset = () => {
	queryParams.keyword = "";
	queryParams.categoryId = null;
	queryParams.minPrice = null;
	queryParams.maxPrice = null;
	priceRange.min = "";
	priceRange.max = "";
	resetPaging();
};

// ==================== 生命周期 ====================
onMounted(() => {
	queryLists();
});
</script>

<style scoped>
/* 自定义滚动条样式（可选） */
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