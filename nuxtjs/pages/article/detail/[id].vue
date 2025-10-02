<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full min-h-screen bg-gray-50">
				<!-- 文章头图区域 -->
				<div class="relative w-full h-[420px] overflow-hidden bg-gray-900">
					<!-- 背景图片 -->
					<el-image
						class="w-full h-full object-cover"
						:src="details.image"
					>
						<template #error>
							<div class="h-full flex items-center justify-center bg-gray-900 text-gray-400">
								<Icon name="fa-solid fa-image" class="text-5xl" />
							</div>
						</template>
					</el-image>

					<!-- 毛玻璃遮罩层 -->
					<div class="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-indigo-900/60 backdrop-blur-sm">
						<!-- 内容容器 -->
						<div class="h-full flex flex-col justify-center items-center px-8 py-12">
							<!-- 文章信息 -->
							<div class="max-w-4xl w-full mx-auto text-center space-y-6">
								<!-- 标题 -->
								<h1 class="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
									{{ details.title }}
								</h1>
								
								<!-- 简介 -->
								<p class="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto px-4">
									{{ details.intro }}
								</p>

								<!-- 元信息 -->
								<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
									<div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
										<Icon name="fa-solid fa-eye" class="text-sm" />
										<span class="text-sm font-medium">{{ details.browse }} 阅读</span>
									</div>
									<div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
										<Icon name="fa-solid fa-calendar" class="text-sm" />
										<time class="text-sm font-medium">{{ details.create_time }}</time>
									</div>
									<button
										type="button"
										class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
										:class="details.is_collect ? 'text-amber-400' : 'text-white'"
										@click.prevent.stop="handleCollect()"
									>
										<Icon
											:name="details.is_collect ? 'fa-solid fa-star' : 'fa-regular fa-star'"
											class="text-sm"
										/>
										<span class="text-sm font-medium">
											{{ details.is_collect ? '已收藏' : '收藏' }}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 主体内容区 -->
				<div class="max-w-[1440px] mx-auto px-4 py-6">
					<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
						<!-- 左侧：文章内容 -->
						<main class="space-y-4">
							<!-- 文章正文 -->
							<article class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
								<div class="prose prose-sm md:prose-base max-w-none" v-html="details.content"></div>
							</article>

							<!-- 上一篇/下一篇导航 -->
							<nav class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<!-- 上一篇 -->
								<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
									<div class="flex items-start gap-3">
										<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
											<Icon name="fa-solid fa-arrow-left" class="text-sm" />
										</div>
										<div class="flex-1 min-w-0">
											<div class="text-xs text-gray-500 mb-1">上一篇</div>
											<NuxtLink
												v-if="details.prev?.id"
												class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
												:to="`/article/detail/${details.prev?.id}`"
												:title="details.prev?.title"
											>
												{{ details.prev?.title }}
											</NuxtLink>
											<span v-else class="text-sm text-gray-400">暂无上一篇</span>
										</div>
									</div>
								</div>

								<!-- 下一篇 -->
								<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
									<div class="flex items-start gap-3">
										<div class="flex-1 min-w-0 text-right">
											<div class="text-xs text-gray-500 mb-1">下一篇</div>
											<NuxtLink
												v-if="details.next?.id"
												class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
												:to="`/article/detail/${details.next?.id}`"
												:title="details.next?.title"
											>
												{{ details.next?.title }}
											</NuxtLink>
											<span v-else class="text-sm text-gray-400">暂无下一篇</span>
										</div>
										<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
											<Icon name="fa-solid fa-arrow-right" class="text-sm" />
										</div>
									</div>
								</div>
							</nav>
						</main>

						<!-- 右侧：侧边栏 -->
						<aside class="space-y-4">
							<!-- 分类卡片 -->
							<Card title="分类" icon="fa-solid fa-hashtag">
								<div class="mt-3 grid grid-cols-2 gap-2">
									<div
										v-for="item in categories"
										:key="item.id"
										class="cursor-pointer px-3 py-2 text-sm font-medium text-center rounded-lg border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
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

							<!-- 广告位 -->
							<Information
								:visibleAvgTitle="false"
								type="adv"
								:data="pageData.adv"
							/>
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

const route = useRoute();
const userStore = useUserStore();
const articleId = parseInt(String(route.params.id));

/**
 * 文章数据
 */
const { data: details, refresh } = useAsyncData(
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
	} else {
		await articleApi.collect(articleId);
		feedback.msgSuccess("收藏成功");
		details.value.is_collect = 1;
	}
};

const SelectCategory = (item: Categories) => {
	alert("请实现此代码的实现！");
};
</script>

<style scoped>
/* 文章内容样式优化 */
.prose {
	color: #374151;
	line-height: 1.75;
}

.prose :deep(img) {
	max-width: 100%;
	height: auto;
	border-radius: 0.75rem;
	margin: 2rem 0;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.prose :deep(p) {
	margin: 1.25rem 0;
	font-size: 1rem;
	line-height: 1.8;
}

.prose :deep(h1) {
	font-size: 2rem;
	font-weight: 700;
	margin-top: 2.5rem;
	margin-bottom: 1.25rem;
	color: #111827;
	line-height: 1.3;
}

.prose :deep(h2) {
	font-size: 1.75rem;
	font-weight: 600;
	margin-top: 2rem;
	margin-bottom: 1rem;
	color: #111827;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #e5e7eb;
}

.prose :deep(h3) {
	font-size: 1.5rem;
	font-weight: 600;
	margin-top: 1.75rem;
	margin-bottom: 0.75rem;
	color: #1f2937;
}

.prose :deep(h4) {
	font-size: 1.25rem;
	font-weight: 600;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	color: #1f2937;
}

.prose :deep(ul),
.prose :deep(ol) {
	margin: 1.25rem 0;
	padding-left: 1.75rem;
}

.prose :deep(li) {
	margin: 0.5rem 0;
	line-height: 1.75;
}

.prose :deep(ul > li) {
	list-style-type: disc;
}

.prose :deep(ol > li) {
	list-style-type: decimal;
}

.prose :deep(blockquote) {
	margin: 1.5rem 0;
	padding: 1rem 1.5rem;
	border-left: 4px solid #6366f1;
	background: #f9fafb;
	font-style: italic;
	color: #4b5563;
}

.prose :deep(code) {
	padding: 0.2rem 0.4rem;
	background: #f3f4f6;
	border-radius: 0.25rem;
	font-size: 0.875em;
	color: #dc2626;
	font-family: 'Courier New', monospace;
}

.prose :deep(pre) {
	margin: 1.5rem 0;
	padding: 1.25rem;
	background: #1f2937;
	border-radius: 0.5rem;
	overflow-x: auto;
}

.prose :deep(pre code) {
	background: transparent;
	color: #e5e7eb;
	padding: 0;
}

.prose :deep(table) {
	width: 100%;
	margin: 1.5rem 0;
	border-collapse: collapse;
	font-size: 0.9375rem;
}

.prose :deep(th) {
	padding: 0.75rem;
	background: #f3f4f6;
	border: 1px solid #e5e7eb;
	font-weight: 600;
	text-align: left;
}

.prose :deep(td) {
	padding: 0.75rem;
	border: 1px solid #e5e7eb;
}

.prose :deep(a) {
	color: #6366f1;
	text-decoration: none;
	transition: color 0.2s;
}

.prose :deep(a:hover) {
	color: #4f46e5;
	text-decoration: underline;
}

.prose :deep(hr) {
	margin: 2rem 0;
	border: none;
	border-top: 2px solid #e5e7eb;
}

/* 行数限制 */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* 滚动条样式 */
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
</style>