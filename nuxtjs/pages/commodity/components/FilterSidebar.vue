<template>
	<div class="sidebar-container space-y-8 pr-4">
		<!-- 分类筛选 (Nike Style: Sticky Section) -->
		<section class="filter-section z-10 bg-white pb-4">
			<h3
				class="text-[16px] font-semibold text-black mb-4 flex items-center justify-between">
				商品分类
			</h3>
			<nav class="space-y-1">
				<button
					type="button"
					class="w-full text-left py-1 text-[15px] transition-colors"
					:class="
						queryParams.categoryId === null
							? 'font-semibold text-black'
							: 'text-gray-600 hover:text-black'
					"
					@click="handleCategoryChange(null)">
					全部商品
				</button>

				<div
					v-for="category in categories"
					:key="category.id"
					class="category-item">
					<button
						type="button"
						class="w-full flex items-center justify-between py-1 text-[15px] transition-colors"
						:class="
							isParentActive(category)
								? 'font-semibold text-black'
								: 'text-gray-600 hover:text-black'
						"
						@click="toggleCategory(category.id)">
						<span>{{ category.name }}</span>
						<Icon
							v-if="category.children?.length"
							:name="
								expandedCategories.includes(category.id)
									? 'fa-solid fa-chevron-up'
									: 'fa-solid fa-chevron-down'
							"
							class="text-[10px]" />
					</button>

					<div
						v-if="
							category.children?.length &&
							expandedCategories.includes(category.id)
						"
						class="pl-4 space-y-1 mt-1">
						<button
							v-for="child in category.children"
							:key="child.id"
							type="button"
							class="w-full text-left py-1 text-[14px] transition-colors"
							:class="
								queryParams.categoryId === child.id
									? 'font-semibold text-black'
									: 'text-gray-500 hover:text-black'
							"
							@click="handleCategoryChange(child.id)">
							{{ child.name }}
						</button>
					</div>
				</div>
			</nav>
		</section>

		<!-- 价格筛选 (Minimalist form) -->
		<section class="filter-section border-t border-gray-100 pt-8">
			<h3 class="text-[16px] font-semibold text-black mb-4">价格</h3>
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div class="relative flex-1">
						<span
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-serif italic"
							>¥</span
						>
						<input
							v-model.number="localPriceRange.min"
							type="number"
							placeholder="最低"
							class="w-full h-10 pl-7 pr-3 text-sm border border-gray-200 focus:border-black outline-none transition-colors" />
					</div>
					<span class="text-gray-300">－</span>
					<div class="relative flex-1">
						<span
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-serif italic"
							>¥</span
						>
						<input
							v-model.number="localPriceRange.max"
							type="number"
							placeholder="最高"
							class="w-full h-10 pl-7 pr-3 text-sm border border-gray-200 focus:border-black outline-none transition-colors" />
					</div>
				</div>
				<div class="flex gap-2">
					<button
						class="flex-1 h-10 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
						@click="handleFilterApply">
						确认
					</button>
					<button
						v-if="hasActiveFilters"
						class="px-3 h-10 border border-gray-200 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
						@click="handleFilterReset">
						重置
					</button>
				</div>
			</div>
		</section>

		<!-- 热门/推荐 (Merged into sidebar) -->
		<section
			v-if="pageData.ranking?.length"
			class="filter-section border-t border-gray-100 pt-8">
			<h3 class="text-[16px] font-semibold text-black mb-4">热门推荐</h3>
			<div class="grid grid-cols-1 gap-4">
				<NuxtLink
					v-for="item in pageData.ranking.slice(0, 5)"
					:key="item.id"
					:to="`/commodity/detail/${item.id}`"
					class="group flex gap-3">
					<div class="w-16 h-16 bg-gray-50 overflow-hidden shrink-0">
						<el-image
							:src="
								item.image?.[0] ||
								`/static/default/images/no-img.png`
							"
							fit="cover"
							class="w-full h-full transition-transform group-hover:scale-105"
							lazy />
					</div>
					<div class="flex-1 min-w-0 flex flex-col justify-center">
						<h4
							class="text-[13px] text-gray-800 line-clamp-2 leading-tight group-hover:text-black transition-colors">
							{{ item.title }}
						</h4>
						<p class="mt-1 text-[13px] font-semibold text-black">
							¥{{ formatPrice(item.price) }}
						</p>
					</div>
				</NuxtLink>
			</div>
		</section>

		<!-- 广告位 (Minimalist Banner in Sidebar) -->
		<section
			v-if="pageData.adv?.length"
			class="filter-section border-t border-gray-100 pt-8">
			<div class="relative aspect-3/4 bg-gray-100 overflow-hidden group">
				<el-image
					:src="pageData.adv[0].image"
					fit="cover"
					class="w-full h-full transition-transform duration-700 group-hover:scale-105" />
				<div
					class="absolute inset-0 bg-black/5 flex flex-col justify-end p-4">
					<h4
						class="text-white font-bold text-lg leading-tight uppercase tracking-tighter">
						{{ pageData.adv[0].title || "专题推荐" }}
					</h4>
					<NuxtLink
						:to="pageData.adv[0].url || '#'"
						class="mt-2 text-white text-[11px] font-bold uppercase tracking-widest underline underline-offset-4">
						查看详情
					</NuxtLink>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import type {
		CommodityCategory,
		CommodityPagesResponse,
	} from "~/api/commodity/types.d";

	interface Props {
		categories: CommodityCategory[];
		pageData: CommodityPagesResponse;
		queryParams: {
			categoryId: number | null;
			minPrice: number | null;
			maxPrice: number | null;
			keyword: string;
		};
		priceRange: {
			min: string | number;
			max: string | number;
		};
	}

	const props = defineProps<Props>();
	const emit = defineEmits(["update:priceRange", "change", "reset"]);

	const expandedCategories = ref<number[]>([]);

	const localPriceRange = computed({
		get: () => props.priceRange,
		set: (val) => emit("update:priceRange", val),
	});

	const hasActiveFilters = computed(() => {
		return (
			props.queryParams.categoryId !== null ||
			props.queryParams.minPrice !== null ||
			props.queryParams.maxPrice !== null ||
			props.queryParams.keyword !== ""
		);
	});

	const isParentActive = (category: CommodityCategory) => {
		if (props.queryParams.categoryId === category.id) return true;
		if (category.children) {
			return category.children.some(
				(child) => child.id === props.queryParams.categoryId
			);
		}
		return false;
	};

	const toggleCategory = (categoryId: number) => {
		const index = expandedCategories.value.indexOf(categoryId);
		if (index > -1) {
			expandedCategories.value.splice(index, 1);
		} else {
			expandedCategories.value.push(categoryId);
		}
	};

	const handleCategoryChange = (categoryId: number | null) => {
		emit("change", { ...props.queryParams, categoryId });
	};

	const handleFilterApply = () => {
		const minPrice = localPriceRange.value.min
			? Number(localPriceRange.value.min)
			: null;
		const maxPrice = localPriceRange.value.max
			? Number(localPriceRange.value.max)
			: null;
		emit("change", { ...props.queryParams, minPrice, maxPrice });
	};

	const handleFilterReset = () => {
		emit("reset");
	};

	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(0);
	};

	onMounted(() => {
		if (props.queryParams.categoryId) {
			props.categories.forEach((category) => {
				if (
					category.children?.some(
						(child) => child.id === props.queryParams.categoryId
					)
				) {
					expandedCategories.value.push(category.id);
				}
			});
		}
	});
</script>

<style scoped>
	.sidebar-container {
		height: 100%;
		overflow-y: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
		position: sticky;
		top: 0;
	}
	.sidebar-container::-webkit-scrollbar {
		display: none;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
