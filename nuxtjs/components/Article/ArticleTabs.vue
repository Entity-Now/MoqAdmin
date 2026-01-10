<template>
	<div class="w-full">
		<!-- 顶部 Tabs -->
		<div
			class="flex flex-wrap gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
			<button
				v-for="tab in allTabs"
				:key="tab.value"
				type="button"
				class="cursor-pointer px-10 py-4 text-sm font-nike tracking-widest uppercase rounded-full transition-all duration-500 whitespace-nowrap border-0"
				:class="[
					activeTab === tab.value
						? 'bg-primary text-primary-foreground shadow-2xl scale-105'
						: 'bg-secondary/50 backdrop-blur-md text-foreground/60 hover:text-primary hover:bg-secondary',
				]"
				@click="activeTab = tab.value">
				{{ tab.label }}
			</button>
		</div>

		<!-- 文章网格 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			<article
				v-for="article in filteredArticles"
				:key="article.id"
				class="group relative flex flex-col bg-background rounded-4xl overflow-hidden border border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
				<!-- Image Area -->
				<NuxtLink
					:to="`/article/detail/${article.id}`"
					class="block relative overflow-hidden aspect-4/5 bg-secondary/20">
					<img
						:src="article.image || '/placeholder.jpg'"
						:alt="article.title"
						class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
						loading="lazy" />

					<!-- Category Tag (Glassmorphism) -->
					<div class="absolute top-6 left-6 z-20">
						<span
							class="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/20 dark:bg-black/20 backdrop-blur-xl text-white border border-white/30 shadow-xl">
							{{ article.category }}
						</span>
					</div>

					<!-- Overlay -->
					<div
						class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

					<!-- Content Overlay inside Image Area for a unique look -->
					<div
						class="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
						<div
							class="flex items-center gap-4 text-[10px] font-bold tracking-widest text-white/60 mb-4 uppercase">
							<span>{{
								dayjs(article.create_time).format(
									"YYYY年MM月DD日"
								)
							}}</span>
							<span
								class="w-1 h-1 rounded-full bg-white/40"></span>
							<span>{{ article.browse }} 次阅读</span>
						</div>
						<h3
							class="text-2xl font-nike tracking-tight text-white line-clamp-2 leading-tight">
							{{ article.title }}
						</h3>
					</div>
				</NuxtLink>

				<!-- Hidden Intro revealed on hover or just below -->
				<div class="p-8 space-y-4 bg-background">
					<p
						class="text-muted-foreground text-sm leading-relaxed line-clamp-2">
						{{
							article.intro ||
							"探索更多关于此话题的精彩内容，保持领先。"
						}}
					</p>

					<NuxtLink
						:to="`/article/detail/${article.id}`"
						class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary group/link">
						阅读更多
						<Icon
							name="fas fa-arrow-right"
							class="w-3 h-3 transition-transform duration-500 group-hover/link:translate-x-2" />
					</NuxtLink>
				</div>
			</article>
		</div>

		<!-- 空状态 -->
		<div
			v-if="filteredArticles.length === 0"
			class="flex flex-col items-center justify-center py-40 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-secondary">
			<Icon
				name="fas fa-inbox"
				class="text-6xl text-muted-foreground/20 mb-6" />
			<p class="text-2xl font-nike tracking-tight text-muted-foreground">
				该分类下暂无相关文章。
			</p>
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
