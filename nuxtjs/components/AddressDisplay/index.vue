<template>
  <div class="w-full">
    <!-- 用户未登录状态 -->
    <div v-if="!isLogin" class="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm text-amber-800">请先登录后再管理收货地址</span>
      </div>
      <el-button type="primary" size="small" @click="handleLogin">去登录</el-button>
    </div>

    <!-- 用户已登录但无地址状态 -->
    <div v-else-if="!addressList.length" class="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-sm text-gray-600">您还没有添加收货地址</span>
      </div>
      <el-button type="primary" size="small" @click="handleAddAddress">
        <el-icon class="mr-1"><Plus /></el-icon>
        添加地址
      </el-button>
    </div>

    <!-- 有地址的情况 - 紧凑展示 -->
    <div v-else class="relative">
      <div 
        class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
        @click="showAddressModal = true"
      >
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <!-- 图标 -->
          <div class="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mt-0.5">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <!-- 地址信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-gray-900">{{ selectedAddress?.name }}</span>
              <span class="text-sm text-gray-500">{{ selectedAddress?.phone }}</span>
              <span v-if="selectedAddress?.is_default === 1" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                默认
              </span>
            </div>
            <div class="text-sm text-gray-600 line-clamp-1">
              {{ formattedAddress }}
            </div>
          </div>

          <!-- 更多操作按钮 -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              @click.stop="handleEditAddress"
              title="编辑地址"
            >
              <el-icon><Edit /></el-icon>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              @click.stop="showAddressModal = true"
              title="更换地址"
            >
              <el-icon><Refresh /></el-icon>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              @click.stop="handleDeleteAddress"
              title="删除地址"
            >
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- 地址选择弹窗 -->
      <el-dialog 
        v-model="showAddressModal" 
        title="选择收货地址" 
        width="600px"
        :close-on-click-modal="false"
      >
        <div class="max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-3">
            <div 
              v-for="address in addressList" 
              :key="address.id" 
              class="relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
              :class="address.id === selectedAddress?.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'"
              @click="selectAddress(address)"
            >
              <!-- 选中标记 -->
              <div 
                v-if="address.id === selectedAddress?.id"
                class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-indigo-500 border-l-transparent rounded-tr-lg"
              >
                <svg class="absolute -top-7 -right-0.5 w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>

              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-sm font-semibold text-gray-900">{{ address.name }}</span>
                    <span class="text-sm text-gray-500">{{ address.phone }}</span>
                    <span v-if="address.is_default === 1" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                      默认
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 leading-relaxed">
                    {{ address.province }}{{ address.city }}{{ address.district }}{{ address.address }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between items-center">
            <el-button type="primary" plain @click="handleAddAddressInModal">
              <el-icon class="mr-1"><Plus /></el-icon>
              添加新地址
            </el-button>
            <div class="flex gap-2">
              <el-button @click="showAddressModal = false">取消</el-button>
              <el-button type="primary" @click="showAddressModal = false">确定</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '~/stores/user'
import addressApi from '~/api/address'
import { addressUtil } from '~/utils/address'
import { ElMessageBox } from 'element-plus'
import feedback from '~/utils/feedback'
import { Edit, Refresh, Delete, Plus } from '@element-plus/icons-vue'

// 类型定义
interface AddressItem {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  full_address: string;
  is_default: number;
}

// Props
const props = defineProps<{
  modelValue?: AddressItem | null;
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: AddressItem | null];
}>()

// 状态管理
const userStore = useUserStore()
const router = useRouter()

// 响应式数据
const isLogin = computed(() => userStore.isLogin)
const addressList = ref<AddressItem[]>([])
const selectedAddress = ref<AddressItem | null>(props.modelValue || null)
const showMoreOptions = ref(false)
const showAddressModal = ref(false)

// 计算属性
const formattedAddress = computed(() => {
  if (!selectedAddress.value) return ''
  return addressUtil.formatAddressToString({
    name: selectedAddress.value.name,
    phone: selectedAddress.value.phone,
    province: selectedAddress.value.province,
    city: selectedAddress.value.city,
    district: selectedAddress.value.district,
    address: selectedAddress.value.address,
    is_default: selectedAddress.value.is_default
  })
})

// 监听v-model变化
watch(() => props.modelValue, (newValue) => {
  selectedAddress.value = newValue || null
})

// 监听登录状态变化
watch(isLogin, (newLoginStatus) => {
  if (newLoginStatus && !selectedAddress.value) {
    loadAddresses()
  }
})

// 初始化数据
onMounted(() => {
  if (isLogin.value && !selectedAddress.value) {
    loadAddresses()
  }
})

// 加载地址列表
const loadAddresses = async () => {
  try {
    const res = await addressApi.lists()
    if (res && Array.isArray(res)) {
      addressList.value = res
      // 如果没有选中的地址且有地址列表，默认选中第一个
      if (!selectedAddress.value && addressList.value.length > 0) {
        selectedAddress.value = addressList.value[0]
        emit('update:modelValue', selectedAddress.value)
      }
    }
  } catch (error) {
    feedback.msgError('获取地址列表失败')
  }
}

// 选择地址
const selectAddress = (address: AddressItem) => {
  selectedAddress.value = address
  emit('update:modelValue', address)
  showAddressModal.value = false
  showMoreOptions.value = false
  feedback.msgSuccess('地址选择成功')
}

// 处理登录
const handleLogin = () => {
  router.push('/login')
}

// 处理添加地址
const handleAddAddress = () => {
  router.push('/user/index/address')
}

// 在弹窗中添加地址
const handleAddAddressInModal = () => {
  showAddressModal.value = false
  handleAddAddress()
}

// 处理编辑地址
const handleEditAddress = () => {
  if (selectedAddress.value) {
    router.push({ path: '/user/index/address', query: { id: selectedAddress.value.id } })
  }
}

// 处理删除地址
const handleDeleteAddress = async () => {
  if (!selectedAddress.value) return
  
  try {
    const confirm = await ElMessageBox.confirm(
      '确定要删除这个地址吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (confirm) {
      const res = await addressApi.delete({ id: selectedAddress.value.id })
      if (res >= 0) {
        feedback.msgSuccess('地址删除成功')
        await loadAddresses()
        showMoreOptions.value = false
      }
    }
  } catch (error) {
    if (error === 'cancel') return
    feedback.msgError('删除地址失败')
  }
}

// 处理更换地址
const handleChangeAddress = () => {
  showAddressModal.value = true
  showMoreOptions.value = false
}
</script>

<style scoped>
/* 文字截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* Element Plus 对话框样式覆盖 */
:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-dialog__body) {
  padding: 20px 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid #e5e7eb;
}
</style>