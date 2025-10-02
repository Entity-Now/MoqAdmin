<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full bg-gray-50">
				<!-- 顶部轮播图 -->
				<Information
					class="w-full !h-[420px]"
					type="adv"
					:data="banner"
					height="420px"
				/>
				
				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 py-6">
					<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
						<!-- 左侧：文章列表 -->
						<div class="flex flex-col gap-4">
							<!-- 文章列表 -->
							<div class="space-y-4">
								<article
									v-for="item in pager.lists"
									:key="item.id"
									class="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
								>
									<div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[240px_1fr] gap-4 p-5">
										<!-- 文章封面 -->
										<NuxtLink
											:to="`/article/detail/${item.id}`"
											class="relative block overflow-hidden rounded-lg bg-gray-50"
										>
											<div class="aspect-video w-full">
												<el-image
													:src="item.image"
													:alt="item.title"
													class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
												>
													<template #error>
														<div class="h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
															<Icon name="fa-solid fa-image" class="text-3xl mb-2" />
															<span class="text-xs">图片加载失败</span>
														</div>
													</template>
												</el-image>
											</div>
										</NuxtLink>

										<!-- 文章内容 -->
										<div class="flex flex-col justify-between min-w-0">
											<div class="space-y-2">
												<!-- 标题 -->
												<NuxtLink
													:to="`/article/detail/${item.id}`"
													class="block"
												>
													<h2 class="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
														{{ item.title }}
													</h2>
												</NuxtLink>

												<!-- 简介 -->
												<p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
													{{ item.intro }}
												</p>
											</div>

											<!-- 元信息 -->
											<div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
												<div class="flex items-center gap-1.5">
													<Icon name="fa-regular fa-calendar" class="text-sm" />
													<time>{{ item.create_time }}</time>
												</div>
												<div class="flex items-center gap-1.5">
													<Icon name="fa-regular fa-eye" class="text-sm" />
													<span>{{ item.browse }} 阅读</span>
												</div>
											</div>
										</div>
									</div>
								</article>
							</div>

							<!-- 分页 -->
							<div v-if="pager.lists.length > 0" class="flex justify-center mt-4">
								<Paging v-model="pager" @change="queryLists" />
							</div>
						</div>

						<!-- 右侧：侧边栏 -->
						<div class="flex flex-col gap-4">
							<!-- 搜索框 -->
							<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
								<v-form class="relative" @submit.prevent="resetPaging">
									<div class="relative group">
										<input
											v-model="queryParams.keyword"
											type="search"
											placeholder="搜索文章标题、内容..."
											class="w-full h-11 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
											@keyup.enter="resetPaging"
										/>
										<Icon
											name="fa-solid fa-magnifying-glass"
											class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
										/>
									</div>
								</v-form>
							</div>

							<!-- 分类卡片 -->
							<Card title="分类" icon="fa-solid fa-hashtag">
								<div class="mt-3 space-y-2">
									<div
										v-for="item in categories"
										:key="item.id"
										class="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200"
										:class="
											queryParams.categoryId === item.id
												? 'bg-indigo-50 text-indigo-600 border-indigo-200'
												: 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
										"
										@click="() => SelectCategory(item)"
									>
										{{ item.name }}
									</div>
								</div>
							</Card>

							<!-- 热门文章 -->
							<Information
								title="热门"
								icon="fa-solid fa-fire"
								type="ranking"
								:data="pageData.ranking"
							/>

							<!-- 置顶文章 -->
							<Information
								title="置顶"
								icon="fa-solid fa-seedling"
								type="topping"
								:data="pageData.topping"
							/>
						</div>
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
import Icon from "~/components/Icon/index.vue";
import articleApi from "~/api/article";
import Card from "../_components/Card.vue";
import Information from "../_components/Information.vue";

// Banner
const { data: banner } = await useAsyncData(() => articleApi.banner(), {
	default() {
		return [] as _AppHomingAdv[];
	},
});

// 页面数据
const { data: pageData } = await useAsyncData(() => articleApi.pages(), {
	default() {
		return {} as ArticlePagesResponse;
	},
});

// 分类
const { data: categories } = await useAsyncData(
	() => articleApi.categories(),
	{
		default() {
			return [] as Categories[];
		},
	}
);

// 查询参数
const queryParams = reactive<any>({
	keyword: "",
	categoryId: null,
});

// 分页查询
const { pager, queryLists, resetPaging } = usePaging<ArticleListsResponse>({
	fetchFun: articleApi.lists,
	params: queryParams,
});

const SelectCategory = (item: Categories) => {
	queryParams.categoryId = item.id;
	resetPaging();
};

onMounted(async () => {
	await queryLists();
});
</script>

<style scoped>
/* 行数限制 */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

::-webkit-scrollbar-track {
	background: #f1f5f9;
	border-radius: 4px;
}

::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: #94a3b8;
}

/* 响应式调整 */
@media (max-width: 640px) {
	.grid-cols-\[200px_1fr\] {
		grid-template-columns: 1fr;
	}
}
</style>