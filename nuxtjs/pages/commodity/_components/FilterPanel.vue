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
				<div
					class="category-scroll-container"
					:class="{ expanded: showAllCategories }">
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
							<!-- 第一级分类 - 可折叠 -->
							<div class="category-parent">
								<button
									type="button"
									class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all duration-200"
									@click="toggleCategory(category.id)">
									<span>{{ category.name }}</span>
									<Icon
										v-if="
											category.children &&
											category.children.length > 0
										"
										:name="
											expandedCategories.includes(
												category.id
											)
												? 'fa-solid fa-chevron-up'
												: 'fa-solid fa-chevron-down'
										"
										class="text-xs text-gray-400 transition-transform duration-200" />
								</button>

								<!-- 子分类 - 可折叠展开 -->
								<Transition name="slide-fade">
									<ul
										v-if="
											category.children &&
											category.children.length > 0 &&
											expandedCategories.includes(
												category.id
											)
										"
										class="pl-4 space-y-1 mt-1 overflow-hidden">
										<li
											v-for="child in category.children"
											:key="child.id">
											<button
												type="button"
												class="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
												:class="
													queryParams.categoryId ===
													child.id
														? 'bg-indigo-50 text-indigo-600 font-medium'
														: 'text-gray-700 hover:bg-gray-50'
												"
												@click="
													handleCategoryChange(
														child.id
													)
												">
												<span
													class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
												{{ child.name }}
											</button>
										</li>
									</ul>
								</Transition>
							</div>
						</li>
					</ul>
				</div>

				<!-- 显示更多/收起按钮 -->
				<button
					v-if="categories.length > 5"
					type="button"
					class="w-full mt-2 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-1 rounded-lg hover:bg-indigo-50 transition-all duration-200"
					@click="showAllCategories = !showAllCategories">
					<span>{{
						showAllCategories ? "收起分类" : "显示更多分类"
					}}</span>
					<Icon
						:name="
							showAllCategories
								? 'fa-solid fa-chevron-up'
								: 'fa-solid fa-chevron-down'
						"
						class="text-xs" />
				</button>
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

	// 展开的分类ID列表
	const expandedCategories = ref<number[]>([]);
	// 是否显示所有分类
	const showAllCategories = ref(false);

	// Local state for price range inputs
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

	// 切换分类展开/收起
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

	// 初始化时,如果有选中的分类,自动展开其父分类
	onMounted(() => {
		if (props.queryParams.categoryId) {
			// 找到选中分类的父分类并展开
			props.categories.forEach((category) => {
				if (category.children && category.children.length > 0) {
					const hasSelectedChild = category.children.some(
						(child) => child.id === props.queryParams.categoryId
					);
					if (hasSelectedChild) {
						expandedCategories.value.push(category.id);
					}
				}
			});
		}
	});
</script>

<style scoped>
	/* 分类滚动容器 */
	.category-scroll-container {
		max-height: 400px;
		overflow-y: auto;
		overflow-x: hidden;
		transition: max-height 0.3s ease;
	}

	.category-scroll-container:not(.expanded) {
		max-height: 300px;
	}

	/* 自定义滚动条 */
	.category-scroll-container::-webkit-scrollbar {
		width: 6px;
	}

	.category-scroll-container::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 3px;
	}

	.category-scroll-container::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.category-scroll-container::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	/* 折叠动画 */
	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(-10px);
		opacity: 0;
		max-height: 0;
	}

	.slide-fade-enter-to,
	.slide-fade-leave-from {
		max-height: 500px;
		opacity: 1;
	}
</style>
