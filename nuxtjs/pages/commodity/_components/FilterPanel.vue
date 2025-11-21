<template>
	<div class="space-y-4">
		<!-- 分类筛选 -->
		<section
			class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-100">
				<h3 class="text-base font-semibold flex items-center gap-2">
					<Icon
						name="fa-solid fa-list"
						class="text-indigo-500 text-sm" />
					商品分类
				</h3>
			</div>
			<nav class="p-2">
				<ul class="space-y-1">
					<li>
						<button
							type="button"
							class="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
							:class="
								queryParams.categoryId === null
									? 'bg-indigo-50 text-indigo-600 font-medium'
									: 'text-gray-700 hover:bg-gray-50'
							"
							@click="handleCategoryChange(null)">
							全部商品
						</button>
					</li>
					<!-- 处理多级分类 -->
					<li
						v-for="category in categories"
						:key="category.id">
						<!-- 第一级分类 - 无点击事件 -->
						<div
							class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-900">
							{{ category.name }}
						</div>

						<!-- 子分类 - 嵌套在父分类循环内 -->
						<ul
							v-if="
								category.children &&
								category.children.length > 0
							"
							class="pl-4 space-y-1 mt-1">
							<li
								v-for="child in category.children"
								:key="child.id">
								<button
									type="button"
									class="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200"
									:class="
										queryParams.categoryId === child.id
											? 'bg-indigo-50 text-indigo-600 font-medium'
											: 'text-gray-700 hover:bg-gray-50'
									"
									@click="handleCategoryChange(child.id)">
									{{ child.name }}
								</button>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
		</section>

		<!-- 价格筛选 -->
		<section
			class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-100">
				<h3 class="text-base font-semibold flex items-center gap-2">
					<Icon
						name="fa-solid fa-filter"
						class="text-indigo-500 text-sm" />
					价格筛选
				</h3>
			</div>
			<div class="p-4">
				<form @submit.prevent="handleFilterApply">
					<div class="space-y-3">
						<div>
							<label
								class="block text-xs font-medium text-gray-500 mb-1.5">
								价格区间
							</label>
							<div class="flex items-center gap-2">
								<input
									v-model.number="localPriceRange.min"
									type="number"
									min="0"
									step="0.01"
									placeholder="最低价"
									class="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
								<span class="text-gray-400 text-sm">至</span>
								<input
									v-model.number="localPriceRange.max"
									type="number"
									min="0"
									step="0.01"
									placeholder="最高价"
									class="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
							</div>
						</div>
						<button
							type="submit"
							class="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200">
							应用筛选
						</button>
						<button
							v-if="hasActiveFilters"
							type="button"
							class="w-full py-2 bg-white text-gray-600 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
							@click="handleFilterReset">
							清除筛选
						</button>
					</div>
				</form>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import type { CommodityCategory } from "~/api/commodity/types.d";

	interface Props {
		categories: CommodityCategory[];
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
	const emit = defineEmits([
		"update:queryParams",
		"update:priceRange",
		"change",
		"reset",
	]);

	// Local state for price range inputs to avoid direct mutation of props if not using v-model directly on inputs
	// However, since we want to sync with parent, we can use a computed with get/set or just watch/emit.
	// For simplicity in this extraction, let's use a local reactive object that syncs.
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

	const handleCategoryChange = (categoryId: number | null) => {
		emit("change", { ...props.queryParams, categoryId });
	};

	const validatePriceRange = (): boolean => {
		const min = localPriceRange.value.min
			? Number(localPriceRange.value.min)
			: null;
		const max = localPriceRange.value.max
			? Number(localPriceRange.value.max)
			: null;

		if (min !== null && max !== null && min > max) {
			return false;
		}
		return true;
	};

	const handleFilterApply = () => {
		if (!validatePriceRange()) {
			return;
		}
		// Emit the event to let parent handle the actual query update
		// We pass the new price values
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
</script>
