<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full bg-white dark:bg-slate-900">
				<!-- Hero Section with Carousel -->
				<section class="w-full relative">
					<Carousel :items="pageData.banner" />
				</section>

				<!-- Photo Gallery with Marquee -->
				<section class="py-20 bg-background overflow-hidden relative">
					<div class="mb-12 text-center">
						<span
							class="text-primary/60 font-semibold tracking-widest uppercase text-xs"
							>精彩聚焦</span
						>
						<h2
							class="mt-4 text-4xl lg:text-5xl font-nike tracking-tight text-foreground uppercase">
							精选系列
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
					class="py-24 lg:py-40 bg-secondary/30 dark:bg-secondary/10">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-16">
							<span
								class="text-primary font-bold tracking-widest uppercase text-xs"
								>为您推荐</span
							>
							<h2
								class="mt-4 text-4xl lg:text-6xl font-nike tracking-tighter text-foreground uppercase">
								不容错过
							</h2>

							<!-- Category Tabs (Sticky) -->
							<div
								class="sticky top-20 z-20 flex flex-wrap justify-center gap-3 py-10">
								<button
									v-for="cat in pageData.product_categories"
									:key="cat.id"
									@click="fetchProducts(cat.id)"
									:class="[
										'px-8 py-3 rounded-full transition-all duration-500 font-medium text-sm tracking-wide border-0 cursor-pointer',
										activeCategory === cat.id
											? 'bg-primary text-primary-foreground shadow-xl'
											: 'bg-background/80 backdrop-blur-md text-foreground/60 hover:text-primary',
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
										class="block text-xl font-nike tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
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
												class="text-2xl font-nike font-bold text-primary">
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
				<section class="py-24 lg:py-40 relative overflow-hidden">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-20">
							<span
								class="text-primary font-bold tracking-widest uppercase text-xs"
								>为什么选择我们</span
							>
							<h2
								class="mt-4 text-4xl lg:text-6xl font-nike tracking-tighter text-foreground uppercase">
								核心功能
							</h2>
						</div>

						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
							<div
								v-for="(item, index) in pageData.feature"
								:key="item.title"
								class="relative h-full rounded-4xl border p-2 md:p-3 bg-secondary/10 border-white/10 group">
								<GlowingEffect
									:blur="0"
									:border-width="3"
									:spread="40"
									:glow="true"
									:disabled="false"
									:proximity="64"
									:inactive-zone="0.01" />
								<div
									class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-4xl border-0.75 p-8 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-10 bg-background/80 backdrop-blur-md transition-all duration-500 group-hover:bg-background">
									<div
										class="relative flex flex-1 flex-col justify-between gap-8">
										<div
											class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
											<Icon
												:name="item.icon"
												class="text-3xl text-primary group-hover:text-inherit" />
										</div>
										<div class="space-y-4">
											<h3
												class="text-2xl font-nike tracking-tight text-foreground">
												{{ item.title }}
											</h3>
											<p
												class="text-muted-foreground leading-relaxed">
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
				<section class="py-24 lg:py-40 relative overflow-hidden">
					<div
						class="max-w-[1450px] mx-auto px-6 lg:px-12 relative z-10">
						<div class="grid lg:grid-cols-2 gap-20 items-center">
							<div class="space-y-12">
								<div>
									<span
										class="text-primary font-bold tracking-widest uppercase text-xs"
										>技术前沿</span
									>
									<h2
										class="mt-6 text-4xl lg:text-6xl font-nike tracking-tighter text-foreground uppercase leading-tight">
										打造
										<span class="text-primary"
											>卓越性能</span
										>,<br />
										成就无限扩展
									</h2>
								</div>

								<div class="grid sm:grid-cols-2 gap-8">
									<Motion
										v-for="(item, idx) in techFeatures"
										:key="idx"
										as="div"
										:initial="{ opacity: 0, y: 20 }"
										:while-in-view="{ opacity: 1, y: 0 }"
										:transition="{ delay: idx * 0.1 }"
										viewport-once
										class="group">
										<div
											class="w-14 h-14 rounded-2xl bg-secondary/50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
											<Icon
												name="fa-solid fa-check"
												class="text-xl" />
										</div>
										<h4
											class="text-xl font-nike tracking-tight text-foreground mb-3">
											{{ item.title }}
										</h4>
										<p
											class="text-muted-foreground text-sm leading-relaxed">
											{{ item.desc }}
										</p>
									</Motion>
								</div>
							</div>

							<div class="relative group">
								<div
									class="absolute -inset-4 bg-linear-to-tr from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
								<div
									class="relative aspect-square rounded-4xl overflow-hidden border border-white/20 shadow-2xl">
									<img
										src="~/public/development.png"
										alt="Development"
										class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
									<div
										class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
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
					class="py-24 lg:py-40 bg-secondary/30 dark:bg-secondary/10">
					<div class="max-w-[900px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-20">
							<span
								class="text-primary font-bold tracking-widest uppercase text-xs"
								>服务支持</span
							>
							<h2
								class="mt-4 text-4xl lg:text-6xl font-nike tracking-tighter text-foreground uppercase">
								常见问题
							</h2>
						</div>

						<div class="space-y-4">
							<Disclosure
								v-for="item in pageData.questions"
								:key="item.title"
								as="div"
								v-slot="{ open }">
								<div
									class="bg-background/80 backdrop-blur-md rounded-4xl overflow-hidden border border-white/20 shadow-sm transition-all duration-300"
									:class="{
										'shadow-xl ring-1 ring-primary/20':
											open,
									}">
									<DisclosureButton
										class="flex w-full items-center justify-between px-8 py-8 text-left group">
										<span
											class="text-xl font-nike tracking-tight text-foreground group-hover:text-primary transition-colors"
											>{{ item.title }}</span
										>
										<div
											class="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center transition-transform duration-500"
											:class="{
												'rotate-180 bg-primary text-primary-foreground':
													open,
											}">
											<Icon
												name="fas fa-chevron-down"
												class="text-xs" />
										</div>
									</DisclosureButton>
									<TransitionRoot
										:show="open"
										enter="transition-all duration-500 ease-out"
										enter-from="opacity-0 max-h-0"
										enter-to="opacity-100 max-h-96"
										leave="transition-all duration-300 ease-in"
										leave-from="opacity-100 max-h-96"
										leave-to="opacity-0 max-h-0">
										<DisclosurePanel
											class="px-8 pb-8 pt-0 text-muted-foreground leading-relaxed text-lg">
											{{ item.desc }}
										</DisclosurePanel>
									</TransitionRoot>
								</div>
							</Disclosure>
						</div>
					</div>
				</section>

				<!-- Articles Section -->
				<section class="py-24 lg:py-40">
					<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
						<div
							class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
							<div>
								<span
									class="text-primary font-bold tracking-widest uppercase text-xs"
									>知识库</span
								>
								<h2
									class="mt-4 text-4xl lg:text-6xl font-nike tracking-tighter text-foreground uppercase">
									最新动态
								</h2>
							</div>
							<NuxtLink
								to="/article/lists"
								class="group flex items-center gap-3 text-lg font-nike tracking-tight text-foreground hover:text-primary transition-colors">
								查看所有文章
								<div
									class="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
									<Icon
										name="fas fa-arrow-right"
										class="text-xs" />
								</div>
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
			name: "支付宝",
			designation: "安全支付",
			image: alipayImg,
		},
		{
			id: 2,
			name: "微信支付",
			designation: "便捷移动支付",
			image: wechatImg,
		},
		{
			id: 3,
			name: "PayPal",
			designation: "国际支付标准",
			image: paypalImg,
		},
		{
			id: 4,
			name: "银行卡",
			designation: "信用卡/借记卡",
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
