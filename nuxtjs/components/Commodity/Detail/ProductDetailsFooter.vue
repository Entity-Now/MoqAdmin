<template>
	<div class="mt-16 space-y-16 flex flex-col">
		<!-- 详情内容 -->
		<section
			id="product-detail"
			class="space-y-8">
			<h2
				class="text-2xl font-bold text-slate-900 dark:text-white pb-6 border-b border-slate-100 dark:border-slate-800 tracking-tight">
				产品详情
			</h2>
			<div
				class="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:text-slate-900 dark:prose-headings:text-white leading-relaxed">
				<div
					v-if="intro"
					v-html="intro"></div>
				<div
					v-else
					class="text-slate-400 py-10 italic text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
					暂无详细产品介绍
				</div>
			</div>
		</section>

		<!-- 规格参数 -->
		<section
			id="product-params"
			class="space-y-8">
			<h2
				class="text-2xl font-bold text-slate-900 dark:text-white pb-6 border-b border-slate-100 dark:border-slate-800 tracking-tight">
				规格参数
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
				<div
					v-for="(param, index) in paramList"
					:key="index"
					class="flex justify-between py-3 border-b border-slate-50 dark:border-slate-800/50">
					<span class="text-slate-500 font-medium text-sm">{{
						param.label
					}}</span>
					<span
						class="text-slate-900 dark:text-white text-sm font-bold"
						>{{ param.value }}</span
					>
				</div>
			</div>
		</section>

		<!-- 用户评价 -->
		<section
			id="product-reviews"
			class="space-y-8">
			<div
				class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
				<h2
					class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
					用户评价 (0)
				</h2>
				<div class="flex items-center gap-1">
					<Icon
						v-for="i in 5"
						:key="i"
						name="fa-regular fa-star"
						class="text-slate-300 text-sm" />
				</div>
			</div>
			<div
				class="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-12 text-center space-y-4">
				<div
					class="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
					<Icon
						name="fa-solid fa-comment-dots"
						class="text-2xl text-slate-300 dark:text-slate-600" />
				</div>
				<div class="space-y-1">
					<p class="text-slate-900 dark:text-white font-bold text-lg">
						期待您的评价
					</p>
					<p class="text-sm text-slate-500">
						购买过该商品的用户可以发表您的真实体验
					</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import Icon from "~/components/Icon/index.vue";

	interface ParamItem {
		label: string;
		value: string | number;
	}

	defineProps<{
		intro: string;
		paramList: ParamItem[];
	}>();
</script>
