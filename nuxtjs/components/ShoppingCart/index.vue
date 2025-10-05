<template>
  <!-- 悬浮购物车按钮 -->
  <div class="fixed right-6 bottom-6 z-50">
    <!-- 购物车图标按钮 -->
    <button
      type="button"
      class="relative w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      @click="toggleCart"
    >
      <Icon name="fa-solid fa-shopping-cart" class="text-xl" />
      <!-- 商品数量徽章 -->
      <span
        v-if="totalItems > 0"
        class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse"
      >
        {{ totalItems > 99 ? '99+' : totalItems }}
      </span>
    </button>

    <!-- 购物车弹窗 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-show="isCartOpen"
        class="absolute right-0 bottom-20 w-[420px] max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <!-- 购物车头部 -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <Icon name="fa-solid fa-shopping-cart" />
              我的购物车
              <span v-if="cartItems.length > 0" class="text-sm font-normal opacity-90">
                ({{ totalItems }})
              </span>
            </h3>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
              @click="closeCart"
            >
              <Icon name="fa-solid fa-times" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- 购物车内容区 -->
        <div class="flex flex-col max-h-[500px]">
          <!-- 商品列表 -->
          <div v-if="cartItems.length > 0" class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="relative flex items-start gap-4 p-4 rounded-lg border transition-all duration-200"
              :class="{
                'opacity-50 cursor-not-allowed': item.stock <= 0,
                'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer': item.stock > 0,
                'border-indigo-600 bg-indigo-50/30': item.is_selected === 1 && item.stock > 0,
              }"
              @click="item.stock > 0 && handleSelectItem(item.id, item.is_selected !== 1)"
            >
              <!-- 选中标记 -->
              <div
                v-if="item.is_selected === 1 && item.stock > 0"
                class="absolute z-10 top-1 left-1 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
              >
                <Icon name="fa-solid fa-check" class="!mr-0 text-white" />
              </div>

              <!-- 商品图片 -->
              <NuxtLink
                :to="`/commodity/detail/${item.commodity_id}`"
                class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-colors"
                @click.stop="closeCart"
              >
                <el-image
                  :src="item.image?.[0] || `/static/default/images/no-img.png`"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                  lazy
                >
                  <template #error>
                    <div class="h-full flex items-center justify-center bg-gray-100">
                      <Icon name="fa-solid fa-image" class="text-gray-400" />
                    </div>
                  </template>
                </el-image>
              </NuxtLink>

              <!-- 商品信息 -->
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/commodity/detail/${item.commodity_id}`"
                  class="block text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed mb-2"
                  :title="item.title"
                  @click.stop="closeCart"
                >
                  {{ item.title }}
                </NuxtLink>
                <div v-if="item.sku" class="text-xs text-gray-500 mb-2">
                  {{ formatSpecifications(item.sku) }}
                </div>
                <div v-if="item.stock <= 0" class="inline-flex items-center gap-1 text-xs text-red-500 mb-2">
                  <Icon name="fa-solid fa-exclamation-circle" />
                  库存不足
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-base font-semibold text-red-500">
                      ¥{{ formatPrice(item.price) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      运费: ¥{{ formatPrice(item.fee || 0) }}
                    </div>
                  </div>
                  <!-- 数量控制 -->
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      :disabled="item.quantity <= 1 || item.stock <= 0"
                      @click.stop="handleQuantityChange(item.id, item.quantity - 1)"
                    >
                      <Icon name="fa-solid fa-minus" class="text-xs" />
                    </button>
                    <span class="text-sm font-medium text-gray-900 w-8 text-center">
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      :disabled="item.quantity >= item.stock || item.stock <= 0"
                      @click.stop="handleQuantityChange(item.id, item.quantity + 1)"
                    >
                      <Icon name="fa-solid fa-plus" class="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 删除按钮 -->
              <button
                type="button"
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                :title="'删除'"
                @click.stop="handleRemoveItem(item.id)"
              >
                <Icon name="fa-solid fa-trash-alt" class="text-sm" />
              </button>
            </article>
          </div>

          <!-- 空购物车状态 -->
          <div v-else class="flex-1 flex flex-col items-center justify-center py-12 px-4">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="fa-solid fa-shopping-cart" class="text-5xl text-gray-300" />
            </div>
            <h4 class="text-base font-semibold text-gray-900 mb-2">购物车是空的</h4>
            <p class="text-sm text-gray-500 mb-4">快去挑选心仪的商品吧</p>
            <NuxtLink
              to="/commodity"
              class="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              @click="closeCart"
            >
              <Icon name="fa-solid fa-shopping-bag" />
              去逛逛
            </NuxtLink>
          </div>

          <!-- 底部结算区 -->
          <div v-if="cartItems.length > 0" class="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-3">
            <!-- 价格统计 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">商品总额</span>
                <span class="font-medium text-gray-900">¥{{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">运费</span>
                <span class="font-medium text-gray-900">
                  {{ totalShippingFee === 0 ? '免运费' : `¥${formatPrice(totalShippingFee)}` }}
                </span>
              </div>
              <div v-if="discountAmount > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">优惠</span>
                <span class="font-medium text-red-500">-¥{{ formatPrice(discountAmount) }}</span>
              </div>
            </div>

            <!-- 合计 -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
              <span class="text-sm text-gray-600">合计</span>
              <div class="text-right">
                <div class="text-xl font-bold text-red-500">
                  ¥{{ formatPrice(finalPrice) }}
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <NuxtLink
                to="/cart"
                class="flex-1 py-2.5 bg-white text-indigo-600 text-sm font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-center"
                @click="closeCart"
              >
                查看购物车
              </NuxtLink>
              <button
                type="button"
                class="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isProcessing || selectedItemsCount === 0"
                @click="handleCheckout"
              >
                <Icon v-if="isProcessing" name="fa-solid fa-spinner" class="animate-spin mr-1" />
                {{ isProcessing ? '处理中...' : '去结算' }}
              </button>
            </div>

            <!-- 提示信息 -->
            <p class="text-xs text-center text-gray-500">
              <Icon name="fa-solid fa-shield-alt" class="mr-1" />
              满{{ freeShippingThreshold }}元免运费
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isCartOpen"
        class="fixed inset-0 bg-black/20 -z-10"
        @click="closeCart"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import useUserStore from '~/stores/user'
import Icon from '../Icon/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import shoppingCartApi from '../../api/commodity/shopping_cart/index'

// ==================== 类型定义 ====================
interface Coupon {
  id: number
  name: string
  discount: number
}

interface ShoppingCartItem {
  id: number
  commodity_id: number
  title: string
  image: string
  price: number
  stock: number
  sales: number
  quantity: number
  fee: number | null
  sku?: Record<string, any> | null
  is_selected: number
  create_time: string
  update_time: string
}

interface ShoppingCartListResponse {
  total_count: number
  selected_count: number
  selected_price: number
  items: ShoppingCartItem[]
}

// ==================== Props ====================
interface Props {
  freeShippingThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  freeShippingThreshold: 99,
})

// ==================== 响应式状态 ====================
const userStore = useUserStore()
const isCartOpen = ref(false)
const isProcessing = ref(false)
const selectedCoupon = ref<Coupon | null>(null)
const cartItems = ref<ShoppingCartItem[]>([])
const cartStats = ref<{
  total_count: number
  selected_count: number
  selected_price: number
}>({
  total_count: 0,
  selected_count: 0,
  selected_price: 0,
})

// ==================== 计算属性 ====================
const totalItems = computed(() => cartStats.value.total_count)
const selectedItemsCount = computed(() => cartStats.value.selected_count)
const validItemsCount = computed(() => cartItems.value.filter((item) => item.stock > 0).length)
const totalPrice = computed(() => cartStats.value.selected_price)
const totalShippingFee = computed(() => {
  const total = cartItems.value
    .filter((item) => item.is_selected === 1 && item.stock > 0)
    .reduce((sum, item) => sum + (item.fee || 0) * item.quantity, 0)
  return totalPrice.value >= props.freeShippingThreshold ? 0 : total
})
const discountAmount = computed(() => (selectedCoupon.value ? selectedCoupon.value.discount : 0))
const finalPrice = computed(() => Math.max(0, totalPrice.value + totalShippingFee.value - discountAmount.value))

// ==================== 工具函数 ====================
const formatPrice = (price: number): string => price.toFixed(2)
const findCartItem = (id: number): ShoppingCartItem | undefined => cartItems.value.find((item) => item.id === id)

const loadCartData = async () => {
  try {
    const response = (await shoppingCartApi.lists()) as ShoppingCartListResponse
    if (response) {
      cartItems.value = response.items
      cartStats.value = {
        total_count: response.total_count,
        selected_count: response.selected_count,
        selected_price: response.selected_price,
      }
    }
  } catch (error) {
    console.error('加载购物车数据失败:', error)
    ElMessage.error('加载购物车失败，请重试')
  }
}

const formatSpecifications = (sku?: Record<string, any> | null): string => {
  if (!sku) return ''
  return Object.entries(sku)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' | ')
}

const toggleCart = () => {
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    return
  }
  isCartOpen.value = !isCartOpen.value
  if (isCartOpen.value) loadCartData()
}

const closeCart = () => {
  isCartOpen.value = false
}

const openCart = () => {
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    return
  }
  isCartOpen.value = true
  loadCartData()
}

const handleQuantityChange = async (id: number, newQuantity: number) => {
  try {
    isProcessing.value = true
    await shoppingCartApi.update({ id, quantity: newQuantity })
    ElMessage.success('数量已更新')
    await loadCartData()
  } catch (error) {
    ElMessage.error('更新失败，请重试')
    console.error('更新数量失败:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleRemoveItem = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    isProcessing.value = true
    await shoppingCartApi.delete({ ids: [id] })
    ElMessage.success('已删除')
    await loadCartData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
      console.error('删除商品失败:', error)
    }
  } finally {
    isProcessing.value = false
  }
}

const handleSelectItem = async (id: number, isSelected: boolean) => {
  try {
    isProcessing.value = true
    await shoppingCartApi.select({ ids: [id], is_selected: isSelected ? 1 : 0 })
    ElMessage.success(isSelected ? '已选中' : '已取消选中')
    await loadCartData()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
    console.error('选择商品失败:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleCheckout = async () => {
  if (selectedItemsCount.value === 0) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }
  isProcessing.value = true
  try {
    const validIds = cartItems.value
      .filter((item) => item.stock > 0 && item.is_selected === 1)
      .map((item) => item.id)
    if (validIds.length === 0) {
      ElMessage.warning('没有可结算的商品')
      return
    }
    ElMessage.success('正在跳转到结算页面...')
    closeCart()
    // navigateTo(`/order/checkout?items=${validIds.join(',')}`)
  } catch (error) {
    ElMessage.error('结算失败，请重试')
    console.error('结算失败:', error)
  } finally {
    isProcessing.value = false
  }
}

defineExpose({ openCart, closeCart, toggleCart, loadCartData })

onMounted(() => {
  // 仅在需要时加载数据
})

watch(isCartOpen, (newValue) => {
  if (newValue) loadCartData()
})
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (max-width: 480px) {
  .fixed.right-6.bottom-6 > div:not(button) {
    width: calc(100vw - 3rem);
    right: -1.5rem;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>