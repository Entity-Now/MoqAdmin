<template>
  <div class="icon-select w-full">
    <el-popover
      trigger="click"
      v-model:visible="state.popoverVisible"
      :width="state.popoverWidth"
      placement="bottom-start"
      popper-class="icon-selector-popover"
    >
      <div class="icon-selector-content">
        <!-- 头部：标签切换 -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">选择图标</h4>
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="(item, index) in iconTabsMap"
              :key="index"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              :class="index === tabIndex ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
              @click="tabIndex = index"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="mb-3">
          <el-input
            v-model="state.searchValue"
            placeholder="搜索图标名称..."
            clearable
            size="default"
            @input="handleSearch"
            class="w-full"
          >
            <template #prefix>
              <el-icon class="text-gray-400"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 图标网格 -->
        <div>
          <el-scrollbar height="200px">
            <div v-if="iconNamesFilter.length > 0" class="grid grid-cols-6 sm:grid-cols-8 gap-2 p-1">
              <button
                v-for="item in iconNamesFilter"
                :key="item"
                class="group relative w-full aspect-square flex items-center justify-center bg-gray-50 hover:bg-indigo-50 rounded-lg border-2 border-transparent hover:border-indigo-300 transition-all duration-200"
                :class="modelValue === item ? 'bg-indigo-50 border-indigo-500' : ''"
                :title="item"
                @click="handleSelect(item)"
              >
                <icon :name="item" :size="22" class="text-gray-700 group-hover:text-indigo-600 transition-colors" />
                <div
                  v-if="modelValue === item"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"
                >
                  <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
              <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm">未找到匹配的图标</p>
            </div>
          </el-scrollbar>
        </div>

        <!-- 底部：统计信息 -->
        <div class="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>共 {{ iconNamesFilter.length }} 个图标</span>
          <span v-if="modelValue">已选择: {{ modelValue }}</span>
        </div>
      </div>

      <template #reference>
        <el-input
          ref="inputRef"
          :model-value="modelValue"
          placeholder="点击选择图标"
          :disabled="disabled"
          readonly
          class="w-full"
          @click.stop="handleInputClick"
        >
          <template #prepend>
            <div class="flex items-center justify-center">
              <el-tooltip v-if="modelValue" :content="modelValue" placement="top">
                <icon :name="modelValue" :size="18" class="text-indigo-600" />
              </el-tooltip>
              <span v-else class="text-gray-400 text-sm">无</span>
            </div>
          </template>
          <template #append>
            <el-button v-if="modelValue" @click.stop="handleClear" class="!border-0 bg-gray-50">
              <el-icon class="text-gray-400 hover:text-red-500 transition-colors"><Close /></el-icon>
            </el-button>
            <el-button v-else class="!border-0 bg-gray-50">
              <el-icon class="text-gray-400"><ArrowDown /></el-icon>
            </el-button>
          </template>
        </el-input>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, shallowRef } from 'vue'
import { ElInput } from 'element-plus'
import { Search, Close, ArrowDown } from '@element-plus/icons-vue'
import { getElementIconNames, getLocalIconNames, getFontAwesomeIconNames } from './index'

interface Props {
  modelValue: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const tabIndex = ref<number>(0)
const inputRef = shallowRef<InstanceType<typeof ElInput>>()

const iconTabsMap = [
  { name: 'Element', icons: getElementIconNames() },
  { name: '本地', icons: getLocalIconNames() },
  { name: 'Awesome', icons: getFontAwesomeIconNames() }
]

const state = reactive({
  searchValue: '',
  popoverWidth: 550,
  popoverVisible: false
})

// 图标筛选
const iconNamesFilter = computed(() => {
  const iconNames: string[] = iconTabsMap[tabIndex.value]?.icons ?? []
  if (!state.searchValue) return iconNames
  const searchValue = state.searchValue.toLowerCase()
  return iconNames.filter((icon: string) => icon.toLowerCase().includes(searchValue))
})

// 获取输入框宽度
const getInputWidth = () => {
  nextTick(() => {
    const inputWidth = inputRef.value?.$el.offsetWidth || 300
    state.popoverWidth = Math.max(inputWidth, 550)
  })
}

// 处理搜索
const handleSearch = () => {
  // 防抖处理
  // 这里可以添加防抖逻辑以优化性能
}

// 点击输入框
const handleInputClick = () => {
  if (!props.disabled) {
    state.popoverVisible = !state.popoverVisible
  }
}

// 选中图标
const handleSelect = (icon: string) => {
  emits('update:modelValue', icon)
  emits('change', icon)
  state.popoverVisible = false
  state.searchValue = ''
}

// 清除选择
const handleClear = () => {
  emits('update:modelValue', '')
  emits('change', '')
}

onMounted(() => {
  getInputWidth()
  window.addEventListener('resize', getInputWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', getInputWidth)
})
</script>

<style scoped>
:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: none;
  background: #ffffff;
  transition: all 0.2s;
}

:deep(.el-input__wrapper:hover) {
  border-color: #a5b4fc;
}

:deep(.el-input__wrapper.is-disabled) {
  background: #f9fafb;
  opacity: 0.7;
}

:deep(.el-input-group__prepend),
:deep(.el-input-group__append) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

:deep(.el-input-group__prepend) {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.el-input-group__append) {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

:deep(.el-button) {
  padding: 0 12px;
}

:deep(.el-scrollbar__view) {
  padding-right: 8px;
}

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

<style>
.icon-selector-popover {
  padding: 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  min-width: 550px;
}
</style>