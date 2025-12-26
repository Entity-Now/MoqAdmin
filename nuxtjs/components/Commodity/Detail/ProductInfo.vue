<template>
	<div class="flex flex-col space-y-8">
		<!-- 标题与分类 -->
		<div class="space-y-2">
			<p
				v-if="detail.category"
				class="text-sm font-semibold text-amber-600 tracking-wider uppercase">
				{{ detail.category }}
			</p>
			<h1
				class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
				{{ detail.title }}
			</h1>
		</div>

		<!-- 价格显示 -->
		<div class="flex items-baseline gap-3">
			<span class="text-2xl font-bold text-slate-900 dark:text-white">
				¥ {{ formatPrice(detail.price) }}
			</span>
			<span
				v-if="detail.fee"
				class="text-lg text-slate-400 line-through">
				¥ {{ formatPrice(detail.fee) }}
			</span>
		</div>

		<!-- 规格选择 -->
		<div
			v-if="detail.sku"
			class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
			<SKU
				:options="detail.sku"
				v-model="formData.sku" />
		</div>

		<!-- 数量与地址 -->
		<div
			class="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
			<div class="flex items-center justify-between">
				<label
					class="text-sm font-bold text-slate-700 dark:text-slate-300"
					>选择数量</label
				>
				<el-input-number
					v-model="formData.quantity"
					:min="1"
					:max="detail.stock || 100"
					size="default"
					class="w-32!" />
			</div>

			<div class="space-y-2">
				<label
					class="text-sm font-bold text-slate-700 dark:text-slate-300"
					>配送至</label
				>
				<AddressDisplay v-model="formData.address" />
			</div>
		</div>

		<!-- 库存提示 -->
		<div
			v-if="detail.stock <= 10 && detail.stock > 0"
			class="p-3 bg-amber-50 text-amber-700 text-sm rounded-xl font-medium">
			⚠️ 库存紧张，仅剩 {{ detail.stock }} 件
		</div>

		<!-- 操作按钮 (Nike 风格：全宽 & 高对比度) -->
		<div class="pt-4 space-y-3">
			<button
				type="button"
				class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold rounded-full hover:opacity-90 active:scale-[0.98] transition-all text-lg shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-50"
				:disabled="isOutOfStock || isLoading"
				@click="$emit('buyNow')">
				{{ isOutOfStock ? "暂时缺货" : "立即购买" }}
			</button>

			<button
				type="button"
				class="w-full py-4 border-2 border-slate-200 dark:border-slate-700 font-extrabold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-lg"
				:disabled="isOutOfStock || isLoading"
				@click="$emit('addToCart')">
				加入购物车
			</button>

			<button
				type="button"
				class="w-full py-4 border-2 border-slate-200 dark:border-slate-700 font-extrabold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
				@click="$emit('collect')">
				<Icon
					:name="
						detail.is_collect
							? 'fa-solid fa-heart'
							: 'fa-regular fa-heart'
					"
					:class="detail.is_collect ? 'text-red-500' : ''" />
				<span>{{ detail.is_collect ? "已收藏" : "加入收藏" }}</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import Icon from "~/components/Icon/index.vue";
	import SKU from "~/components/SKU/index.vue";
	import AddressDisplay from "~/components/AddressDisplay/index.vue";

	const props = defineProps<{
		detail: any;
		formData: any;
		isLoading: boolean;
	}>();

	const emits = defineEmits(["buyNow", "addToCart", "collect"]);

	const isOutOfStock = computed(() => props.detail.stock <= 0);

	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};
</script>
