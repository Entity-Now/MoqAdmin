<template>
	<div
		class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
		<!-- 标题部分增强 -->
		<div
			class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
			<div
				class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
				<Icon
					:name="icon"
					class="text-sm" />
			</div>
			<span
				class="text-base font-bold text-slate-800 dark:text-white tracking-wide">
				{{ title }}
			</span>
		</div>

		<div class="relative">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		title: {
			type: String,
			default: "",
		},
		icon: {
			type: String,
			default: "",
		},
	});
</script>

<style scoped></style>
