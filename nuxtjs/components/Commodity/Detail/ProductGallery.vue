<template>
	<div class="flex flex-col lg:flex-row gap-4">
		<!-- 缩略图列表 -->
		<div
			v-if="images.length > 1"
			class="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:max-h-[600px]">
			<button
				v-for="(img, index) in images"
				:key="index"
				type="button"
				class="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
				:class="
					activeIndex === index
						? 'border-slate-900 dark:border-slate-200 opacity-100 scale-105'
						: 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-600'
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
			class="order-1 lg:order-2 flex-1 relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-3/2 group"
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
				:zoom-factor="3"
				:lens-size="250"
				img-class="w-full h-full object-contain transition-opacity duration-300"
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
					class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-black transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
					aria-label="上一张图片"
					@click.stop="prevImage">
					<Icon
						name="fa-solid fa-chevron-left"
						class="text-lg lg:text-xl" />
				</button>

				<button
					type="button"
					class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-black transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
					aria-label="下一张图片"
					@click.stop="nextImage">
					<Icon
						name="fa-solid fa-chevron-right"
						class="text-lg lg:text-xl" />
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
