<template>
	<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<!-- 顶部 Tabs -->
			<div class="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2">
				<button
					v-for="tab in allTabs"
					:key="tab.value"
					type="button"
					class="cursor-pointer px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap"
					:class="{
						'bg-indigo-600 text-white shadow-lg':
							activeTab === tab.value,
						'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700':
							activeTab !== tab.value,
					}"
					@click="activeTab = tab.value">
					{{ tab.label }}
				</button>
			</div>

			<!-- 文章网格 -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				<article
					v-for="article in filteredArticles"
					:key="article.id"
					class="group relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 dark:border-slate-700">
					<!-- Category Tag -->
					<div class="absolute top-4 left-4 z-20">
						<span
							class="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700">
							{{ article.category }}
						</span>
					</div>

					<!-- Image Area -->
					<NuxtLink
						:to="`/article/detail/${article.id}`"
						class="block relative overflow-hidden aspect-4/3">
						<img
							:src="article.image || '/placeholder.jpg'"
							:alt="article.title"
							class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
							loading="lazy" />
						<!-- Overlay -->
						<div
							class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					</NuxtLink>

					<!-- Content Area -->
					<div class="flex flex-col flex-1 p-6">
						<!-- Meta Info -->
						<div
							class="flex items-center gap-3 text-xs text-slate-400 mb-3">
							<div class="flex items-center gap-1">
								<Icon
									name="fa-solid fa-calendar"
									class="w-3 h-3" />
								<span>{{
									dayjs(article.create_time).format(
										"MMM D, YYYY"
									)
								}}</span>
							</div>
							<span
								class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
							<div class="flex items-center gap-1">
								<Icon
									name="fa-solid fa-eye"
									class="w-3 h-3" />
								<span>{{ article.browse }} views</span>
							</div>
						</div>

						<!-- Title -->
						<NuxtLink
							:to="`/article/detail/${article.id}`"
							class="block mb-3 text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
							{{ article.title }}
						</NuxtLink>

						<!-- Intro -->
						<p
							class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
							{{ article.intro || "暂无简介" }}
						</p>

						<!-- Read More Link -->
						<div
							class="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group/link">
							Read Article
							<Icon
								name="fas fa-arrow-right"
								class="ml-2 w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-1" />
						</div>
					</div>
				</article>
			</div>

			<!-- 空状态 -->
			<div
				v-if="filteredArticles.length === 0"
				class="col-span-full text-center py-20">
				<p class="text-xl text-gray-500 dark:text-gray-400">
					暂无相关文章
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import dayjs from "dayjs";

	// Props
	const props = defineProps({
		data: {
			type: Object,
			required: true,
			default: () => ({ ranking: [], lately: [], everyday: [] }),
		},
	});

	// 所有文章去重合并
	const allArticles = computed(() => {
		const map = new Map();
		[
			...props.data.ranking,
			...props.data.lately,
			...props.data.everyday,
		].forEach((item) => {
			if (!map.has(item.id)) {
				map.set(item.id, item);
			}
		});
		return Array.from(map.values());
	});

	// 动态分类标签
	const categories = computed(() => {
		const set = new Set();
		allArticles.value.forEach((item) => set.add(item.category));
		return Array.from(set).map((cat) => ({ label: cat, value: cat }));
	});

	// 所有 Tabs（固定 + 动态分类）
	const allTabs = computed(() => [
		{ label: "全部", value: "all" },
		{ label: "排行榜", value: "ranking" },
		{ label: "最近更新", value: "lately" },
		{ label: "今日推荐", value: "everyday" },
		...categories.value,
	]);

	// 当前激活 Tab
	const activeTab = ref("all");

	// 过滤后的文章
	const filteredArticles = computed(() => {
		if (activeTab.value === "all") return allArticles.value;
		if (["ranking", "lately", "everyday"].includes(activeTab.value)) {
			return props.data[activeTab.value] || [];
		}
		return allArticles.value.filter(
			(item) => item.category === activeTab.value
		);
	});
</script>
