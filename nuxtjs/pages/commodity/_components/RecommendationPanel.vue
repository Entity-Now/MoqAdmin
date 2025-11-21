<template>
	<div class="space-y-4">
		<!-- 热门商品 -->
		<section
			v-if="pageData.ranking?.length"
			class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-100">
				<h3 class="text-base font-semibold flex items-center gap-2">
					<Icon
						name="fa-solid fa-fire"
						class="text-red-500 text-sm" />
					热门商品
				</h3>
			</div>
			<div class="p-2 space-y-2">
				<NuxtLink
					v-for="(item, index) in pageData.ranking"
					:key="item.id"
					:to="`/commodity/detail/${item.id}`"
					class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
					<div class="flex-shrink-0 w-5 text-center">
						<span
							class="text-sm font-bold"
							:class="
								index < 3 ? 'text-red-500' : 'text-gray-400'
							">
							{{ index + 1 }}
						</span>
					</div>
					<div
						class="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg">
						<el-image
							:src="
								item.image?.[0] ||
								`/static/default/images/no-img.png`
							"
							:alt="item.title"
							class="w-full h-full object-cover"
							lazy />
					</div>
					<div class="flex-1 min-w-0">
						<h4
							class="text-sm font-medium line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 leading-relaxed"
							:title="item.title">
							{{ item.title }}
						</h4>
						<div class="mt-1 text-red-500 text-sm font-bold">
							¥{{ formatPrice(item.price) }}
						</div>
					</div>
				</NuxtLink>
			</div>
		</section>

		<!-- 推荐商品 -->
		<section
			v-if="pageData.topping?.length"
			class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div class="px-4 py-3 border-b border-gray-100">
				<h3 class="text-base font-semibold flex items-center gap-2">
					<Icon
						name="fa-solid fa-star"
						class="text-amber-500 text-sm" />
					推荐商品
				</h3>
			</div>
			<div class="p-2 space-y-2">
				<NuxtLink
					v-for="item in pageData.topping"
					:key="item.id"
					:to="`/commodity/detail/${item.id}`"
					class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
					<div
						class="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg">
						<el-image
							:src="
								item.image?.[0] ||
								`/static/default/images/no-img.png`
							"
							:alt="item.title"
							class="w-full h-full object-cover"
							lazy />
					</div>
					<div class="flex-1 min-w-0">
						<h4
							class="text-sm font-medium line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 leading-relaxed"
							:title="item.title">
							{{ item.title }}
						</h4>
						<div class="mt-1 text-red-500 text-sm font-bold">
							¥{{ formatPrice(item.price) }}
						</div>
					</div>
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";
	import type { CommodityPagesResponse } from "~/api/commodity/types.d";

	interface Props {
		pageData: CommodityPagesResponse;
	}

	defineProps<Props>();

	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};
</script>
