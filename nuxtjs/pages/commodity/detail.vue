<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full bg-gray-50">
				<div class="max-w-[1440px] mx-auto px-4 py-6">
					<!-- 返回按钮 -->
					<div class="mb-4">
						<NuxtLink to="/commodity" class="inline-flex items-center text-gray-500 hover:text-indigo-500 transition-colors duration-200">
							<Icon name="fa-solid fa-arrow-left" class="mr-2" />
							返回商品列表
						</NuxtLink>
					</div>

					<!-- 商品详情主体 -->
					<div class="bg-white rounded-xl shadow-sm overflow-hidden">
						<div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 p-6">
							<!-- 左侧：商品图片 -->
							<div class="flex flex-col items-center">
								<div class="w-full max-w-md aspect-square overflow-hidden bg-gray-50 rounded-lg mb-4">
									<el-image
										:src="detail.image"
										class="w-full h-full object-contain"
									>
										<template #error>
											<div
												class="h-full flex items-center justify-center bg-gray-100 text-gray-400"
											>
												<Icon
													name="fa-solid fa-image"
													class="text-4xl"
												/>
											</div>
										</template>
									</el-image>
								</div>

								<!-- 图片缩略图 -->
								<div class="flex gap-2">
									<!-- 这里可以添加多张缩略图，暂时只显示一张 -->
									<div class="w-16 h-16 overflow-hidden rounded-md border-2 border-indigo-500 cursor-pointer">
										<el-image
											:src="detail.image"
											class="w-full h-full object-cover"
										/>
									</div>
								</div>
							</div>

							<!-- 右侧：商品信息 -->
							<div class="flex flex-col justify-between">
								<div>
									<!-- 商品标题 -->
									<h1 class="text-2xl font-bold mb-2 leading-tight">
										{{ detail.title }}
									</h1>

									<!-- 商品标签 -->
									<div class="flex flex-wrap gap-2 mb-4">
										<span v-if="detail.category" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
											{{ detail.category }}
										</span>
										<span v-if="detail.is_recommend" class="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm">
											推荐商品
										</span>
										<span v-if="detail.is_topping" class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
											置顶商品
										</span>
									</div>

									<!-- 商品价格 -->
									<div class="flex items-baseline gap-2 mb-6">
										<span class="text-red-500 font-bold text-3xl">¥</span>
										<span class="text-red-500 font-bold text-4xl">{{ detail.price }}</span>
									</div>

									<!-- 商品简介 -->
									<div class="mb-6">
										<h3 class="text-lg font-semibold mb-2">商品简介</h3>
										<p class="text-gray-600 whitespace-pre-line">
											{{ detail.intro }}
										</p>
									</div>

									<!-- 商品信息 -->
									<div class="grid grid-cols-2 gap-4 mb-6">
										<div class="flex items-center">
											<span class="text-gray-500 w-20">库存：</span>
											<span class="font-medium">{{ detail.stock }} 件</span>
										</div>
										<div class="flex items-center">
											<span class="text-gray-500 w-20">销量：</span>
											<span class="font-medium">{{ detail.sales }} 件</span>
										</div>
										<div class="flex items-center">
											<span class="text-gray-500 w-20">浏览：</span>
											<span class="font-medium">{{ detail.browse }} 次</span>
										</div>
										<div class="flex items-center">
											<span class="text-gray-500 w-20">发货方式：</span>
											<span class="font-medium">{{ getDeliveryType(detail.deliveryType || 0) }}</span>
										</div>
									</div>
								</div>

								<!-- 购买操作 -->
								<div class="pt-4 border-t border-gray-100">
									<div class="flex flex-wrap gap-4">
										<button
											class="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 shadow-sm hover:shadow"
											@click="handleBuyNow"
										>
											立即购买
										</button>
										<button
											class="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow"
											@click="handleAddToCart"
										>
											加入购物车
										</button>
										<button
											class="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
											@click="handleCollect"
										>
											<Icon
												:name="detail.is_collect ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
												:class="detail.is_collect ? 'text-red-500' : 'text-gray-500'"
											/>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 商品详情内容 -->
					<div class="mt-6 bg-white rounded-xl shadow-sm p-6">
						<h2 class="text-xl font-bold mb-4">商品详情</h2>
						<div class="prose max-w-none" v-html="detail.content"></div>
					</div>

					<!-- 相关推荐 -->
					<div class="mt-6 bg-white rounded-xl shadow-sm p-6">
						<h2 class="text-xl font-bold mb-4">相关推荐</h2>
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							<NuxtLink
								v-for="item in relatedProducts"
								:key="item.id"
								:to="`/commodity/detail/${item.id}`"
								class="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
							>
								<div class="aspect-square overflow-hidden bg-gray-50">
									<el-image
										:src="item.image"
										class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<div class="p-2">
									<h3 class="text-sm font-medium line-clamp-2 mb-1 group-hover:text-indigo-500 transition-colors duration-200">
										{{ item.title }}
									</h3>
									<div class="text-red-500 text-xs font-bold">
										¥{{ item.price }}
									</div>
								</div>
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>
<script setup lang="ts">
import Icon from "~/components/Icon/index.vue";
import commodityApi from "~/api/commodity";
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { CommodityDetailResponse, CommodityListsResponse } from "~/api/commodity/types.d";

const router = useRouter();
const route = useRoute();
const id = Number(route.params.id);

// 商品详情
const { data: detail } = await useAsyncData(() => commodityApi.detail(id), {
	default() {
		return {
			id: 0,
			title: '',
			price: 0,
			stock: 0,
			sales: 0,
			deliveryType: 0,
			image: '',
			intro: '',
			content: '',
			browse: 0,
			collect: 0,
			is_collect: 0,
			is_recommend: 0,
			is_topping: 0,
			category: '',
			create_time: '',
			update_time: ''
		} as CommodityDetailResponse;
	},
});

// 相关商品
const { data: relatedProducts } = await useAsyncData(() => commodityApi.related(id), {
	default() {
		return [] as any[];
	},
});

// 获取发货方式文本
const getDeliveryType = (type: number): string => {
	const deliveryTypes = {
		0: '快递',
		1: '自提',
		2: '无需物流[人工发]',
		3: '无需物流[自动发]'
	};
	return deliveryTypes[type as keyof typeof deliveryTypes] || '未知';
};

// 立即购买
const handleBuyNow = () => {
	// 这里可以实现立即购买的逻辑
	ElMessage.success('即将跳转到支付页面');
};

// 加入购物车
const handleAddToCart = () => {
	// 这里可以实现加入购物车的逻辑
	ElMessage.success('已成功加入购物车');
};

// 收藏/取消收藏
const handleCollect = async () => {
	try {
		await commodityApi.collect(id);
		detail.value.is_collect = detail.value.is_collect ? 0 : 1;
		ElMessage.success(detail.value.is_collect ? '收藏成功' : '取消收藏');
	} catch (error) {
		ElMessage.error('操作失败');
	}
};
</script>