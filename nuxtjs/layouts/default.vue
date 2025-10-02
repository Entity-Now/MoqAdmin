<template>
	<ElContainer class="layout-default !relative">
		<layout-account />
		<layout-header />
		<ElMain>
			<slot></slot>
			<template v-if="$slots?.container">
				<div class="flex flex-1 p-0 m-0 w-full">
					<slot name="container"></slot>
					<!-- 悬浮购物车组件 -->
					<ShoppingCart
						ref="cartRef"
						:free-shipping-threshold="99" />
				</div>
			</template>
		</ElMain>
		<layout-footer />
	</ElContainer>
</template>

<script setup lang="ts">
	import LayoutAccount from "~/layouts/components/Account/index.vue";
	import LayoutHeader from "~/layouts/components/Header/index_2.vue";
	import LayoutFooter from "~/layouts/components/Footer/index.vue";
	import ShoppingCart from "~/components/ShoppingCart/index.vue";
</script>

<style scoped lang="scss">
	.layout-default {
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--el-bg-color-page);
		--el-footer-height: 36px;

		.el-main {
			display: flex;
			flex-direction: column;
			padding: 0;

			.container {
				display: flex;
				width: 100%;
				flex: 1;
				padding: 0;
				margin: 0 auto;
			}
		}
	}
</style>
