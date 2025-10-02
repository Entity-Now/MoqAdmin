<template>
  <div class="w-full bg-white rounded-xl overflow-hidden">
    <!-- 头部 -->
    <div v-if="topVisible" class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">规格选择器</h3>
          <p class="text-xs text-gray-500 mt-0.5">选择商品的规格属性和选项值</p>
        </div>
      </div>
    </div>

    <!-- 选择器区域 -->
    <div class="bg-gray-50 w-full">
      <!-- 空状态 -->
      <div v-if="Object.keys(skuOptions).length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h4 class="text-base font-semibold text-gray-900 mb-2">暂无规格</h4>
        <p class="text-sm text-gray-500">当前没有可选择的规格选项</p>
      </div>

      <!-- 规格选择 -->
      <div v-else class="space-y-6">
        <!-- 每个规格的按钮组 -->
        <div v-for="(options, key) in skuOptions" :key="key" class="flex flex-col gap-2 pl-8">
          <div class="font-semibold text-xs text-gray-500">{{ key }}</div>
          <div class="flex flex-wrap gap-2">
            <el-button
              v-for="option in options"
              :key="option"
              :type="selectedOptions[key] === option ? 'primary' : 'default'"
              size="default"
              class="rounded-lg"
              @click.prevent="selectOption(key, option)"
            >
              {{ option }}
            </el-button>
          </div>
        </div>

        <!-- 选择结果预览 -->
        <div class="mt-6" v-if="bottomVisible">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">当前选择</h4>
          <div v-if="isSelectionComplete" class="bg-gray-100 rounded-lg p-4">
            <pre class="text-xs text-gray-700 font-mono">{{ JSON.stringify(selectedOptions, null, 2) }}</pre>
          </div>
          <div v-else class="text-sm text-red-500">
            请为每个规格选择一个选项
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';
import { ElMessage } from 'element-plus';

// 定义 Props
const props = withDefaults(defineProps<{
  options: Record<string, string[]> | any; // 规格选项，例如 { 颜色: ['红色', '蓝色'], 尺寸: ['S', 'M'] }
  modelValue: Record<string, string> | any; // 当前选择，例如 { 颜色: '红色', 尺寸: 'S' }
  topVisible?: boolean | any; // 是否显示顶部选择器
  bottomVisible?: boolean | any; // 是否显示底部选择器
}>(),{
    topVisible: false,
    bottomVisible: false,
});

// 定义 Emits
const emits = defineEmits<{
  (event: 'update:modelValue', value: Record<string, string>): void;
}>();

// 响应式规格选项
const skuOptions = computed(() => props.options);

// 响应式选择结果
const selectedOptions = ref<Record<string, string>>({ ...props.modelValue });

// 计算是否所有规格都已选择
const isSelectionComplete = computed(() => {
  return Object.keys(skuOptions.value).every((key) => selectedOptions.value[key]);
});

// 监听 props.modelValue 变化，同步到内部状态
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOptions.value = { ...newValue };
  },
  { deep: true }
);

// 监听 selectedOptions 变化，触发 v-model 更新
watch(
  selectedOptions,
  (newValue) => {
    emits('update:modelValue', { ...newValue });
  },
  { deep: true }
);

// 选择规格值
const selectOption = (key: string, option: string) => {
  selectedOptions.value[key] = option;
  ElMessage.success(`已选择 ${key}: ${option}`);
};
</script>

<style scoped>
/* Element Plus 按钮样式覆盖 */
:deep(.el-button) {
  border-radius: 0.5rem;
  transition: all 0.2s;
}

:deep(.el-button:hover) {
  border-color: #a5b4fc;
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