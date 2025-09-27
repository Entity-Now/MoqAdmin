<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full">
				<Information
					class="w-full !h-[420px]"
					type="adv"
					:data="banner"
					height="420px" />
				<div class="grid grid-cols-[1fr_320px] gap-4 px-4 my-4 max-w-[1440px] mx-auto">
					<div class="flex flex-col gap-2">
						<div class="grid gap-6 md:gap-8">
							<article
								v-for="item in pager.lists"
								:key="item.id"
								class="group relative rounded-2xl bg-gradient-to-br from-[#f0f4ff] to-white dark:from-gray-800/50 dark:to-[#1a237e]/30 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-white/20 dark:border-gray-700">
								<!-- 图片容器 -->
								<div class="flex gap-6 items-start w-full h-full">
									<NuxtLink
										:to="`/article/detail/${item.id}`"
										class="relative block w-48 flex-none transition-transform duration-500 hover:scale-95">
										<el-image
											:src="item.image"
											class="aspect-video object-cover rounded-md">
											<template #error>
												<div
													class="h-full flex items-center justify-center bg-gray-100 text-gray-400">
													<Icon
														name="fa-solid fa-image"
														class="text-2xl" />
												</div>
											</template>
										</el-image>
									</NuxtLink>

									<!-- 内容容器 -->
									<div class="flex-1 relative h-full">
										<div
											class="absolute top-0 left-0 w-full h-full flex flex-col gap-2">
											<!-- 标题 -->
											<NuxtLink
												:to="`/article/detail/${item.id}`"
												class="text-lg font-semibold hover:text-custom-primary">
												{{ item.title }}
											</NuxtLink>

											<!-- 简介 -->
											<p
												class="text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
												{{ item.intro }}
											</p>

											<!-- 元数据 -->
											<div
												class="mt-auto flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
												<div
													class="flex items-center gap-1.5">
													<Icon
														name="fa-regular fa-calendar"
														class="text-sm" />
													<time>{{
														item.create_time
													}}</time>
												</div>
												<div
													class="flex items-center gap-1.5">
													<Icon
														name="fa-regular fa-eye"
														class="text-sm" />
													<span
														>{{
															item.browse
														}}次阅读</span
													>
												</div>
											</div>
										</div>
									</div>
								</div>
							</article>
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<v-form class="flex items-center">
							<div class="group relative w-full">
								<!-- 添加相对定位容器 -->
								<div
									class="flex bg-white dark:bg-indigo-300 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.01]">
									<input
										class="w-full h-10 px-4 bg-transparent border-none placeholder:text-slate-600 focus:ring-0 focus:outline-none text-slate-800 placeholder:transition placeholder:duration-300 focus:placeholder:opacity-50"
										v-model="queryParams.keyword"
										placeholder="Search docs"
										@keyup.enter="resetPaging" />
									<button
										class="flex items-center justify-center w-12 h-10 bg-slate-400 hover:bg-indigo-400 transition-colors duration-200 rounded-r-lg border-l border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
										type="submit">
										<Icon
											name="fa-solid fa-magnifying-glass"
											class="text-white/90 hover:text-white transition-colors text-[16px]" />
									</button>
								</div>
							</div>
						</v-form>

						<Card
							title="分类"
							icon="fa-solid fa-hashtag">
							<div class="mt-2 flex flex-row gap-2">
								<div
									v-for="item in categories"
									:key="item.id"
									class="group flex-1 cursor-pointer rounded-md border border-slate-300 p-2 hover:bg-indigo-300"
									@click="() => SelectCategory(item)">
									<div
										class="group-hover:-translate-x-[-2px] transition-all duration-300 ease-in-out">
										{{ item.name }}
									</div>
								</div>
							</div>
						</Card>
						<Information
							title="热门"
							icon="fa-solid fa-fire"
							type="ranking"
							:data="pageData.ranking" />
						<Information
							title="置顶"
							icon="fa-solid fa-seedling"
							type="topping"
							:data="pageData.topping" />
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
