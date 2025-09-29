<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full">
				<!-- 商品页面顶部轮播 -->
				<Information
					class="w-full !h-[300px]"
					type="adv"
					:data="banner"
					height="300px"
				/>
				
				<!-- 三列布局 -->
				<div class="grid grid-cols-[240px_1fr_320px] gap-6 px-4 my-6 max-w-[1440px] mx-auto">
					<!-- 左侧：分类筛选和搜索 -->
					<div class="flex flex-col gap-4">
						<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
								<Icon name="fa-solid fa-list" class="text-indigo-500" />
								商品分类
							</h3>
							<ul class="space-y-2">
								<li
									class="cursor-pointer px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
									:class="{ 'bg-indigo-50 text-indigo-600': queryParams.categoryId === null }"
									@click="() => SelectCategory(null)"
								>
									全部商品
								</li>
								<li
									v-for="item in categories"
									:key="item.id"
									class="cursor-pointer px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
									:class="{ 'bg-indigo-50 text-indigo-600': queryParams.categoryId === item.id }"
									@click="() => SelectCategory(item.id)"
								>
									{{ item.name }}
								</li>
							</ul>
						</div>

						<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
								<Icon name="fa-solid fa-filter" class="text-indigo-500" />
								筛选
							</h3>
							<div class="space-y-4">
								<div>
									<h4 class="text-sm font-medium text-gray-500 mb-2">价格区间</h4>
									<div class="flex items-center gap-2">
										<input
											v-model="priceRange.min"
											type="number"
											placeholder="最低价"
											class="w-full h-9 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200"
										/>
										<span class="text-gray-400">-</span>
										<input
											v-model="priceRange.max"
											type="number"
											placeholder="最高价"
											class="w-full h-9 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200"
										/>
									</div>
								</div>
								<button
									class="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200"
									@click="applyFilter"
								>
									应用筛选
								</button>
							</div>
						</div>
					</div>

					<!-- 中间：商品列表 -->
					<div class="flex flex-col gap-4">
						<!-- 搜索框 -->
						<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<div class="relative">
								<input
									v-model="queryParams.keyword"
									placeholder="搜索商品..."
									class="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-200"
									@keyup.enter="resetPaging"
								/>
								<Icon
									name="fa-solid fa-search"
									class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								/>
							</div>
						</div>

						<!-- 商品网格 -->
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
							<NuxtLink
								v-for="item in pager.lists"
								:key="item.id"
								:to="`/commodity/detail/${item.id}`"
								class="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
							>
								<!-- 商品图片 -->
								<div class="relative aspect-square overflow-hidden bg-gray-50">
									<el-image
										:src="item.image"
										class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
									>
										<template #error>
											<div
												class="h-full flex items-center justify-center bg-gray-100 text-gray-400"
											>
												<Icon
													name="fa-solid fa-image"
													class="text-2xl"
												/>
											</div>
										</template>
									</el-image>

									<!-- 标签 -->
									<div v-if="item.is_recommend || item.is_topping" class="absolute top-2 left-2 flex gap-1">
										<span v-if="item.is_topping" class="bg-red-500 text-white text-xs px-2 py-1 rounded">置顶</span>
										<span v-if="item.is_recommend" class="bg-amber-500 text-white text-xs px-2 py-1 rounded">推荐</span>
									</div>
								</div>

								<!-- 商品信息 -->
								<div class="p-4">
									<!-- 标题 -->
									<h3 class="text-base font-medium line-clamp-2 mb-2 group-hover:text-indigo-500 transition-colors duration-200">
										{{ item.title }}
									</h3>

									<!-- 简介 -->
									<p class="text-gray-500 text-sm line-clamp-1 mb-3">
										{{ item.intro }}
									</p>

									<!-- 价格和销量 -->
									<div class="flex items-center justify-between">
										<div class="flex items-baseline gap-1">
											<span class="text-red-500 font-bold text-lg">¥</span>
											<span class="text-red-500 font-bold text-xl">{{ item.price }}</span>
										</div>
										<div class="text-gray-400 text-xs">
											销量 {{ item.sales }}
										</div>
									</div>
								</div>
							</NuxtLink>
						</div>

						<!-- 分页 -->
						<div class="flex justify-center mt-4">
							<Paging
								v-model="pager"
								@change="queryLists"
							/>
						</div>
					</div>

					<!-- 右侧：推荐区域 -->
					<div class="flex flex-col gap-4">
						<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
								<Icon name="fa-solid fa-fire" class="text-red-500" />
								热门商品
							</h3>
							<div class="space-y-4">
								<NuxtLink
									v-for="item in pageData.hot"
									:key="item.id"
									:to="`/commodity/detail/${item.id}`"
									class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
								>
									<div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
										<el-image
											:src="item.image"
											class="w-full h-full object-cover"
										/>
									</div>
									<div class="flex-1 min-w-0">
										<h4 class="text-sm font-medium line-clamp-2 text-gray-800 hover:text-indigo-500 transition-colors duration-200">
											{{ item.title }}
										</h4>
										<div class="mt-1 text-red-500 text-sm font-medium">
											¥{{ item.price }}
										</div>
									</div>
								</NuxtLink>
							</div>
						</div>

						<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
								<Icon name="fa-solid fa-star" class="text-amber-500" />
								推荐商品
							</h3>
							<div class="space-y-4">
								<NuxtLink
									v-for="item in pageData.recommend"
									:key="item.id"
									:to="`/commodity/detail/${item.id}`"
									class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
								>
									<div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
										<el-image
											:src="item.image"
											class="w-full h-full object-cover"
										/>
									</div>
									<div class="flex-1 min-w-0">
										<h4 class="text-sm font-medium line-clamp-2 text-gray-800 hover:text-indigo-500 transition-colors duration-200">
											{{ item.title }}
										</h4>
										<div class="mt-1 text-red-500 text-sm font-medium">
											¥{{ item.price }}
										</div>
									</div>
								</NuxtLink>
							</div>
						</div>
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
import type { CommodityCategory, CommodityListsResponse, CommodityPagesResponse, _AppHomingAdv } from "~/api/commodity/types.d";

