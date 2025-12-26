<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full bg-white dark:bg-slate-900">
				<!-- Hero Section with Carousel -->
				<section class="w-full relative">
					<Carousel :items="pageData.banner" />
				</section>

				<!-- Photo Gallery with Marquee -->
				<section
					class="py-10 bg-white dark:bg-slate-900 overflow-hidden">
					<div class="mb-8 text-center">
						<span
							class="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
							>我们的产品</span
						>
						<h2
							class="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
							产品展示
						</h2>
					</div>
					<Marquee
						pauseOnHover
						class="[--duration:20s]">
						<div
							v-for="(img, i) in galleryImages"
							:key="i"
							class="mx-4 w-64 h-40 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
							<img
								:src="img"
								class="w-full h-full object-cover"
								alt="Gallery Image" />
						</div>
					</Marquee>
				</section>

				<!-- Product Recommendation -->
				<section
					class="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-12">
							<span
								class="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
								>精选好物</span
							>
							<h2
								class="mt-3 text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
								热门推荐
							</h2>

							<!-- Category Tabs (Sticky) -->
							<div
								class="sticky top-0 z-20 flex flex-wrap justify-center gap-4 py-8 bg-slate-50 dark:bg-slate-900/50">
								<button
									v-for="cat in pageData.product_categories"
									:key="cat.id"
									@click="fetchProducts(cat.id)"
									:class="[
										'px-6 py-2 rounded-full transition-all duration-300 border cursor-pointer',
										activeCategory === cat.id
											? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
											: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500',
									]">
									{{ cat.title }}
								</button>
							</div>
						</div>
						<BentoGrid
							:class="
								cn(
									'grid md:auto-rows-[28rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto'
								)
							">
							<BentoGridItem
								v-for="(item, i) in recommendedProducts"
								:key="i"
								:class="
									cn(
										'cursor-pointer group overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
										'shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2'
									)
								"
								@click="
									navigateTo(`/commodity/detail/${item.id}`)
								">
								<!-- Header: 严格 9:16 竖版图片 -->
								<template #header>
									<div
										class="relative w-full aspect-9/16 overflow-hidden bg-gray-100 dark:bg-gray-800">
										<img
											:src="
												item.image || '/placeholder.jpg'
											"
											:alt="item.title"
											class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-95"
											loading="lazy" />
										<!-- 底部渐变遮罩 + hover 加强，增加高端感 -->
										<div
											class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
										<!-- 可选：轻微内发光边框 -->
										<div
											class="absolute inset-0 ring-1 ring-inset ring-white/20"></div>
									</div>
								</template>

								<!-- Title: 单行，超出隐藏，不换行 -->
								<template #title>
									<NuxtLink
										:to="`/commodity/detail/${item.id}`"
										class="block text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
										{{ item.title }}
									</NuxtLink>
								</template>

								<!-- Description (原 subtitle): 单行，超出隐藏，不换行 -->
								<template #description>
									<div class="mt-3 space-y-3">
										<!-- 简介文字：单行截断 -->
										<p
											class="text-sm text-gray-600 dark:text-gray-400 truncate">
											{{ item.intro || "暂无简介" }}
										</p>

										<!-- 价格：突出显示 -->
										<div
											class="flex justify-between items-center">
											<span
												class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
												¥{{ item.price }}
											</span>
											<!-- 可选：添加一个小标签，如“热销” -->
											<!-- <span class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full">热销</span> -->
										</div>
									</div>
								</template>
							</BentoGridItem>
						</BentoGrid>
					</div>
				</section>

				<!-- Features Grid -->
				<section class="py-20 lg:py-32 relative overflow-hidden">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-20">
							<span
								class="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
								>为什么选择我们</span
							>
							<h2
								class="mt-3 text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
								核心特征
							</h2>
						</div>

						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
							<div
								v-for="(item, index) in pageData.feature"
								:key="item.title"
								class="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
								<GlowingEffect
									:blur="0"
									:border-width="3"
									:spread="40"
									:glow="true"
									:disabled="false"
									:proximity="64"
									:inactive-zone="0.01" />
								<div
									class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6 bg-white dark:bg-slate-900">
									<div
										class="relative flex flex-1 flex-col justify-between gap-3">
										<div
											class="w-fit rounded-lg border border-gray-200 p-2 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-500/10">
											<Icon
												:name="item.icon"
												class="text-2xl text-indigo-600 dark:text-indigo-400" />
										</div>
										<div class="space-y-3">
											<h3
												class="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
												{{ item.title }}
											</h3>
											<p
												class="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-black dark:text-neutral-400">
												{{ item.desc }}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Tech & Service Section -->
				<section
					class="py-20 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
					<!-- Background Decoration -->
					<div
						class="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-indigo-900/20 to-transparent pointer-events-none"></div>

					<div
						class="max-w-[1450px] mx-auto px-6 lg:px-12 relative z-10">
						<div class="grid lg:grid-cols-2 gap-16 items-center">
							<div class="space-y-10">
								<div>
									<span
										class="text-indigo-400 font-semibold tracking-wider uppercase text-sm"
										>技术优先</span
									>
									<h2
										class="mt-3 text-3xl lg:text-5xl font-bold leading-tight text-white">
										Built for Performance,<br />
										Designed for Scale
									</h2>
								</div>

								<div class="space-y-6">
									<Motion
										v-for="(item, idx) in techFeatures"
										:key="idx"
										as="div"
										:initial="{ opacity: 0, x: -20 }"
										:while-in-view="{ opacity: 1, x: 0 }"
										:transition="{ delay: idx * 0.1 }"
										viewport-once
										class="flex items-start gap-4">
										<div
											class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
											<Icon
												name="fa-solid	 fa-check"
												class="text-indigo-400" />
										</div>
										<div>
											<h4
												class="text-lg font-semibold text-white">
												{{ item.title }}
											</h4>
											<p class="text-slate-400 mt-1">
												{{ item.desc }}
											</p>
										</div>
									</Motion>
								</div>
							</div>

							<div class="relative">
								<div
									class="aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-indigo-500 to-purple-600 p-1">
									<div
										class="w-full h-full bg-slate-900 rounded-[22px] overflow-hidden relative">
										<img
											src="~/public/development.png"
											alt="Development"
											class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Payment Methods -->
				<section
					class="py-20 border-b border-slate-100 dark:border-slate-800">
					<div
						class="max-w-[1450px] mx-auto px-6 lg:px-12 text-center">
						<p
							class="text-slate-500 dark:text-slate-400 mb-8 font-medium">
							受信任的支付合作伙伴
						</p>
						<div
							class="flex flex-wrap justify-center gap-8 lg:gap-16 items-center">
							<AnimatedTooltip :items="paymentMethods" />
						</div>
					</div>
				</section>
				<!-- FAQ Section -->
				<section
					class="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
					<div class="max-w-[1000px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-16">
							<RadiantText
								class="text-3xl lg:text-4xl font-bold"
								:duration="5">
								常见问题
							</RadiantText>
						</div>

						<div class="space-y-4">
							<Disclosure
								v-for="item in pageData.questions"
								:key="item.title"
								as="div"
								v-slot="{ open }"
								class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
								<DisclosureButton
									class="flex w-full items-center justify-between px-8 py-6 text-left">
									<span
										class="text-lg font-semibold text-slate-900 dark:text-white"
										>{{ item.title }}</span
									>
									<Icon
										name="fas fa-chevron-down"
										:class="[
											open ? 'rotate-180' : '',
											'text-slate-400 transition-transform duration-300',
										]" />
								</DisclosureButton>
								<TransitionRoot
									:show="open"
									enter="transition-all duration-300 ease-out"
									enter-from="opacity-0 max-h-0"
									enter-to="opacity-100 max-h-96"
									leave="transition-all duration-200 ease-in"
									leave-from="opacity-100 max-h-96"
									leave-to="opacity-0 max-h-0">
									<DisclosurePanel
										class="px-8 pb-8 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed">
										{{ item.desc }}
									</DisclosurePanel>
								</TransitionRoot>
							</Disclosure>
						</div>
					</div>
				</section>

				<!-- Articles Section -->
				<section class="py-20 lg:py-32">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div class="flex items-end justify-between mb-12">
							<div>
								<span
									class="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm"
									>知识库</span
								>
								<h2
									class="mt-3 text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
									最新文章
								</h2>
							</div>
							<NuxtLink
								to="/article/lists"
								class="hidden md:flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
								View All <Icon name="fas fa-arrow-right" />
							</NuxtLink>
						</div>

						<ArticleTabs :data="pageData" />
					</div>
				</section>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import appApi from "~/api/app";
	import Carousel from "~/components/Carousel/index.vue";
	import Icon from "~/components/Icon/index.vue";
	import Globe from "~/components/ui/globe/Globe.vue";
	import RainbowButton from "~/components/ui/rainbow-button/RainbowButton.vue";
	import BentoGrid from "~/components/ui/bento-grid/BentoGrid.vue";
	import BentoGridItem from "~/components/ui/bento-grid/BentoGridItem.vue";
	import Marquee from "~/components/ui/marquee/Marquee.vue";
	import MagicCard from "~/components/ui/magic-card/MagicCard.vue";
	import AnimatedTooltip from "~/components/ui/animated-tooltip/AnimatedTooltip.vue";
	import GlowingEffect from "~/components/ui/glowing-effect/GlowingEffect.vue";
	import RadiantText from "~/components/ui/radiant-text/RadiantText.vue";
	import LineShadowText from "~/components/ui/line-shadow-text/LineShadowText.vue";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		TransitionRoot,
	} from "@headlessui/vue";
	import { Motion } from "motion-v";
	import { cn } from "@/lib/utils";

	// Import images for payment methods
	import alipayImg from "~/public/alipay.png";
	import wechatImg from "~/public/wechat.png";
	import paypalImg from "~/public/paypal.png";
	import bankCardImg from "~/public/bankCard.png";

	// Gallery Images (Placeholder - replace with real images if available)
	const galleryImages = [
		"/foot_list/1.webp",
		"/foot_list/7.webp",
		"/foot_list/3.webp",
		"/foot_list/4.webp",
		"/foot_list/5.webp",
		"/foot_list/6.webp",
	];

	// Payment Methods Data
	const paymentMethods = [
		{
			id: 1,
			name: "Alipay",
			designation: "Secure Payment",
			image: alipayImg,
		},
		{
			id: 2,
			name: "WeChat Pay",
			designation: "Easy Mobile Pay",
			image: wechatImg,
		},
		{
			id: 3,
			name: "PayPal",
			designation: "Global Standard",
			image: paypalImg,
		},
		{
			id: 4,
			name: "Bank Card",
			designation: "Credit/Debit",
			image: bankCardImg,
		},
	];

	// Page Data
	const { data: pageData } = await useAsyncData(() => appApi.homing(), {
		default() {
			return {
				banner: [],
				feature: [],
				questions: [],
				articles: [],
				product_categories: [],
			} as any;
		},
	});

	// Product Recommendation Logic
	const activeCategory = ref(0);
	const recommendedProducts = ref<any[]>([]);

	const fetchProducts = async (categoryId: number) => {
		activeCategory.value = categoryId;
		try {
			const res = await appApi.productRecommendation(categoryId);
			recommendedProducts.value = res;
		} catch (e) {
			console.error(e);
		}
	};

	// Initialize with first category if available
	watch(
		() => pageData.value.product_categories,
		(newVal) => {
			if (newVal && newVal.length > 0) {
				fetchProducts(newVal[0].id);
			}
		},
		{ immediate: true }
	);

	// Static Tech Features for the dark section
	const techFeatures = [
		{
			title: "专业团队",
			desc: "专家开发人员准备解决复杂挑战并确保稳定性。",
		},
		{
			title: "可扩展架构",
			desc: "系统设计以适应您的业务增长，确保长期可行性。",
		},
		{
			title: "严格测试",
			desc: "全面的 QA 测试流程以最小化错误并最大化用户满意度。",
		},
		{
			title: "快速响应",
			desc: "24/7 支持和快速处理关键更新和修复。",
		},
	];
</script>

<style scoped>
	/* Smooth scrolling for the whole page */
	html {
		scroll-behavior: smooth;
	}
</style>
