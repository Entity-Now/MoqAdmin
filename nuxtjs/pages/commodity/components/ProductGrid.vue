<template>
	<div class="w-full">
		<!-- 结果计数 -->
		<div
			v-if="pager.lists.length > 0"
			class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-medium text-black">
				商品列表 ({{ pager.total }})
			</h2>
			<div class="flex items-center gap-4 text-sm">
				<!-- Sort/Filter toggles could go here like Nike -->
				<button
					class="hidden lg:flex items-center gap-2 hover:text-gray-500 transition-colors"
					@click="$emit('toggleFilter')">
					<span>{{
						showSidebar ? "隐藏筛选条件" : "显示筛选条件"
					}}</span>
					<Icon name="fa-solid fa-sliders-h" />
				</button>
			</div>
		</div>

		<!-- 商品网格 -->
		<div class="product-grid">
			<ProductCard
				v-for="item in pager.lists"
				:key="item.id"
				:item="item" />
		</div>

		<!-- 加载状态 -->
		<div
			v-if="pager.loading"
			class="flex flex-col items-center justify-center py-12 gap-3">
			<div
				class="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
			<span class="text-sm text-gray-400">正在为您加载...</span>
		</div>

		<!-- 加载触发器 (Intersection Observer target) -->
		<div
			v-if="!pager.finished && pager.lists.length > 0"
			ref="loadMoreTrigger"
			class="h-4"></div>

		<!-- 全部载入完毕 -->
		<div
			v-if="pager.finished && pager.lists.length > 0"
			class="flex flex-col items-center justify-center py-16 text-gray-400">
			<div class="w-12 h-px bg-gray-100 mb-4"></div>
			<span class="text-xs uppercase tracking-widest font-medium"
				>已经到底了</span
			>
		</div>

		<!-- 空状态 -->
		<div
			v-if="!pager.loading && pager.lists.length === 0"
			class="flex flex-col items-center justify-center py-32 text-center">
			<Icon
				name="fa-solid fa-search"
				class="text-4xl text-gray-200 mb-4" />
			<h3 class="text-lg font-medium text-black mb-2">未找到相关商品</h3>
			<p class="text-sm text-gray-500 mb-6">试试调整您的搜索或筛选条件</p>
			<button
				v-if="hasActiveFilters"
				type="button"
				class="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
				@click="$emit('reset')">
				清除所有筛选
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import ProductCard from "./ProductCard.vue";

	interface Props {
		pager: any;
		hasActiveFilters: boolean;
		showSidebar?: boolean;
	}

	const props = defineProps<Props>();
	const emit = defineEmits(["loadMore", "reset", "toggleFilter"]);

	const loadMoreTrigger = ref<HTMLElement | null>(null);
	let observer: IntersectionObserver | null = null;

	const loadMore = () => {
		emit("loadMore");
	};

	onMounted(() => {
		// 创建 Intersection Observer 来监听触发器元素
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// 当触发器元素进入视口且未在加载中且未完成时,触发加载
					if (
						entry.isIntersecting &&
						!props.pager.loading &&
						!props.pager.finished
					) {
						loadMore();
					}
				});
			},
			{
				rootMargin: "200px", // 提前 200px 开始加载
				threshold: 0,
			}
		);

		// 开始观察触发器元素
		if (loadMoreTrigger.value) {
			observer.observe(loadMoreTrigger.value);
		}
	});

	onBeforeUnmount(() => {
		// 清理 observer
		if (observer) {
			observer.disconnect();
		}
	});

	// 监听触发器元素的变化,重新观察
	watch(loadMoreTrigger, (newVal, oldVal) => {
		if (observer) {
			if (oldVal) {
				observer.unobserve(oldVal);
			}
			if (newVal) {
				observer.observe(newVal);
			}
		}
	});
</script>

<style scoped>
	.product-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	@media (min-width: 768px) {
		.product-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
		}
	}

	@media (min-width: 1024px) {
		.product-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	/* If sidebar is hidden, we can increase columns */
	:global(.no-sidebar) .product-grid {
		@media (min-width: 1280px) {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
