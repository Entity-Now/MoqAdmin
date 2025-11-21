<template>
	<div
		ref="root"
		class="banner-carousel relative w-full h-[600px] lg:h-[100vh] overflow-hidden group bg-gray-900"
		tabindex="0"
		@keydown.left.prevent="prev"
		@keydown.right.prevent="next">
		<!-- Navigation Buttons -->
		<div
			class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 lg:px-8 z-30 pointer-events-none">
			<button
				v-if="props.items.length > 1"
				class="nav-btn group/btn pointer-events-auto"
				aria-label="Previous Slide"
				@click="prev">
				<Icon
					name="fas fa-chevron-left"
					class="text-xl transition-transform group-hover/btn:-translate-x-0.5" />
			</button>
			<button
				v-if="props.items.length > 1"
				class="nav-btn group/btn pointer-events-auto"
				aria-label="Next Slide"
				@click="next">
				<Icon
					name="fas fa-chevron-right"
					class="text-xl transition-transform group-hover/btn:translate-x-0.5" />
			</button>
		</div>

		<!-- Track -->
		<div class="absolute inset-0 w-full h-full">
			<div
				class="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
				:class="{ 'duration-0': !transitioning }"
				:style="{ transform: `translateX(-${innerIndex * 100}%)` }">
				<div
					v-for="(item, idx) in list"
					:key="idx"
					class="relative w-full h-full flex-shrink-0">
					<!-- Background Image -->
					<div class="absolute inset-0 overflow-hidden">
						<img
							v-if="item.image"
							:src="item.image"
							:alt="item.title ?? 'Banner'"
							class="w-full h-full object-cover transition-transform duration-[10s] ease-linear hover:scale-105" />
						<div
							v-else
							class="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>

						<!-- Overlay Gradient -->
						<div
							class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
					</div>

					<!-- Content -->
					<div
						class="relative h-full max-w-[1450px] mx-auto px-6 lg:px-12 flex items-center z-20">
						<div
							class="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
							<!-- Text Content -->
							<div class="lg:col-span-7 space-y-8">
								<Motion
									as="div"
									initial="hidden"
									while-in-view="visible"
									viewport-once
									class="space-y-6">
									<Motion
										as="h1"
										:variants="{
											hidden: { opacity: 0, y: 30 },
											visible: {
												opacity: 1,
												y: 0,
												transition: {
													duration: 0.8,
													ease: 'easeOut',
												},
											},
										}"
										class="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
										{{
											item.title ?? "Discover Excellence"
										}}
									</Motion>

									<Motion
										as="p"
										v-if="item.desc"
										:variants="{
											hidden: { opacity: 0, y: 20 },
											visible: {
												opacity: 1,
												y: 0,
												transition: {
													delay: 0.2,
													duration: 0.8,
												},
											},
										}"
										class="text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed font-light">
										{{ item.desc }}
									</Motion>

									<Motion
										as="div"
										v-if="item.button"
										:variants="{
											hidden: { opacity: 0, y: 20 },
											visible: {
												opacity: 1,
												y: 0,
												transition: {
													delay: 0.4,
													duration: 0.8,
												},
											},
										}"
										class="pt-4">
										<NuxtLink
											:to="item.url ?? '#'"
											:target="item.target ?? '_self'"
											class="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
											<span>{{ item.button }}</span>
											<Icon
												name="fas fa-arrow-right"
												class="text-sm" />
										</NuxtLink>
									</Motion>
								</Motion>
							</div>

							<!-- Secondary Image (Product/Feature) -->
							<div
								v-if="item.secondImage"
								class="hidden lg:block lg:col-span-5 relative">
								<Motion
									as="div"
									initial="hidden"
									while-in-view="visible"
									viewport-once
									:variants="{
										hidden: {
											opacity: 0,
											x: 50,
											scale: 0.95,
										},
										visible: {
											opacity: 1,
											x: 0,
											scale: 1,
											transition: {
												delay: 0.3,
												duration: 0.8,
											},
										},
									}"
									class="relative z-10">
									<div
										class="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10 bg-white/5 backdrop-blur-sm p-4">
										<img
											:src="item.secondImage"
											:alt="item.title"
											class="w-full h-auto rounded-xl transform transition-transform duration-500 hover:scale-[1.02]" />
									</div>
									<!-- Decorative Elements -->
									<div
										class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
									<div
										class="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
								</Motion>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Indicators -->
		<div
			v-if="props.items.length > 1"
			class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
			<button
				v-for="(_, i) in props.items"
				:key="i"
				@click.stop="goTo(i)"
				class="h-1.5 rounded-full transition-all duration-500"
				:class="[
					i === current
						? 'w-12 bg-white'
						: 'w-2 bg-white/40 hover:bg-white/60',
				]"
				:aria-label="`Go to slide ${i + 1}`" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from "vue";
	import Icon from "~/components/Icon/index.vue";
	import { Motion } from "motion-v";
	import { useCarousel } from "~/composables/useCarousel";

	interface BannerItem {
		image?: string;
		title?: string;
		desc?: string;
		secondImage?: string;
		button?: string;
		url?: string;
		target?: string;
	}

	const props = defineProps<{
		items: BannerItem[];
		autoplay?: boolean;
		interval?: number;
	}>();

	const {
		list,
		innerIndex,
		current,
		goTo,
		next,
		prev,
		transitioning,
		start: startAutoplay,
		stop: stopAutoplay,
	} = useCarousel(props.items, {
		autoplay: props.autoplay ?? true,
		interval: props.interval ?? 6000,
	});

	const root = ref<HTMLElement | null>(null);
	let mouseEnterHandler: (() => void) | null = null;
	let mouseLeaveHandler: (() => void) | null = null;

	onMounted(() => {
		if (!root.value) return;

		mouseEnterHandler = () => stopAutoplay();
		mouseLeaveHandler = () => startAutoplay();

		root.value.addEventListener("mouseenter", mouseEnterHandler);
		root.value.addEventListener("mouseleave", mouseLeaveHandler);
	});

	onBeforeUnmount(() => {
		if (root.value && mouseEnterHandler && mouseLeaveHandler) {
			root.value.removeEventListener("mouseenter", mouseEnterHandler);
			root.value.removeEventListener("mouseleave", mouseLeaveHandler);
		}
	});
</script>

<style scoped>
	.nav-btn {
		@apply w-12 h-12 rounded-full flex items-center justify-center
         bg-white/10 backdrop-blur-md border border-white/20
         text-white transition-all duration-300
         hover:bg-white hover:text-gray-900 hover:scale-110
         active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50;
	}
</style>
