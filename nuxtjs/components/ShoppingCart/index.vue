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
					<div v-if="cartItems.length > 0" class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
						<article
							v-for="item in cartItems"
							:key="item.id"
							class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
							:class="{ 'opacity-50': item.stock <= 0 }"
						>
							<!-- 商品图片 -->
							<NuxtLink
								:to="`/commodity/detail/${item.commodity_id}`"
								class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 hover:border-indigo-300 transition-colors"
								@click="closeCart"
							>
								<el-image
									:src="item.image"
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
									class="block text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed mb-1"
									:title="item.title"
									@click="closeCart"
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
									<div class="text-base font-semibold text-red-500">
										¥{{ formatPrice(item.price) }}
									</div>
									<!-- 数量控制 -->
									<div class="flex items-center gap-2">
										<button
											type="button"
											class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											:disabled="item.quantity <= 1 || item.stock <= 0"
											@click="handleQuantityChange(item.id, item.quantity - 1)"
										>
											<Icon name="fa-solid fa-minus" class="text-xs" />
										</button>
										<span class="text-sm font-medium text-gray-900 w-8 text-center">
											{{ item.quantity }}
										</span>
										<button
											type="button"
											class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											:disabled="item.quantity >= item.stock || item.stock <= 0"
											@click="handleQuantityChange(item.id, item.quantity + 1)"
										>
											<Icon name="fa-solid fa-plus" class="text-xs" />
										</button>
									</div>
								</div>
							</div>

								<!-- 选择框 -->							
							<button
								type="button"
								class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-1"
								@click="handleSelectItem(item.id, item.is_selected !== 1)"
							>
								<div class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center transition-colors">
									<div v-if="item.is_selected === 1" class="w-2 h-2 rounded-full bg-indigo-600"></div>
								</div>
							</button>

							<!-- 删除按钮 -->
							<button
								type="button"
								class="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
								:title="'删除'"
								@click="handleRemoveItem(item.id)"
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
									{{ shippingFee === 0 ? '免运费' : `¥${formatPrice(shippingFee)}` }}
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
								:disabled="isProcessing || validItemsCount === 0"
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
import Icon from "../Icon/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import shoppingCartApi from "../../api/commodity/shopping_cart/index";

// ==================== 类型定义 ====================
interface Coupon {
	id: number;
	name: string;
	discount: number;
}

// 从API推断的类型定义
interface ShoppingCartItem {
  id: number;
  commodity_id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  quantity: number;
  sku?: Record<string, any> | null;
  is_selected: number;
  create_time: string;
  update_time: string;
}

// API响应类型
interface ShoppingCartListResponse {
  code: number;
  message: string;
  data: {
    total_count: number;
    selected_count: number;
    selected_price: number;
    items: ShoppingCartItem[];
  };
}

// ==================== Props ====================
interface Props {
	/** 免运费门槛 */
	freeShippingThreshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
	freeShippingThreshold: 99,
});

// ==================== 响应式状态 ====================
const isCartOpen = ref(false);
const isProcessing = ref(false);
const selectedCoupon = ref<Coupon | null>(null);
const cartItems = ref<ShoppingCartItem[]>([]);
const cartStats = ref<{
	total_count: number;
	selected_count: number;
	selected_price: number;
}>({
	total_count: 0,
	selected_count: 0,
	selected_price: 0
});

// ==================== 计算属性 ====================
/**
 * 总商品数量
 */
const totalItems = computed(() => {
	return cartStats.value.total_count;
});

/**
 * 有效商品数量
 */
const validItemsCount = computed(() => {
	return cartItems.value.filter(item => item.stock > 0).length;
});

/**
 * 商品总价
 */
const totalPrice = computed(() => {
	return cartStats.value.selected_price;
});

/**
 * 运费
 */
const shippingFee = computed(() => {
	return totalPrice.value >= props.freeShippingThreshold ? 0 : 10;
});

/**
 * 优惠金额
 */
const discountAmount = computed(() => {
	if (!selectedCoupon.value) return 0;
	return selectedCoupon.value.discount;
});

/**
 * 最终价格
 */
const finalPrice = computed(() => {
	return Math.max(0, totalPrice.value + shippingFee.value - discountAmount.value);
});

// ==================== 工具函数 ====================
/**
 * 格式化价格
 */
const formatPrice = (price: number): string => {
	return price.toFixed(2);
};

/**
 * 查找购物车项
 */
