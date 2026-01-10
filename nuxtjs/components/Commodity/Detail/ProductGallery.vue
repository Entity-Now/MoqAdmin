<template>
	<div class="flex flex-col lg:flex-row gap-4">
		<!-- 缩略图列表 -->
		<div
			v-if="images.length > 1"
			class="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:max-h-[600px] py-1">
			<button
				v-for="(img, index) in images"
				:key="index"
				type="button"
				class="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all duration-500 focus:outline-none focus:ring-1 focus:ring-primary"
				:class="
					activeIndex === index
						? 'border-primary opacity-100 scale-105 shadow-md'
						: 'border-transparent opacity-60 hover:opacity-100 hover:border-border'
				"
				@click="selectImage(index)">
				<img
					:src="img"
					class="w-full h-full object-cover"
					alt="thumbnail" />
			</button>
		</div>

		<!-- 主图显示区域 -->
		<div
			class="order-1 lg:order-2 flex-1 relative bg-secondary rounded-2xl overflow-hidden aspect-square group"
			tabindex="0"
			@keydown.left.prevent="prevImage"
			@keydown.right.prevent="nextImage"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<!-- 放大镜 -->
			<Lens
				v-if="currentImage"
				:src="currentImage"
				:alt="title"
				:zoom-factor="2.5"
				:lens-size="200"
				img-class="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
				class="w-full h-full" />
			<div
				v-else
				class="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
				<Icon
					name="fa-solid fa-image"
					class="text-6xl" />
			</div>

			<!-- 左右切换按钮（仅有多张图时显示） -->
			<template v-if="images.length > 1">
				<button
					type="button"
					class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/40 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center text-foreground hover:bg-background transition-all duration-500 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
					aria-label="Previous"
					@click.stop="prevImage">
					<Icon
						name="fa-solid fa-chevron-left"
						class="text-lg" />
				</button>

				<button
					type="button"
					class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/40 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center text-foreground hover:bg-background transition-all duration-500 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
					aria-label="Next"
					@click.stop="nextImage">
					<Icon
						name="fa-solid fa-chevron-right"
						class="text-lg" />
				</button>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import Icon from "~/components/Icon/index.vue";
	import Lens from "~/components/ui/lens/Lens.vue";

	interface Props {
		images: string[];
		title: string;
	}

	const props = defineProps<Props>();

	const activeIndex = ref(0);

	const currentImage = computed(() => props.images[activeIndex.value] || "");

	// 切换到指定索引
	const selectImage = (index: number) => {
		activeIndex.value = index;
	};

	// 上一张（循环）
	const prevImage = () => {
		if (props.images.length === 0) return;
		activeIndex.value =
			activeIndex.value === 0
				? props.images.length - 1
				: activeIndex.value - 1;
	};

	// 下一张（循环）
	const nextImage = () => {
		if (props.images.length === 0) return;
		activeIndex.value =
			activeIndex.value === props.images.length - 1
				? 0
				: activeIndex.value + 1;
	};

	// 移动端滑动切换
	let touchStartX = 0;
	let touchEndX = 0;

	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchMove = (e: TouchEvent) => {
		touchEndX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = () => {
		if (!touchStartX || !touchEndX) return;
		const distance = touchStartX - touchEndX;
		const minSwipeDistance = 50;

		if (Math.abs(distance) > minSwipeDistance) {
			if (distance > 0) {
				nextImage();
			} else {
				prevImage();
			}
		}
		touchStartX = 0;
		touchEndX = 0;
	};
</script>

<style scoped>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
