<template>
	<article
		class="group relative flex flex-col bg-white overflow-hidden transition-all duration-300">
		<NuxtLink
			:to="`/commodity/detail/${item.id}`"
			class="block flex-1">
			<!-- 商品图片容器 (Nike Style: Square and clean) -->
			<div class="relative aspect-square overflow-hidden bg-[#f6f6f6]">
				<el-image
					:src="
						item?.main_image || `/static/default/images/no-img.png`
					"
					:alt="item.title"
					fit="cover"
					class="w-full h-full transition-transform duration-500 group-hover:scale-105"
					lazy>
					<template #error>
						<div
							class="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
							<Icon
								name="fa-solid fa-image"
								class="text-3xl mb-2" />
							<span class="text-xs">图片加载失败</span>
						</div>
					</template>
					<template #placeholder>
						<div
							class="w-full h-full flex items-center justify-center bg-gray-100">
							<div class="animate-pulse">
								<Icon
									name="fa-solid fa-image"
									class="text-3xl text-gray-300" />
							</div>
						</div>
					</template>
				</el-image>

				<!-- 商品标签 (Minimalist) -->
				<div
					v-if="item.is_recommend || item.is_topping"
					class="absolute top-3 left-3 flex flex-col gap-2">
					<span
						v-if="item.is_topping"
						class="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
						置顶
					</span>
					<span
						v-if="item.is_recommend"
						class="bg-[#ff6200] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
						推荐
					</span>
				</div>
			</div>

			<!-- 商品信息 -->
			<div class="py-4 px-1 space-y-1">
				<!-- 标题 -->
				<h3
					class="text-[15px] font-medium text-[#111] line-clamp-1 leading-normal group-hover:text-gray-600 transition-colors"
					:title="item.title">
					{{ item.title }}
				</h3>

				<!-- 子标题/描述 (Optional, using category for now) -->
				<p class="text-sm text-gray-500 line-clamp-1">
					{{ item.category_name || "精选商品" }}
				</p>

				<!-- 价格 -->
				<div class="mt-2 flex items-center justify-between">
					<div class="text-[16px] font-semibold text-[#111]">
						¥{{ formatPrice(item.price) }}
					</div>
					<div
						v-if="item.sales"
						class="text-xs text-gray-400">
						已售 {{ item.sales }}
					</div>
				</div>
			</div>
		</NuxtLink>
	</article>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";

	interface Props {
		item: any;
	}

	defineProps<Props>();

	const formatPrice = (price: number | string): string => {
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(0); // Nike often uses whole numbers or simple decimals
	};
</script>
