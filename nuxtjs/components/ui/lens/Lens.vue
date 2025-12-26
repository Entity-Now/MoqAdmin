<template>
	<div
		ref="containerRef"
		class="relative overflow-hidden cursor-none group"
		@mouseenter="isHovering = true"
		@mouseleave="isHovering = false"
		@mousemove="handleMouseMove">
		<!-- Original Image -->
		<img
			:src="src"
			:alt="alt"
			class="w-full h-full object-cover"
			:class="imgClass" />

		<!-- Lens/Magnifier -->
		<div
			v-show="isHovering"
			class="absolute border-2 border-white/50 rounded-full shadow-xl pointer-events-none z-50 overflow-hidden bg-no-repeat"
			:style="{
				width: `${lensSize}px`,
				height: `${lensSize}px`,
				left: `${lensPosition.x}px`,
				top: `${lensPosition.y}px`,
				backgroundImage: `url('${src}')`,
				backgroundSize: `${containerSize.width * zoomFactor}px ${
					containerSize.height * zoomFactor
				}px`,
				backgroundPosition: `-${bgPosition.x}px -${bgPosition.y}px`,
				transform: 'translate(-50%, -50%)',
			}"></div>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from "vue";
	import { useElementBounding } from "@vueuse/core";

	interface Props {
		src: string;
		alt?: string;
		zoomFactor?: number;
		lensSize?: number;
		imgClass?: string;
	}

	const props = withDefaults(defineProps<Props>(), {
		alt: "",
		zoomFactor: 2.5,
		lensSize: 200,
		imgClass: "",
	});

	const containerRef = ref<HTMLElement | null>(null);
	const { width, height, left, top } = useElementBounding(containerRef);

	const isHovering = ref(false);
	const mousePosition = reactive({ x: 0, y: 0 });

	const containerSize = reactive({ width: 0, height: 0 });

	// Update container size on mouse move to ensure accuracy (or use ResizeObserver if needed)
	const handleMouseMove = (e: MouseEvent) => {
		if (!containerRef.value) return;

		// Update container dimensions
		containerSize.width = width.value;
		containerSize.height = height.value;

		// Calculate relative mouse position
		const x = e.clientX - left.value;
		const y = e.clientY - top.value;

		// Clamp position within container
		mousePosition.x = Math.max(0, Math.min(x, width.value));
		mousePosition.y = Math.max(0, Math.min(y, height.value));
	};

	const lensPosition = computed(() => ({
		x: mousePosition.x,
		y: mousePosition.y,
	}));

	const bgPosition = computed(() => ({
		x: mousePosition.x * props.zoomFactor - props.lensSize / 2,
		y: mousePosition.y * props.zoomFactor - props.lensSize / 2,
	}));
</script>
