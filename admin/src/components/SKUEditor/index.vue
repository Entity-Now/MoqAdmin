<template>
	<div
		class="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<!-- 头部 -->
		<div
			class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
			<div class="flex items-center justify-between">
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
							规格设置
						</h3>
						<p class="text-xs text-gray-500 mt-0.5">
							查看或编辑商品的规格属性和选项值
						</p>
					</div>
				</div>
				<el-button
					type="primary"
					size="default"
					@click.prevent="openEditor"
					class="!rounded-lg">
					<template #icon>
						<el-icon><Edit /></el-icon>
					</template>
					编辑规格
				</el-button>
			</div>
		</div>

		<!-- 预览区域 -->
		<div
			class="p-6"
			:class="{ 'bg-gray-50': Object.keys(skuObject).length > 0 }">
			<!-- 空状态 -->
			<div
				v-if="Object.keys(skuObject).length === 0"
				class="flex flex-col items-center justify-center py-20">
				<div
					class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
					<svg
						class="w-12 h-12 text-gray-400"
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
				<h4 class="text-base font-semibold text-gray-900 mb-2">
					暂无规格
				</h4>
				<p class="text-sm text-gray-500 mb-6">
					请点击"编辑规格"按钮开始配置商品规格
				</p>
				<el-button
					type="primary"
					size="default"
					@click.prevent="openEditor"
					class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
					<el-icon class="mr-1"><Edit /></el-icon>
					编辑规格
				</el-button>
			</div>

			<!-- 预览内容 -->
			<div
				v-else
				class="space-y-6">
				<!-- 预览标题 -->
				<div class="flex items-center gap-2">
					<svg
						class="w-5 h-5 text-indigo-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
					<h4 class="text-sm font-semibold text-gray-900">
						规格预览
					</h4>
				</div>

				<!-- JSON 预览 -->
				<div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
					<pre
						class="text-xs text-green-400 font-mono leading-relaxed"
						>{{ JSON.stringify(skuObject, null, 2) }}</pre
					>
				</div>

				<!-- 统计信息 -->
				<div class="grid grid-cols-2 gap-3">
					<div class="bg-white rounded-lg p-3 border border-gray-200">
						<div class="text-xs text-gray-500 mb-1">规格数量</div>
						<div class="text-2xl font-bold text-indigo-600">
							{{ Object.keys(skuObject).length }}
						</div>
					</div>
					<div class="bg-white rounded-lg p-3 border border-gray-200">
						<div class="text-xs text-gray-500 mb-1">总选项</div>
						<div class="text-2xl font-bold text-purple-600">
							{{ totalOptions }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 编辑弹窗 -->
		<el-dialog
			v-model="isEditorOpen"
			title="编辑规格"
			width="600px"
			:close-on-click-modal="false"
			:close-on-press-escape="false">
			<div class="p-4 max-h-[400px] overflow-y-auto">
				<!-- 规格列表 -->
				<div
					v-if="Object.keys(tempSkuData).length > 0"
					class="space-y-4">
					<div
						v-for="(values, key, index) in tempSkuData"
						:key="key"
						class="group bg-gray-50 rounded-xl p-5 border-2 border-gray-100 hover:border-indigo-200 transition-all duration-200">
						<!-- 规格名称 -->
						<div class="flex items-center gap-3 mb-4">
							<div class="flex items-center gap-2 flex-1">
								<span
									class="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
									{{ index + 1 }}
								</span>
								<el-input
									v-model="tempSkuKeys[index]"
									placeholder="规格名称（如：颜色、尺寸）"
									class="flex-1"
									@change="updateSkuKey(index, $event)">
									<template #prefix>
										<el-icon class="text-gray-400"
											><Collection
										/></el-icon>
									</template>
								</el-input>
							</div>
							<el-button
								type="danger"
								size="default"
								circle
								@click.prevent="removeSkuItem(key)"
								:disabled="Object.keys(tempSkuData).length <= 1"
								class="!w-10 !h-10"
								aria-label="删除规格">
								<el-icon><Delete /></el-icon>
							</el-button>
						</div>

						<!-- 规格值列表 -->
						<div class="space-y-2 ml-8">
							<div
								v-for="(_, valueIndex) in values"
								:key="valueIndex"
								class="flex items-center gap-2">
								<div
									class="flex items-center gap-2 flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-indigo-300 transition-colors">
									<span class="text-xs text-gray-400">•</span>
									<el-input
										v-model="values[valueIndex]"
										placeholder="请输入规格值"
										class="flex-1"
										@change="
											updateSkuValue(
												key,
												valueIndex,
												$event
											)
										"
										size="default" />
								</div>
								<el-button
									type="danger"
									size="default"
									circle
									@click.prevent="
										removeSkuValue(key, valueIndex)
									"
									:disabled="values.length <= 1"
									class="!w-10 !h-10"
									aria-label="删除规格值">
									<el-icon><Delete /></el-icon>
								</el-button>
							</div>

							<button
								@click.prevent="addSkuValue(key)"
								class="w-full mt-2 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-all duration-200 flex items-center justify-center gap-2">
								<el-icon><Plus /></el-icon>
								添加规格值
							</button>
						</div>
					</div>
				</div>

				<!-- 空状态 -->
				<div
					v-else
					class="flex flex-col items-center justify-center py-10">
					<div
						class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<svg
							class="w-12 h-12 text-gray-400"
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
					<h4 class="text-base font-semibold text-gray-900 mb-2">
						暂无规格
					</h4>
					<p class="text-sm text-gray-500 mb-6">
						请点击"添加规格"按钮开始配置商品规格
					</p>
					<button
						@click.prevent="addSkuItem"
						class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
						<el-icon class="mr-1"><Plus /></el-icon>
						添加第一个规格
					</button>
				</div>
			</div>

			<!-- 弹窗底部 -->
			<template #footer>
				<div class="flex justify-end gap-2">
					<el-button @click.prevent="handleCloseEditor"
						>取消</el-button
					>
					<el-button
						type="primary"
						@click.prevent="saveEditor"
						>保存</el-button
					>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
	import { computed, ref } from "vue";
	import { ElMessage, ElMessageBox } from "element-plus";
	import { Plus, Delete, Collection, Edit } from "@element-plus/icons-vue";

	// Define Props
	const props = defineProps<{
		modelValue: Record<string, string[]>;
	}>();

	// Define Emits
	const emits = defineEmits<{
		(event: "update:modelValue", value: Record<string, string[]>): void;
	}>();

	// Reactive SKU data (main data)
	const skuData = ref<Record<string, string[]>>(
		props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : {}
	);

	// Temporary SKU data (for editor dialog)
	const tempSkuData = ref<Record<string, string[]>>(
		props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : {}
	);

	// SKU keys for the editor
	const tempSkuKeys = ref<string[]>(Object.keys(tempSkuData.value));

	// Editor dialog visibility
	const isEditorOpen = ref(false);

	// Computed: Return current SKU data
	const skuObject = computed(() => skuData.value);

	// Computed: Total options count
	const totalOptions = computed(() => {
		return Object.values(skuData.value).reduce(
			(sum, values) => sum + values.length,
			0
		);
	});

	// Sync skuData with props.modelValue when it changes
	watch(
		() => props.modelValue,
		(newValue) => {
			const safeValue = newValue || {};
			skuData.value = JSON.parse(JSON.stringify(safeValue)); // Deep copy to avoid mutating props
			tempSkuData.value = JSON.parse(JSON.stringify(safeValue)); // Sync temp data
			tempSkuKeys.value = Object.keys(tempSkuData.value);
		},
		{ deep: true, immediate: true }
	);

	// Open editor dialog
	const openEditor = () => {
		tempSkuData.value = JSON.parse(JSON.stringify(skuData.value)); // Deep copy main data to temp
		tempSkuKeys.value = Object.keys(tempSkuData.value);
		isEditorOpen.value = true;
	};

	// Close editor dialog
	const handleCloseEditor = () => {
		ElMessageBox.confirm("确定取消编辑？未保存的更改将丢失。", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(() => {
				isEditorOpen.value = false;
				tempSkuData.value = JSON.parse(JSON.stringify(skuData.value)); // Restore temp data
				tempSkuKeys.value = Object.keys(tempSkuData.value);
				ElMessage.info("已取消编辑");
			})
			.catch(() => {
				// User canceled
			});
	};

	// Save editor content
	const saveEditor = () => {
		skuData.value = JSON.parse(JSON.stringify(tempSkuData.value)); // Save temp data to main data
		emits(
			"update:modelValue",
			JSON.parse(JSON.stringify(tempSkuData.value))
		); // Emit update to parent
		isEditorOpen.value = false;
		ElMessage.success("规格保存成功");
	};

	// Add new SKU item
	const addSkuItem = () => {
		const newKey = `规格${Object.keys(tempSkuData.value).length + 1}`;
		if (Object.keys(tempSkuData.value).includes(newKey)) {
			ElMessage.error("规格名称已存在，请使用其他名称");
			return;
		}
		tempSkuData.value = { ...tempSkuData.value, [newKey]: ["选项1"] };
		tempSkuKeys.value = Object.keys(tempSkuData.value);
		ElMessage.success("规格添加成功");
	};

	// Remove SKU item
	const removeSkuItem = (key: string) => {
		if (Object.keys(tempSkuData.value).length <= 1) {
			ElMessage.warning("至少保留一个规格");
			return;
		}
		const newData = { ...tempSkuData.value };
		delete newData[key];
		tempSkuData.value = newData;
		tempSkuKeys.value = Object.keys(tempSkuData.value);
		ElMessage.success("规格删除成功");
	};

	// Update SKU key
	const updateSkuKey = (index: number, newKey: string) => {
		const trimmedKey = newKey.trim();
		const oldKey = Object.keys(tempSkuData.value)[index];

		if (!trimmedKey) {
			ElMessage.error("规格名称不能为空");
			tempSkuKeys.value[index] = oldKey;
			return;
		}

		if (
			trimmedKey !== oldKey &&
			Object.keys(tempSkuData.value).includes(trimmedKey)
		) {
			ElMessage.error("规格名称已存在");
			tempSkuKeys.value[index] = oldKey;
			return;
		}

		if (oldKey !== trimmedKey) {
			const newData = { ...tempSkuData.value };
			const values = newData[oldKey];
			delete newData[oldKey];
			newData[trimmedKey] = values;
			tempSkuData.value = newData;
			tempSkuKeys.value = Object.keys(tempSkuData.value);
			ElMessage.success("规格名称更新成功");
		}
	};

	// Add SKU value
	const addSkuValue = (key: string) => {
		const currentLength = tempSkuData.value[key].length;
		const newValue = `选项${currentLength + 1}`;
		if (tempSkuData.value[key].includes(newValue)) {
			ElMessage.error("规格值已存在，请使用其他值");
			return;
		}
		tempSkuData.value = {
			...tempSkuData.value,
			[key]: [...tempSkuData.value[key], newValue],
		};
		ElMessage.success("规格值添加成功");
	};

	// Remove SKU value
	const removeSkuValue = (key: string, index: number) => {
		if (tempSkuData.value[key].length <= 1) {
			ElMessage.warning("至少保留一个规格值");
			return;
		}
		tempSkuData.value = {
			...tempSkuData.value,
			[key]: tempSkuData.value[key].filter((_, i) => i !== index),
		};
		ElMessage.success("规格值删除成功");
	};

	// Update SKU value
	const updateSkuValue = (key: string, index: number, newValue: string) => {
		const trimmedValue = newValue.trim();
		if (!trimmedValue) {
			ElMessage.error("规格值不能为空");
			tempSkuData.value[key][index] = `选项${index + 1}`;
			return;
		}
		if (
			tempSkuData.value[key].includes(trimmedValue) &&
			tempSkuData.value[key][index] !== trimmedValue
		) {
			ElMessage.error("规格值已存在");
			tempSkuData.value[key][index] = `选项${index + 1}`;
			return;
		}
		tempSkuData.value = {
			...tempSkuData.value,
			[key]: tempSkuData.value[key].map((val, i) =>
				i === index ? trimmedValue : val
			),
		};
		ElMessage.success("规格值更新成功");
	};
</script>

<style scoped>
	/* Element Plus 输入框样式覆盖 */
	:deep(.el-input__wrapper) {
		border-radius: 0.5rem;
		box-shadow: none;
		border: 1px solid #e5e7eb;
		transition: all 0.2s;
	}

	:deep(.el-input__wrapper:hover) {
		border-color: #a5b4fc;
	}

	:deep(.el-input__wrapper.is-focus) {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	:deep(.el-button.is-circle) {
		border-radius: 50%;
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

	/* 弹窗样式 */
	:deep(.el-dialog__body) {
		padding: 0;
	}

	:deep(.el-dialog__footer) {
		padding: 16px;
		border-top: 1px solid #e5e7eb;
	}
</style>