// 轮播图数据
const { data: banner } = await useAsyncData(() => commodityApi.banner(), {
	default() {
		return [] as _AppHomingAdv[];
	},
});

// 页面数据
const { data: pageData } = await useAsyncData(() => commodityApi.pages(), {
	default() {
		return {
			hot: [],
			recommend: []
		} as CommodityPagesResponse;
	},
});

// 分类数据
const { data: categories } = await useAsyncData(() => commodityApi.categories(), {
	default() {
		return [] as CommodityCategory[];
	},
});

// 查询参数
interface QueryParams {
	keyword: string;
	categoryId: number | null;
	minPrice: number | null;
	maxPrice: number | null;
	page?: number;
}

const queryParams = reactive<QueryParams>({
	keyword: "",
	categoryId: null,
	minPrice: null,
	maxPrice: null
});

// 价格区间
const priceRange = reactive({
	min: "",
	max: ""
});

// 分页查询
const { pager, queryLists, resetPaging } = usePaging<CommodityListsResponse>({
	fetchFun: commodityApi.lists,
	params: queryParams,
});

// 选择分类
const SelectCategory = (categoryId: number | null) => {
	queryParams.categoryId = categoryId;
	resetPaging();
};

// 应用筛选
const applyFilter = () => {
	queryParams.minPrice = priceRange.min ? Number(priceRange.min) : null;
	queryParams.maxPrice = priceRange.max ? Number(priceRange.max) : null;
	resetPaging();
};

// 处理分页变化
const handlePageChange = (page: number) => {
	queryParams.page = page;
	queryLists();
};

// 初始加载
queryLists();
</script>