<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full bg-gray-50">
				<!-- 轮播图区域 -->
				<section class="w-full h-screen relative overflow-hidden">
					<Carousel :items="pageData.banner" />
				</section>

				<!-- 主体内容区 -->
				<div class="w-full flex flex-col items-center">
					<!-- 特性板块 -->
					<section
						class="w-full max-w-[1450px] px-4 md:px-8 py-16 md:py-24">
						<!-- 标题 -->
						<div class="text-center mb-12">
							<div
								class="flex items-center justify-center gap-4 mb-3">
								<span
									class="block h-0.5 w-16 bg-indigo-600"></span>
								<h2
									class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
									特性
								</h2>
								<span
									class="block h-0.5 w-16 bg-indigo-600"></span>
							</div>
							<p
								class="text-sm md:text-base text-gray-500 uppercase tracking-widest">
								Product Features
							</p>
						</div>

						<!-- 特性网格 -->
						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							<Motion
								as="div"
								v-bind="fromBottomToUp"
								v-for="item in pageData.feature"
								:key="item.title"
								class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
								<!-- 图标 -->
								<div
									class="w-14 h-14 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
									<Icon
										:name="item.icon"
										class="text-indigo-600 dark:text-indigo-400 text-2xl" />
								</div>

								<!-- 标题 -->
								<h3
									class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									{{ item.title }}
								</h3>

								<!-- 描述 -->
								<p
									class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
									{{ item.desc }}
								</p>
							</Motion>
						</div>
					</section>

					<!-- 多平台支付板块 -->
					<section
						class="w-full bg-white dark:bg-gray-800 py-16 md:py-24">
						<div class="w-full max-w-[1450px] mx-auto px-4 md:px-8">
							<!-- 标题 -->
							<div class="text-center mb-12">
								<div
									class="flex items-center justify-center gap-4 mb-3">
									<span
										class="block h-0.5 w-16 bg-indigo-600"></span>
									<h2
										class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
										多平台支付
									</h2>
									<span
										class="block h-0.5 w-16 bg-indigo-600"></span>
								</div>
								<p
									class="text-sm md:text-base text-gray-500 uppercase tracking-widest">
									Multiple Payment Methods
								</p>
							</div>

							<!-- 内容区 -->
							<div
								class="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
								<!-- 左侧图片 -->
								<div class="w-full max-w-[380px]">
									<img
										class="w-full h-auto rounded-2xl"
										src="~/public/play_success.png"
										alt="支付成功" />
								</div>

								<!-- 右侧支付选项 -->
								<div class="w-full max-w-[600px]">
									<div
										class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<!-- 支付宝 -->
										<Motion
											as="div"
											v-bind="GradientOpacity"
											class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
											<img
												class="w-12 h-12 rounded-full flex-shrink-0"
												src="~/public/alipay.png"
												alt="支付宝" />
											<span
												class="text-base font-medium text-gray-900 dark:text-white"
												>支付宝支付</span
											>
										</Motion>

										<!-- 微信 -->
										<Motion
											as="div"
											v-bind="GradientOpacity"
											class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
											<img
												class="w-12 h-12 rounded-full flex-shrink-0"
												src="~/public/wechat.png"
												alt="微信支付" />
											<span
												class="text-base font-medium text-gray-900 dark:text-white"
												>微信支付</span
											>
										</Motion>

										<!-- PayPal -->
										<Motion
											as="div"
											v-bind="GradientOpacity"
											class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
											<img
												class="w-12 h-12 rounded-full flex-shrink-0"
												src="~/public/paypal.png"
												alt="PayPal" />
											<span
												class="text-base font-medium text-gray-900 dark:text-white"
												>PayPal支付</span
											>
										</Motion>

										<!-- 银行卡 -->
										<Motion
											as="div"
											v-bind="GradientOpacity"
											class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
											<img
												class="w-12 h-12 rounded-full flex-shrink-0"
												src="~/public/bankCard.png"
												alt="银行卡" />
											<span
												class="text-base font-medium text-gray-900 dark:text-white"
												>银行卡支付</span
											>
										</Motion>

										<!-- 立即体验按钮 -->
										<Motion
											as-child
											v-bind="GradientOpacity">
											<NuxtLink
												class="col-span-1 sm:col-span-2"
												to="/login">
												<button
													class="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-indigo-700 hover:to-purple-700">
													立即体验
												</button>
											</NuxtLink>
										</Motion>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- 及时更新板块 -->
					<section
						class="w-full max-w-[1450px] px-4 md:px-8 py-16 md:py-24">
						<!-- 标题 -->
						<div class="text-center mb-12">
							<div
								class="flex items-center justify-center gap-4 mb-3">
								<span
									class="block h-0.5 w-16 bg-indigo-600"></span>
								<h2
									class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
									及时更新
								</h2>
								<span
									class="block h-0.5 w-16 bg-indigo-600"></span>
							</div>
							<p
								class="text-sm md:text-base text-gray-500 uppercase tracking-widest">
								Up To Date
							</p>
						</div>

						<!-- 内容区 -->
						<div
							class="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
							<!-- 左侧内容 -->
							<div
								class="w-full max-w-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
								<h3
									class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
									我们的技术优势，打造高效可靠的服务体验
								</h3>
								<ul class="space-y-5">
									<Motion
										as="li"
										:custom="1"
										v-bind="listFromBottomToUp"
										class="flex items-start gap-3">
										<div
											class="flex-shrink-0 w-6 h-6 mt-0.5">
											<img
												class="w-full h-full"
												src="~/public/hot.png"
												alt="hot" />
										</div>
										<div class="flex-1">
											<span
												class="font-semibold text-gray-900 dark:text-white"
												>专业程序员团队：</span
											>
											<span
												class="text-gray-600 dark:text-gray-400"
												>随时跟进和修复
												BUG，确保系统稳定运行。</span
											>
										</div>
									</Motion>
									<Motion
										as="li"
										:custom="2"
										v-bind="listFromBottomToUp"
										class="flex items-start gap-3">
										<div
											class="flex-shrink-0 w-6 h-6 mt-0.5">
											<img
												class="w-full h-full"
												src="~/public/hot.png"
												alt="hot" />
										</div>
										<div class="flex-1">
											<span
												class="font-semibold text-gray-900 dark:text-white"
												>精心设计的系统架构：</span
											>
											<span
												class="text-gray-600 dark:text-gray-400"
												>易于更新与迭代，为未来的发展和扩展提供保障。</span
											>
										</div>
									</Motion>
									<Motion
										as="li"
										:custom="3"
										v-bind="listFromBottomToUp"
										class="flex items-start gap-3">
										<div
											class="flex-shrink-0 w-6 h-6 mt-0.5">
											<img
												class="w-full h-full"
												src="~/public/hot.png"
												alt="hot" />
										</div>
										<div class="flex-1">
											<span
												class="font-semibold text-gray-900 dark:text-white"
												>严格的上线前测试流程：</span
											>
											<span
												class="text-gray-600 dark:text-gray-400"
												>最大限度避免潜在的
												BUG，保障用户体验。</span
											>
										</div>
									</Motion>
									<Motion
										as="li"
										:custom="4"
										v-bind="listFromBottomToUp"
										class="flex items-start gap-3">
										<div
											class="flex-shrink-0 w-6 h-6 mt-0.5">
											<img
												class="w-full h-full"
												src="~/public/hot.png"
												alt="hot" />
										</div>
										<div class="flex-1">
											<span
												class="font-semibold text-gray-900 dark:text-white"
												>高效响应机制：</span
											>
											<span
												class="text-gray-600 dark:text-gray-400"
												>第一时间处理反馈问题，持续优化服务。</span
											>
										</div>
									</Motion>
									<Motion
										as="li"
										:custom="5"
										v-bind="listFromBottomToUp"
										class="flex items-start gap-3">
										<div
											class="flex-shrink-0 w-6 h-6 mt-0.5">
											<img
												class="w-full h-full"
												src="~/public/hot.png"
												alt="hot" />
										</div>
										<div class="flex-1">
											<span
												class="font-semibold text-gray-900 dark:text-white"
												>技术驱动创新：</span
											>
											<span
												class="text-gray-600 dark:text-gray-400"
												>不断探索新技术，提升产品性能与安全性。</span
											>
										</div>
									</Motion>
								</ul>
							</div>

							<!-- 右侧图片 -->
							<div class="w-full max-w-[380px]">
								<img
									class="w-full h-auto rounded-2xl"
									src="~/public/development.png"
									alt="开发" />
							</div>
						</div>
					</section>

					<!-- 常见问题板块 -->
					<section
						class="w-full bg-white dark:bg-gray-800 py-16 md:py-24">
						<div class="w-full max-w-[1450px] mx-auto px-4 md:px-8">
							<!-- 标题 -->
							<div class="text-center mb-12">
								<div
									class="flex items-center justify-center gap-4 mb-3">
									<span
										class="block h-0.5 w-16 bg-indigo-600"></span>
									<h2
										class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
										常见问题
									</h2>
									<span
										class="block h-0.5 w-16 bg-indigo-600"></span>
								</div>
								<p
									class="text-sm md:text-base text-gray-500 uppercase tracking-widest">
									FAQ
								</p>
							</div>

							<!-- 内容区 -->
							<div
								class="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-16">
								<!-- 左侧图片 -->
								<div
									class="w-full max-w-[380px] mx-auto lg:mx-0">
									<img
										class="w-full h-auto rounded-2xl"
										src="~/public/question.png"
										alt="常见问题" />
								</div>

								<!-- 右侧问答 -->
								<div class="w-full max-w-[700px] space-y-3">
									<Disclosure
										v-slot="{ open }"
										v-for="item in pageData.questions"
										:key="item.title">
										<DisclosureButton
											class="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-6 py-4 text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
											<div
												class="flex items-center gap-3">
												<Icon
													:name="item.icon"
													class="text-indigo-600 dark:text-indigo-400 text-lg flex-shrink-0" />
												<span
													class="text-base font-semibold text-gray-900 dark:text-white">
													{{ item.title }}
												</span>
											</div>
											<Icon
												name="el-icon-ArrowDownBold"
												class="text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0"
												:class="{
													'rotate-180': open,
												}" />
										</DisclosureButton>

										<TransitionRoot
											:show="open"
											enter="transition-all duration-300 ease-out"
											enterFrom="opacity-0 max-h-0"
											enterTo="opacity-100 max-h-96"
											leave="transition-all duration-200 ease-in"
											leaveFrom="opacity-100 max-h-96"
											leaveTo="opacity-0 max-h-0">
											<DisclosurePanel
												class="overflow-hidden">
												<div
													class="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-6 py-4 mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
													{{ item.desc }}
												</div>
											</DisclosurePanel>
										</TransitionRoot>
									</Disclosure>
								</div>
							</div>
						</div>
					</section>

					<!-- 文章教程板块 -->
					<section
						class="w-full max-w-[1450px] px-4 md:px-8 py-16 md:py-24">
						<!-- 标题 -->
						<div class="text-center mb-12">
							<div
								class="flex items-center justify-center gap-4 mb-3">
								<span
									class="block h-0.5 w-16 bg-gray-800 dark:bg-gray-400"></span>
								<h2
									class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
									文章教程
								</h2>
								<span
									class="block h-0.5 w-16 bg-gray-800 dark:bg-gray-400"></span>
							</div>
							<p
								class="text-sm md:text-base text-gray-500 uppercase tracking-widest">
								Articles
							</p>
						</div>

						<!-- 文章标签页 -->
						<ArticleTabs :data="pageData" />
					</section>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import appApi from "~/api/app";
	import Carousel from "~/components/Carousel/index.vue";
	import Information from "./article/_components/Information.vue";
	import Icon from "~/components/Icon/index.vue";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		TransitionRoot,
	} from "@headlessui/vue";
	import { Motion } from "motion-v";
	import {
		fromBottomToUp,
		GradientOpacity,
		listFromBottomToUp,
	} from "~/animate/inViewAnimate";

	// 页面数据
	const { data: pageData } = await useAsyncData(() => appApi.homing(), {
		default() {
			return {} as AppHomingResponse;
		},
	});
</script>

<style scoped>
	/* 平滑滚动 */
	html {
		scroll-behavior: smooth;
	}

	/* 自定义滚动条 */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-track {
		background: #f1f5f9;
	}

	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
