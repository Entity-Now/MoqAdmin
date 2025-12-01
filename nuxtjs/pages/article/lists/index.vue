<template>
	<NuxtLayout name="default">
		<template #container>
			<div
				class="w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
				<!-- 顶部轮播图 -->
				<div class="w-full bg-white dark:bg-slate-800 shadow-sm">
					<div class="mx-auto">
						<Information
							class="w-full"
							type="adv"
							:data="banner"
							height="400px"
							:visibleAvgTitle="true" />
					</div>
				</div>

				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
					<div
						class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
						<!-- 左侧：文章列表 -->
						<div class="flex flex-col gap-6">
							<!-- 移动端分类 (仅在小屏幕显示) -->
							<div
								class="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
								<div class="flex gap-2">
									<button
										v-for="item in categories"
										:key="item.id"
										class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
										:class="
											queryParams.categoryId === item.id
												? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
												: 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
										"
										@click="() => SelectCategory(item)">
										{{ item.name }}
									</button>
								</div>
							</div>

							<!-- 文章列表 -->
							<div class="space-y-5">
								<article
									v-for="item in pager.lists"
									:key="item.id"
									class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
									<div
										class="flex flex-col sm:flex-row gap-5 p-5">
										<!-- 文章封面 -->
										<NuxtLink
											:to="`/article/detail/${item.id}`"
											class="relative block flex-shrink-0 w-full sm:w-[240px] md:w-[280px] aspect-video sm:aspect-[4/3] md:aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
											<el-image
												:src="item.image"
												:alt="item.title"
												class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
												loading="lazy">
												<template #error>
													<div
														class="h-full flex flex-col items-center justify-center text-slate-400">
														<Icon
															name="fa-solid fa-image"
															class="text-3xl mb-2" />
													</div>
												</template>
											</el-image>

											<!-- 移动端显示的分类标签 -->
											<div
												class="absolute top-2 left-2 sm:hidden">
												<span
													class="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs text-white font-medium">
													{{
														item.category_name ||
														"文章"
													}}
												</span>
											</div>
										</NuxtLink>

										<!-- 文章内容 -->
										<div
											class="flex-1 flex flex-col min-w-0 py-1">
											<div class="flex-1 space-y-3">
												<!-- 标题 -->
												<NuxtLink
													:to="`/article/detail/${item.id}`"
													class="block">
													<h2
														class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
														{{ item.title }}
													</h2>
												</NuxtLink>

												<!-- 简介 -->
												<p
													class="text-sm sm:text-base text-slate-500 dark:text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
													{{ item.intro }}
												</p>
											</div>

											<!-- 底部元信息 -->
											<div
												class="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
												<div
													class="flex items-center gap-4 text-xs sm:text-sm text-slate-400">
													<div
														class="flex items-center gap-1.5">
														<Icon
															name="fa-regular fa-calendar" />
														<time>{{
															item.create_time?.split(
																" "
															)[0]
														}}</time>
													</div>
													<div
														class="flex items-center gap-1.5">
														<Icon
															name="fa-regular fa-eye" />
														<span>{{
															item.browse
														}}</span>
													</div>
												</div>

												<NuxtLink
													:to="`/article/detail/${item.id}`"
													class="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
													阅读全文
													<Icon
														name="fa-solid fa-arrow-right"
														class="text-xs" />
												</NuxtLink>
											</div>
										</div>
									</div>
								</article>
							</div>

							<!-- 空状态 -->
							<div
								v-if="pager.lists.length === 0"
								class="py-20 text-center">
								<div
									class="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
									<Icon
										name="fa-solid fa-inbox"
										class="text-3xl text-slate-400" />
								</div>
								<p class="text-slate-500">暂无相关文章</p>
							</div>

							<!-- 分页 -->
							<div
								v-if="pager.lists.length > 0"
								class="flex justify-center mt-8">
								<Paging
									v-model="pager"
									@change="queryLists" />
							</div>
						</div>

						<!-- 右侧：侧边栏 -->
						<aside
							class="hidden lg:flex flex-col gap-6 w-[320px] flex-shrink-0">
							<!-- 搜索框 -->
							<div
								class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
								<v-form
									class="relative"
									@submit.prevent="resetPaging">
									<div class="relative group">
										<input
											v-model="queryParams.keyword"
											type="search"
											placeholder="搜索感兴趣的内容..."
											class="w-full h-12 pl-12 pr-4 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
											@keyup.enter="resetPaging" />
										<Icon
											name="fa-solid fa-magnifying-glass"
											class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
									</div>
								</v-form>
							</div>

							<!-- 分类卡片 -->
							<Card
								title="文章分类"
								icon="fa-solid fa-layer-group">
								<div class="flex flex-wrap gap-2 mt-2">
									<button
										v-for="item in categories"
										:key="item.id"
										class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border"
										:class="
											queryParams.categoryId === item.id
												? 'bg-indigo-50 text-indigo-600 border-indigo-200'
												: 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
										"
										@click="() => SelectCategory(item)">
										{{ item.name }}
									</button>
								</div>
							</Card>

							<!-- 热门文章 -->
							<Information
								title="热门阅读"
								icon="fa-solid fa-fire"
								type="ranking"
								:data="pageData.ranking" />

							<!-- 置顶文章 -->
							<Information
								title="精选推荐"
								icon="fa-solid fa-thumbs-up"
								type="topping"
								:data="pageData.topping" />
						</aside>
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

	useSeoMeta({
		title: "文章列表",
	});

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
		// 如果点击已选中的分类，则取消选中
		if (queryParams.categoryId === item.id) {
			queryParams.categoryId = null;
		} else {
			queryParams.categoryId = item.id;
		}
		resetPaging();
	};

	onMounted(async () => {
		await queryLists();
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
</style>
