<template>
	<div
		class="bg-second rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-white/20 dark:border-gray-700">
		<!-- 标题部分增强 -->
		<div
			class="flex items-center gap-3 px-1 py-2 bg-white/30 dark:bg-gray-900/20 rounded-lg backdrop-blur-sm">
			<Icon
				:name="icon"
				class="text-2xl text-custom-primary animate-pulse-hover" />
			<span
				class="text-lg font-medium text-slate-700">
				{{ title }}
			</span>
		</div>

        <slot></slot>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    }
})

</script>

<style></style>
