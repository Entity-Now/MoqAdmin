<template>
	<div class="w-full">
		<!-- 结果计数 -->
		<div
			v-if="pager.lists.length > 0"
			class="flex items-center justify-between mb-8">
			<h2
				class="text-xl font-nike font-bold tracking-tight text-foreground uppercase">
				{{ pager.total }} Results
			</h2>
			<div class="flex items-center gap-4 text-sm">
				<button
					class="hidden lg:flex items-center gap-2 hover:opacity-60 transition-opacity font-medium"
					@click="$emit('toggleFilter')">
					<span>{{
						showSidebar ? "Hide Filters" : "Show Filters"
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
			class="flex flex-col items-center justify-center py-16 gap-4">
			<div
				class="w-8 h-8 border-2 border-secondary border-t-primary rounded-full animate-spin"></div>
			<span
				class="text-xs uppercase tracking-widest font-bold text-muted-foreground"
				>Loading Your Selection...</span
			>
		</div>

		<!-- 加载触发器 (Intersection Observer target) -->
		<div
			v-if="!pager.finished && pager.lists.length > 0"
			ref="loadMoreTrigger"
			class="h-4"></div>

		<!-- 全部载入完毕 -->
		<div
			v-if="pager.finished && pager.lists.length > 0"
			class="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
			<div class="w-16 h-px bg-border mb-6"></div>
			<span class="text-[10px] uppercase tracking-[0.3em] font-bold"
				>End of Selection</span
			>
		</div>

		<!-- 空状态 -->
		<div
			v-if="!pager.loading && pager.lists.length === 0"
			class="flex flex-col items-center justify-center py-40 text-center">
			<Icon
				name="fa-solid fa-search"
				class="text-5xl text-secondary mb-6" />
			<h3 class="text-2xl font-nike font-bold text-primary mb-3">
				No Results Found
			</h3>
			<p class="text-muted-foreground mb-8 max-w-xs mx-auto">
				We couldn't find what you're looking for. Try adjusting your
				filters or search terms.
			</p>
			<button
				v-if="hasActiveFilters"
				type="button"
				class="text-sm font-bold uppercase tracking-widest underline underline-offset-8 hover:opacity-60 transition-opacity"
				@click="$emit('reset')">
				Clear All Filters
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
