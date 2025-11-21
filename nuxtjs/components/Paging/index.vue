<template>
	<div
		class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
		<!-- Mobile View: Simple Prev/Next -->
		<div class="flex sm:hidden w-full justify-between items-center">
			<button
				@click="handleCurrentChange(pager.page - 1)"
				:disabled="pager.page <= 1"
				class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
				上一页
			</button>
			<span class="text-sm text-gray-700">
				第 {{ pager.page }} / {{ totalPages }} 页
			</span>
			<button
				@click="handleCurrentChange(pager.page + 1)"
				:disabled="pager.page >= totalPages"
				class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
				下一页
			</button>
		</div>

		<!-- Desktop View: Full Pagination -->
		<div class="hidden sm:flex flex-1 items-center justify-between">
			<div>
				<p class="text-sm text-gray-700">
					共
					<span class="font-medium">{{ pager.total }}</span>
					条结果
				</p>
			</div>
			<div class="flex items-center gap-2">
				<!-- Page Size Selector -->
				<select
					v-model="pager.limit"
					@change="handleSizeChange"
					class="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
					<option
						v-for="size in pageSizes"
						:key="size"
						:value="size">
						{{ size }} 条/页
					</option>
				</select>

				<nav
					class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
					aria-label="Pagination">
					<button
						@click="handleCurrentChange(pager.page - 1)"
						:disabled="pager.page <= 1"
						class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
						<span class="sr-only">Previous</span>
						<!-- Heroicon name: solid/chevron-left -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd" />
						</svg>
					</button>

					<template
						v-for="(page, index) in displayedPages"
						:key="index">
						<span
							v-if="page === '...'"
							class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
							...
						</span>
						<button
							v-else
							@click="handleCurrentChange(page as number)"
							:class="[
								page === pager.page
									? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
									: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
								'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
							]">
							{{ page }}
						</button>
					</template>

					<button
						@click="handleCurrentChange(pager.page + 1)"
						:disabled="pager.page >= totalPages"
						class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
						<span class="sr-only">Next</span>
						<!-- Heroicon name: solid/chevron-right -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd" />
						</svg>
					</button>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	interface Props {
		modelValue?: Record<string, any>;
		pageSizes?: number[];
		layout?: string;
		size?: string;
		pageCount?: number;
		background?: boolean;
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: () => ({ page: 1, limit: 10, total: 0 }),
		pageSizes: () => [10, 20, 30, 40, 50],
		layout: "total, sizes, prev, pager, next, jumper",
		size: "default",
		pageCount: 5,
		background: true,
	});

	const emit = defineEmits<{
		(event: "change"): void;
		(event: "update:modelValue", value: any): void;
	}>();

	const pager = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit("update:modelValue", value);
		},
	});

	const totalPages = computed(() => {
		return Math.ceil(pager.value.total / pager.value.limit) || 0;
	});

	// Logic to generate page numbers with ellipsis
	const displayedPages = computed(() => {
		const total = totalPages.value;
		const current = pager.value.page;
		const delta = 2; // Number of pages to show around current page
		const range: (number | string)[] = [];
		const rangeWithDots: (number | string)[] = [];
		let l: number | undefined;

		range.push(1);

		if (total <= 1) return range;

		for (let i = current - delta; i <= current + delta; i++) {
			if (i < total && i > 1) {
				range.push(i);
			}
		}
		range.push(total);

		for (let i of range) {
			if (l) {
				if (Number(i) - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (Number(i) - l !== 1) {
					rangeWithDots.push("...");
				}
			}
			rangeWithDots.push(i);
			l = Number(i);
		}

		return rangeWithDots;
	});

	const handleSizeChange = () => {
		pager.value.page = 1;
		emit("change");
	};

	const handleCurrentChange = (val: number) => {
		if (val < 1 || val > totalPages.value) return;
		pager.value.page = val;
		emit("change");
	};
</script>

<style scoped>
	/* Add any specific overrides if necessary, but Tailwind should handle most */
</style>
