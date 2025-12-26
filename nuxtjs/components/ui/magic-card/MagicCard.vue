<template>
	<div
		:class="
			cn(
				'group relative flex size-full overflow-hidden rounded-xl border bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white',
				className
			)
		">
		<div class="relative z-10 size-full">
			<slot />
		</div>
		<div
			class="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 transition-opacity duration-300 group-hover:opacity-100"
			:style="{
				background: `radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
				opacity: gradientOpacity,
			}" />
		<div
			class="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			:style="{
				background: `radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, transparent 100%)`,
			}" />
	</div>
</template>

<script setup lang="ts">
	import { useMouse } from "@vueuse/core";
	import { cn } from "@/lib/utils";
	import { computed, ref } from "vue";

	interface Props {
		className?: string;
		gradientSize?: number;
		gradientColor?: string;
		gradientFrom?: string;
		gradientOpacity?: number;
	}

	const props = withDefaults(defineProps<Props>(), {
		gradientSize: 200,
		gradientColor: "#262626",
		gradientFrom: "#9E7AFF",
		gradientOpacity: 0.8,
	});

	const { x, y } = useMouse();
	const mouseX = computed(
		() => x.value - (el.value?.getBoundingClientRect().left ?? 0)
	);
	const mouseY = computed(
		() => y.value - (el.value?.getBoundingClientRect().top ?? 0)
	);

	const el = ref<HTMLElement | null>(null);
</script>
