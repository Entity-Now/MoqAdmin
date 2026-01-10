<template>
	<div class="flex flex-col space-y-8">
		<!-- 标题与分类 -->
		<div class="space-y-3">
			<p
				v-if="detail.category"
				class="text-[13px] font-nike font-bold text-primary tracking-[0.2em] uppercase">
				{{ detail.category }}
			</p>
			<h1
				class="text-4xl lg:text-5xl font-nike font-bold text-foreground leading-tight tracking-tight uppercase">
				{{ detail.title }}
			</h1>
		</div>

		<!-- 价格显示 -->
		<div class="flex items-baseline gap-4">
			<span
				class="text-3xl font-nike font-bold text-foreground tracking-tighter">
				¥{{ formatPrice(detail.price) }}
			</span>
			<span
				v-if="detail.fee"
				class="text-xl text-muted-foreground line-through font-medium">
				¥{{ formatPrice(detail.fee) }}
			</span>
		</div>

		<!-- 规格选择 -->
		<div
			v-if="detail.sku"
			class="space-y-4 pt-8 border-t border-border/60">
			<SKU
				:options="detail.sku"
				v-model="formData.sku" />
		</div>

		<!-- 数量与地址 -->
		<div class="space-y-8 pt-8 border-t border-border/60">
			<div class="flex items-center justify-between">
				<label
					class="text-sm font-bold text-foreground/80 uppercase tracking-widest font-nike"
					>Quantity</label
				>
				<el-input-number
					v-model="formData.quantity"
					:min="1"
					:max="detail.stock || 100"
					size="default"
					class="w-32!" />
			</div>

			<div class="space-y-3">
				<label
					class="text-sm font-bold text-foreground/80 uppercase tracking-widest font-nike"
					>Ship to</label
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
		<div class="pt-8 space-y-4">
			<button
				type="button"
				class="w-full py-5 bg-primary text-primary-foreground font-nike font-bold rounded-full hover:opacity-90 active:scale-[0.98] transition-all text-lg shadow-xl shadow-primary/10 disabled:opacity-50 uppercase tracking-widest"
				:disabled="isOutOfStock || isLoading"
				@click="$emit('buyNow')">
				{{ isOutOfStock ? "Sold Out" : "Buy Now" }}
			</button>

			<button
				type="button"
				class="w-full py-5 border-2 border-border font-nike font-bold rounded-full hover:bg-secondary active:scale-[0.98] transition-all text-lg uppercase tracking-widest"
				:disabled="isOutOfStock || isLoading"
				@click="$emit('addToCart')">
				Add to Bag
			</button>

			<button
				type="button"
				class="w-full py-5 border-2 border-border font-nike font-bold rounded-full hover:bg-secondary active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-3 uppercase tracking-widest"
				@click="$emit('collect')">
				<Icon
					:name="
						detail.is_collect
							? 'fa-solid fa-heart'
							: 'fa-regular fa-heart'
					"
					class="text-xl"
					:class="detail.is_collect ? 'text-destructive' : ''" />
				<span>{{
					detail.is_collect ? "Favourite" : "Add to Favourite"
				}}</span>
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
