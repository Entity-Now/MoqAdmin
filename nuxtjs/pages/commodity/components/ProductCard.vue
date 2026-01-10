<template>
	<article
		class="group relative flex flex-col bg-background overflow-hidden transition-all duration-300">
		<NuxtLink
			:to="`/commodity/detail/${item.id}`"
			class="block flex-1">
			<!-- 商品图片容器 (Nike Style: Square and clean) -->
			<div class="relative aspect-square overflow-hidden bg-secondary">
				<el-image
					:src="
						item?.main_image || `/static/default/images/no-img.png`
					"
					:alt="item.title"
					fit="cover"
					class="w-full h-full transition-transform duration-700 group-hover:scale-105"
					lazy>
					<template #error>
						<div
							class="w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground">
							<Icon
								name="fa-solid fa-image"
								class="text-3xl mb-2" />
							<span class="text-xs">Image not found</span>
						</div>
					</template>
					<template #placeholder>
						<div
							class="w-full h-full flex items-center justify-center bg-secondary">
							<div class="animate-pulse">
								<Icon
									name="fa-solid fa-image"
									class="text-3xl text-muted-foreground/30" />
							</div>
						</div>
					</template>
				</el-image>

				<!-- 商品标签 (Minimalist) -->
				<div
					v-if="item.is_recommend || item.is_topping"
					class="absolute top-4 left-4 flex flex-col gap-2">
					<span
						v-if="item.is_topping"
						class="bg-primary text-primary-foreground text-[10px] font-nike font-bold px-2 py-0.5 uppercase tracking-widest">
						TOP
					</span>
					<span
						v-if="item.is_recommend"
						class="bg-destructive text-destructive-foreground text-[10px] font-nike font-bold px-2 py-0.5 uppercase tracking-widest">
						MUST-HAVE
					</span>
				</div>
			</div>

			<!-- 商品信息 -->
			<div class="py-5 px-1 space-y-1">
				<!-- 标题 -->
				<h3
					class="text-[16px] font-medium text-foreground line-clamp-1 leading-normal group-hover:opacity-70 transition-all"
					:title="item.title">
					{{ item.title }}
				</h3>

				<!-- 子标题/描述 (Optional, using category for now) -->
				<p
					class="text-sm text-muted-foreground line-clamp-1 font-medium">
					{{ item.category_name || "Featured" }}
				</p>

				<!-- 价格 -->
				<div class="mt-3 flex items-center justify-between">
					<div
						class="text-[17px] font-nike font-semibold text-foreground">
						¥{{ formatPrice(item.price) }}
					</div>
					<div
						v-if="item.sales"
						class="text-xs text-muted-foreground/60 font-medium">
						{{ item.sales }} sold
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
