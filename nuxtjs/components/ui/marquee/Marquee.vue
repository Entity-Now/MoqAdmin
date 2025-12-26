<template>
	<div
		:class="
			cn(
				'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-(--gap)',
				{
					'flex-row': !vertical,
					'flex-col': vertical,
				},
				className
			)
		">
		<div
			v-for="i in repeat"
			:key="i"
			:class="
				cn('flex shrink-0 justify-around [gap:var(--gap)]', {
					'animate-marquee flex-row': !vertical,
					'animate-marquee-vertical flex-col': vertical,
					'group-hover:paused': pauseOnHover,
					'direction-[reverse]': reverse,
				})
			">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { cn } from "@/lib/utils";

	interface Props {
		className?: string;
		reverse?: boolean;
		pauseOnHover?: boolean;
		vertical?: boolean;
		repeat?: number;
	}

	withDefaults(defineProps<Props>(), {
		pauseOnHover: false,
		vertical: false,
		repeat: 4,
	});
</script>

<style scoped>
	.animate-marquee {
		animation: marquee var(--duration) linear infinite;
	}

	.animate-marquee-vertical {
		animation: marquee-vertical var(--duration) linear infinite;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - var(--gap)));
		}
	}

	@keyframes marquee-vertical {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(calc(-100% - var(--gap)));
		}
	}
</style>