const findCartItem = (id: number): ShoppingCartItem | undefined => {
	return cartItems.value.find(item => item.id === id);
};

/**
 * 加载购物车数据
 */
const loadCartData = async () => {
	try {
		const response = await shoppingCartApi.lists() as ShoppingCartListResponse;
		if (response.code === 0 && response.data) {
			cartItems.value = response.data.items;
			cartStats.value = {
				total_count: response.data.total_count,
				selected_count: response.data.selected_count,
				selected_price: response.data.selected_price
			};
		}
	} catch (error) {
		console.error("加载购物车数据失败:", error);
		// 在出错时可以保留之前的数据
	}
};

/**
 * 格式化规格信息
 */
const formatSpecifications = (sku?: Record<string, any> | null): string => {
	if (!sku) return '';
	return Object.entries(sku)
		.map(([key, value]) => `${key}: ${value}`)
		.join(' | ');
};

/**
 * 切换购物车显示状态
 */
const toggleCart = () => {
	isCartOpen.value = !isCartOpen.value;
	if (isCartOpen.value) {
		loadCartData();
	}
};

/**
 * 关闭购物车
 */
const closeCart = () => {
	isCartOpen.value = false;
};

/**
 * 打开购物车
 */
const openCart = () => {
	isCartOpen.value = true;
	loadCartData();
};

/**
 * 修改商品数量
 */
const handleQuantityChange = async (id: number, newQuantity: number) => {
	try {
		isProcessing.value = true;
		await shoppingCartApi.update({
			id,
			quantity: newQuantity
		});
		ElMessage.success("数量已更新");
		// 重新加载购物车数据
		await loadCartData();
	} catch (error) {
		ElMessage.error("更新失败，请重试");
		console.error("更新数量失败:", error);
	} finally {
		isProcessing.value = false;
	}
};

/**
 * 删除商品
 */
const handleRemoveItem = async (id: number) => {
	try {
		await ElMessageBox.confirm(
			"确定要删除这件商品吗？",
			"提示",
			{
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}
		);

		isProcessing.value = true;
		await shoppingCartApi.delete({ ids: [id] });
		ElMessage.success("已删除");
		// 重新加载购物车数据
		await loadCartData();
	} catch (error) {
		// 用户取消
	} finally {
		isProcessing.value = false;
	}
};

/**
 * 去结算
 */
const handleCheckout = async () => {
	if (validItemsCount.value === 0) {
		ElMessage.warning("购物车中没有可结算的商品");
		return;
	}

	isProcessing.value = true;
	try {
		// 获取选中的商品ID
		const validIds = cartItems.value
			.filter(item => item.stock > 0 && item.is_selected === 1)
			.map(item => item.id);

		if (validIds.length === 0) {
			ElMessage.warning("请先选择要结算的商品");
			return;
		}

		// 这里应该调用API创建订单
		ElMessage.success("正在跳转到结算页面...");
		closeCart();
		// navigateTo(`/order/checkout?items=${validIds.join(',')}`);
	} catch (error) {
		ElMessage.error("结算失败，请重试");
		console.error("结算失败:", error);
	} finally {
		isProcessing.value = false;
	}
};

/**
 * 选择/取消选择商品
 */
const handleSelectItem = async (id: number, isSelected: boolean) => {
	try {
		isProcessing.value = true;
		await shoppingCartApi.select({
			ids: [id],
			is_selected: isSelected ? 1 : 0
		});
		// 重新加载购物车数据
		await loadCartData();
	} catch (error) {
		ElMessage.error("操作失败，请重试");
		console.error("选择商品失败:", error);
	} finally {
		isProcessing.value = false;
	}
};

// ==================== 暴露方法（供父组件调用） ====================
defineExpose({
	openCart,
	closeCart,
	toggleCart,
	loadCartData // 暴露给父组件，方便在需要时刷新购物车
});

// ==================== 组件挂载时加载数据 ====================
onMounted(() => {
	// 组件挂载时不立即加载数据，只在打开购物车时加载
});

// ==================== 监听购物车打开状态 ====================
watch(isCartOpen, (newValue) => {
	if (newValue) {
		loadCartData();
	}
});


</script>

<style scoped>
/* 自定义滚动条 */
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

/* 动画效果 */
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.7;
	}
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 响应式调整 */
@media (max-width: 480px) {
	.fixed.right-6.bottom-6 > div:not(button) {
		width: calc(100vw - 3rem);
		right: -1.5rem;
	}
}

/* 防止内容溢出 */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>