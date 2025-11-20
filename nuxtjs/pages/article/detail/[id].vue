<template>
	<NuxtLayout name="default">
		<template #container>
			<div
				class="w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
				<!-- 文章头图区域 -->
				<div
					class="relative w-full h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden bg-slate-900 group">
					<!-- 背景图片 -->
					<el-image
						class="w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-105"
						:src="details.image"
						fit="cover">
						<template #error>
							<div
								class="h-full flex items-center justify-center bg-slate-800 text-slate-600">
								<Icon
									name="fa-solid fa-image"
									class="text-5xl" />
							</div>
						</template>
					</el-image>

					<!-- 渐变遮罩层 -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
						<!-- 内容容器 -->
						<div
							class="h-full max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col justify-end pb-12 md:pb-16">
							<div
								class="max-w-4xl w-full space-y-4 md:space-y-6 animate-fade-in-up">
								<!-- 分类标签 -->
								<div
									v-if="details.category_name"
									class="inline-flex">
									<span
										class="px-3 py-1 bg-indigo-600/90 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-indigo-900/20">
										{{ details.category_name }}
									</span>
								</div>

								<!-- 标题 -->
								<h1
									class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
									{{ details.title }}
								</h1>

								<!-- 简介 -->
								<p
									class="text-sm md:text-lg text-slate-200 leading-relaxed max-w-3xl line-clamp-2 md:line-clamp-3 drop-shadow-md">
									{{ details.intro }}
								</p>

								<!-- 元信息 -->
								<div
									class="flex flex-wrap items-center gap-4 pt-2">
									<div
										class="flex items-center gap-2 text-slate-300 text-xs md:text-sm">
										<Icon name="fa-regular fa-calendar" />
										<time>{{ details.create_time }}</time>
									</div>
									<div
										class="flex items-center gap-2 text-slate-300 text-xs md:text-sm">
										<Icon name="fa-regular fa-eye" />
										<span>{{ details.browse }} 阅读</span>
									</div>

									<!-- 收藏按钮 -->
									<button
										type="button"
										class="ml-auto sm:ml-0 flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 active:scale-95"
										:class="
											details.is_collect
												? 'text-amber-400 border-amber-400/50 bg-amber-400/10'
												: 'text-white'
										"
										@click.prevent.stop="handleCollect()">
										<Icon
											:name="
												details.is_collect
													? 'fa-solid fa-star'
													: 'fa-regular fa-star'
											"
											class="text-sm" />
										<span
											class="text-xs md:text-sm font-medium">
											{{
												details.is_collect
													? "已收藏"
													: "收藏"
											}}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12">
					<div
						class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 md:gap-12">
						<!-- 左侧：文章内容 -->
						<main class="min-w-0">
							<!-- 文章正文 -->
							<article
								class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-10 mb-8">
								<div
									class="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
									v-html="details.content"></div>
							</article>

							<!-- 上一篇/下一篇导航 -->
							<nav class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<!-- 上一篇 -->
								<NuxtLink
									v-if="details.prev?.id"
									:to="`/article/detail/${details.prev?.id}`"
									class="group flex items-start gap-4 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-300">
									<div
										class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
										<Icon
											name="fa-solid fa-arrow-left"
											class="text-sm" />
									</div>
									<div class="flex-1 min-w-0">
										<div
											class="text-xs text-slate-400 mb-1">
											上一篇
										</div>
										<div
											class="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
											{{ details.prev?.title }}
										</div>
									</div>
								</NuxtLink>
								<div
									v-else
									class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
									没有上一篇了
								</div>

								<!-- 下一篇 -->
								<NuxtLink
									v-if="details.next?.id"
									:to="`/article/detail/${details.next?.id}`"
									class="group flex flex-row-reverse sm:flex-row items-start gap-4 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-300">
									<div
										class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
										<Icon
											name="fa-solid fa-arrow-right"
											class="text-sm" />
									</div>
									<div
										class="flex-1 min-w-0 text-left sm:text-right">
										<div
											class="text-xs text-slate-400 mb-1">
											下一篇
										</div>
										<div
											class="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
											{{ details.next?.title }}
										</div>
									</div>
								</NuxtLink>
								<div
									v-else
									class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
									没有下一篇了
								</div>
							</nav>
						</main>

						<!-- 右侧：侧边栏 -->
						<aside class="space-y-6">
							<!-- 分类卡片 -->
							<Card
								title="相关分类"
								icon="fa-solid fa-hashtag">
								<div class="flex flex-wrap gap-2 mt-2">
									<NuxtLink
										v-for="item in categories"
										:key="item.id"
										:to="`/article/lists?categoryId=${item.id}`"
										class="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200"
										:class="
											details.category_id === item.id
												? 'bg-indigo-50 text-indigo-600 border-indigo-200'
												: 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
										">
										{{ item.name }}
									</NuxtLink>
								</div>
							</Card>

							<!-- 热门文章 -->
							<Information
								title="热门阅读"
								icon="fa-solid fa-fire"
								type="ranking"
								:data="pageData.ranking" />

							<!-- 广告位 -->
							<Information
								:visibleAvgTitle="false"
								type="adv"
								:data="pageData.adv"
								height="200px" />
						</aside>
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import articleApi from "~/api/article";
	import Card from "../_components/Card.vue";
	import Information from "../_components/Information.vue";
	import useUserStore from "~/stores/user";
	import feedback from "~/utils/feedback";

	const route = useRoute();
	const userStore = useUserStore();
	const articleId = parseInt(String(route.params.id));

	/**
	 * 文章数据
	 */
	const { data: details, refresh } = await useAsyncData(
		() => articleApi.detail(articleId),
		{
			default() {
				return {} as ArticleDetailResponse;
			},
		}
	);

	// 分类
	const { data: categories } = await useAsyncData(
		() => articleApi.categories(),
		{
			default() {
				return [] as Categories[];
			},
		}
	);

	/**
	 * 页面数据
	 */
	const { data: pageData } = await useAsyncData(() => articleApi.pages(), {
		default() {
			return {} as ArticlePagesResponse;
		},
	});

	/**
	 * 文章收藏
	 */
	const handleCollect = async () => {
		if (!userStore.isLogin) {
			feedback.msgError("请先登录");
			return;
		}
		if (details.value.is_collect) {
			await articleApi.collect(articleId);
			feedback.msgSuccess("取消成功");
			details.value.is_collect = 0;
		} else {
			await articleApi.collect(articleId);
			feedback.msgSuccess("收藏成功");
			details.value.is_collect = 1;
		}
	};

	useSeoMeta({
		title: () => details.value.title,
		description: () => details.value.intro,
	});
</script>

<style scoped>
	/* 动画 */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translate3d(0, 20px, 0);
		}
		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}

	.animate-fade-in-up {
		animation: fadeInUp 0.8s ease-out forwards;
	}
</style>
