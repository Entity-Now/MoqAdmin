<template>
	<NuxtLayout name="default">
		<template #container>
			<div class="w-full h-full">
				<div
					class="relative headerImage w-full h-[420px] rounded-xl overflow-hidden group">
					<!-- 图片容器 -->
					<el-image
						class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
						:src="details.image">
						<template #error>
							<div
								class="h-full flex items-center justify-center bg-gray-900 text-gray-400">
								<Icon
									name="fa-solid fa-image"
									class="text-4xl" />
							</div>
						</template>
					</el-image>

					<!-- 毛玻璃覆盖层 -->
					<div
						class="absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-br from-gray-900/70 to-blue-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
						<!-- 元数据容器 -->
						<div
							class="absolute bottom-6 right-6 flex items-center gap-3">
							<div
								class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-gray-200">
								<Icon
									name="fa-solid fa-eye"
									class="text-sm" />
								<span>{{ details.browse }}</span>
							</div>
							<div
								class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-gray-200">
								<Icon
									name="fa-solid fa-calendar"
									class="text-sm" />
								<time>{{ details.create_time }}</time>
							</div>
							<button
								class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-gray-200 hover:text-amber-300 transition-colors"
								:class="{
									'text-amber-400': details.is_collect,
								}"
								@click.prevent.stop="handleCollect()">
								<Icon
									:name="
										details.is_collect
											? 'fa-solid fa-star'
											: 'fa-solid fa-star'
									"
									class="text-sm" />
							</button>
						</div>

						<!-- 文字容器 -->
						<div class="max-w-4xl mx-auto text-center space-y-6">
							<h2
								class="text-4xl font-bold text-white drop-shadow-2xl tracking-tight bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
								{{ details.title }}
							</h2>
							<p
								class="text-lg text-gray-200/90 leading-relaxed max-w-3xl mx-auto backdrop-blur-sm px-4 py-2 rounded-lg bg-white/5">
								{{ details.intro }}
							</p>
						</div>
					</div>
				</div>
				<div
					class="grid grid-cols-[1fr_320px] gap-4 px-4 my-4 max-w-[1440px] mx-auto">
					<div class="flex flex-col gap-4">
						<div
							class="p-4 rounded-md bg-second"
							v-html="details.content"></div>
						<div class="flex flex-row gap-2">
							<div class="w-full flex items-center gap-3 p-4 text-base text-tx-regular bg-second">
								<Icon name="fa-solid fa-arrow-left"/>
								<NuxtLink
									v-if="details.prev.id"
									class="text-primary-default hover-opacity"
									:to="`/article/detail/${details.prev?.id}`">
									{{ details.prev?.title }}
								</NuxtLink>
								<span v-else>暂无数据</span>
							</div>
							<div class="w-full flex items-center justify-end gap-3 p-4 text-base text-tx-regular bg-second">
								<NuxtLink
									v-if="details.next.id"
									class="text-primary-default hover-opacity"
									:to="`/article/detail/${details.next?.id}`">
									{{ details.next?.title }}
								</NuxtLink>
								<span v-else>暂无数据</span>
								<Icon name="fa-solid fa-arrow-right"/>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<Card
							title="分类"
							icon="fa-solid fa-hashtag">
							<div class="mt-2 flex flex-row gap-2">
								<div
									v-for="item in categories"
									:key="item.id"
									class="group flex-1 cursor-pointer rounded-md border border-slate-300 p-2 hover:bg-indigo-300"
									@click="() => SelectCategory(item)">
									<div
										class="group-hover:-translate-x-[-2px] transition-all duration-300 ease-in-out">
										{{ item.name }}
									</div>
								</div>
							</div>
						</Card>
						<Information
							title="热门"
							icon="fa-solid fa-fire"
							type="ranking"
							:data="pageData.ranking" />
						<Information
							title="置顶"
							icon="fa-solid fa-seedling"
							type="topping"
							:data="pageData.topping" />
						<Information
							:visibleAvgTitle="false"
							type="adv"
							:data="pageData.adv" />
					</div>
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import articleApi from "~/api/article";
	import Card from "../_components/Card.vue";
	import Information from "../_components/Information.vue";
	import useUserStore from "~/stores/user";

	const route = useRoute();
	const userStore = useUserStore();
	const articleId = parseInt(String(route.params.id));

	/**
	 * 文章数据
	 */
	const { data: details, refresh } = useAsyncData(
		() => articleApi.detail(articleId),
		{
			default() {
				return {} as ArticleDetailResponse;
			},
		}
	);
	// 分类
	const { data: categories } = await useAsyncData(
		() => articleApi.categories(),
		{
			default() {
				return [] as Categories[];
			},
		}
	);

	/**
	 * 页面数据
	 */
	const { data: pageData } = await useAsyncData(() => articleApi.pages(), {
		default() {
			return {} as ArticlePagesResponse;
		},
	});

	/**
	 * 文章收藏
	 */
	const handleCollect = async () => {
		if (!userStore.isLogin) {
			feedback.msgError("请先登录");
			return;
		}
		if (details.value.is_collect) {
			await articleApi.collect(articleId);
			feedback.msgSuccess("取消成功");
		} else {
			await articleApi.collect(articleId);
			feedback.msgSuccess("收藏成功");
			details.value.is_collect = 1;
		}
	};

	const SelectCategory = (item: Categories) => {
		alert("请实现此代码的实现！");
	};
</script>
