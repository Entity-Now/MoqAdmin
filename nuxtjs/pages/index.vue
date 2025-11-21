<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full bg-white dark:bg-slate-900">
				<!-- Hero Section with Carousel -->
				<section class="w-full relative">
					<Carousel :items="pageData.banner" />
				</section>

				<!-- Brand Introduction / Vision -->
				<section
					class="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
					<div
						class="max-w-[1450px] mx-auto px-6 lg:px-12 text-center">
						<Motion
							as="div"
							initial="hidden"
							while-in-view="visible"
							viewport-once
							:variants="{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.8 },
								},
							}"
							class="max-w-3xl mx-auto space-y-6">
							<h2
								class="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
								创新与时尚的融合
							</h2>
							<p
								class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
								我们弥合了尖端软件解决方案与高端时尚零售之间的鸿沟。通过我们的集成平台，体验商业的未来。
							</p>
						</Motion>
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
								核心功能
							</h2>
						</div>

						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
							<Motion
								v-for="(item, index) in pageData.feature"
								:key="item.title"
								as="div"
								:initial="{ opacity: 0, y: 30 }"
								:while-in-view="{ opacity: 1, y: 0 }"
								:transition="{
									delay: index * 0.1,
									duration: 0.6,
								}"
								viewport-once
								class="group relative p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
								<div
									class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
									<Icon
										:name="item.icon"
										class="text-3xl text-indigo-600 dark:text-indigo-400" />
								</div>
								<h3
									class="text-xl font-bold text-slate-900 dark:text-white mb-4">
									{{ item.title }}
								</h3>
								<p
									class="text-slate-600 dark:text-slate-400 leading-relaxed">
									{{ item.desc }}
								</p>

								<!-- Hover Gradient Border -->
								<div
									class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-500/10 transition-colors duration-500 pointer-events-none"></div>
							</Motion>
						</div>
					</div>
				</section>

				<!-- Tech & Service Section -->
				<section
					class="py-20 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
					<!-- Background Decoration -->
					<div
						class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent pointer-events-none"></div>

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
										class="mt-3 text-3xl lg:text-5xl font-bold leading-tight">
										Built for Performance,<br />Designed for
										Scale
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
											class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
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
									class="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
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
							class="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
							<img
								src="~/public/alipay.png"
								alt="Alipay"
								class="h-10 w-auto object-contain" />
							<img
								src="~/public/wechat.png"
								alt="WeChat Pay"
								class="h-10 w-auto object-contain" />
							<img
								src="~/public/paypal.png"
								alt="PayPal"
								class="h-10 w-auto object-contain" />
							<img
								src="~/public/bankCard.png"
								alt="Bank Card"
								class="h-10 w-auto object-contain" />
						</div>
					</div>
				</section>

				<!-- FAQ Section -->
				<section
					class="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
					<div class="max-w-[1000px] mx-auto px-6 lg:px-12">
						<div class="text-center mb-16">
							<h2
								class="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
								常见问题
							</h2>
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
								to="/articles"
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
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		TransitionRoot,
	} from "@headlessui/vue";
	import { Motion } from "motion-v";

	// Page Data
	const { data: pageData } = await useAsyncData(() => appApi.homing(), {
		default() {
			return {
				banner: [],
				feature: [],
				questions: [],
				articles: [], // Assuming structure
			} as any; // Relaxed type for demo, ideally use AppHomingResponse
		},
	});

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
