<template>
	<div class="w-full bg-white rounded-xl overflow-hidden">
		<!-- 头部 -->
		<div
			v-if="topVisible"
			class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
			<div class="flex items-center gap-3">
				<div
					class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
					<svg
						class="w-5 h-5 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">
						规格选择器
					</h3>
					<p class="text-xs text-gray-500 mt-0.5">
						选择商品的规格属性和选项值
					</p>
				</div>
			</div>
		</div>

		<!-- 选择器区域 -->
		<div class="bg-white w-full">
			<!-- 空状态 -->
			<div
				v-if="Object.keys(skuOptions).length === 0"
				class="flex flex-col items-center justify-center py-10">
				<Icon
					name="fa-solid fa-layer-group"
					class="text-3xl text-gray-200 mb-2" />
				<p class="text-xs text-gray-400">暂无可选规格</p>
			</div>

			<!-- 规格选择 -->
			<div
				v-else
				class="space-y-8 p-0">
				<!-- 每个规格的按钮组 -->
				<div
					v-for="([key, items], index) in Object.entries(skuOptions)"
					:key="index"
					class="space-y-4">
					<div class="flex justify-between items-center">
						<span
							class="font-bold text-base text-slate-900 tracking-tight"
							>选择 {{ key }}</span
						>
					</div>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
						<button
							v-for="option in items"
							:key="option"
							class="relative py-3 px-2 text-sm font-medium border-2 rounded-lg transition-all duration-200 flex items-center justify-center text-center"
							:class="[
								selectedOptions[key] === option
									? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900'
									: 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300',
							]"
							@click="selectOption(key, option)">
							{{ option }}
						</button>
					</div>
				</div>

				<!-- 选择结果预览 (简化) -->
				<div
					v-if="bottomVisible && isSelectionComplete"
					class="pt-4 border-t border-slate-100 dark:border-slate-800">
					<p class="text-xs text-slate-500 font-medium">
						已选: {{ Object.values(selectedOptions).join(" / ") }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import Icon from "~/components/Icon/index.vue";

	// 定义 Props
	const props = withDefaults(
		defineProps<{
			options: Record<string, string[]> | any; // 规格选项
			modelValue: Record<string, string> | any; // 当前选择
			topVisible?: boolean | any; // 是否显示顶部
			bottomVisible?: boolean | any; // 是否显示底部
		}>(),
		{
			topVisible: false,
			bottomVisible: false,
		}
	);

	// 定义 Emits
	const emits = defineEmits<{
		(event: "update:modelValue", value: Record<string, string>): void;
	}>();

	// 内部更新标志，防止循环触发
	const isInternalUpdate = ref(false);

	// 响应式规格选项
	const skuOptions = computed(() => props.options || {});

	// 响应式选择结果
	const selectedOptions = ref<Record<string, string>>({
		...props.modelValue,
	});

	// 计算是否所有规格都已选择
	const isSelectionComplete = computed(() => {
		const keys = Object.keys(skuOptions.value);
		if (keys.length === 0) return false;
		return keys.every((key) => selectedOptions.value[key]);
	});

	// 监听 props.modelValue 变化，同步到内部状态（外部更新）
	watch(
		() => props.modelValue,
		(newValue) => {
			// 只有在非内部更新时才同步
			if (!isInternalUpdate.value) {
				selectedOptions.value = { ...newValue };
			}
		},
		{ deep: true }
	);

	// 监听 selectedOptions 变化，触发 v-model 更新（内部更新）
	watch(
		selectedOptions,
		(newValue) => {
			// 检查是否真的有变化
			const hasChanged =
				JSON.stringify(newValue) !== JSON.stringify(props.modelValue);

			if (hasChanged) {
				// 设置标志，表示这是内部更新
				isInternalUpdate.value = true;

				// 触发更新
				emits("update:modelValue", { ...newValue });

				// 在下一个 tick 重置标志
				setTimeout(() => {
					isInternalUpdate.value = false;
				}, 0);
			}
		},
		{ deep: true }
	);

	// 选择规格值
	const selectOption = (key: string, option: string) => {
		selectedOptions.value[key] = option;
	};
</script>

<style scoped>
	/* Element Plus 按钮样式覆盖 */
	:deep(.el-button) {
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	:deep(.el-button--default) {
		background-color: white;
		border-color: #e5e7eb;
		color: #374151;
	}

	:deep(.el-button--default:hover) {
		border-color: #a5b4fc;
		background-color: #eef2ff;
	}

	:deep(.el-button--primary) {
		background-color: #6366f1;
		border-color: #6366f1;
	}

	:deep(.el-button--primary:hover) {
		background-color: #4f46e5;
		border-color: #4f46e5;
	}

	:deep(.el-button.is-active, .el-button:focus) {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	/* 自定义滚动条 */
	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	::-webkit-scrollbar-track {
		background: #f3f4f6;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
