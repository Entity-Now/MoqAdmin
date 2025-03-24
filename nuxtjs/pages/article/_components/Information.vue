<template>
	<div>
		<Card
			v-if="type === 'topping'"
			:title="title"
            :icon="icon"
			v-bind="$attrs">
			<div class="grid gap-4 md:gap-5 mt-4">
				<div
					v-for="(item, index) in data"
					:key="item.id"
					class="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
					<!-- 图片容器添加渐变覆盖层 -->
					<div class="relative aspect-video overflow-hidden">
						<NuxtLink
							:to="`/article/detail/${item.id}`"
							class="block h-full transform transition-transform duration-500 hover:scale-105">
							<el-image
								:src="item.image"
								class="h-full w-full object-cover"
								:fit="'cover'">
								<template #error>
									<div
										class="h-full flex items-center justify-center bg-gray-100 text-gray-400">
										<Icon
											name="fa-solid fa-image"
											class="text-2xl" />
									</div>
								</template>
							</el-image>
						</NuxtLink>

						<!-- 渐变遮罩层 -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

						<!-- 排名角标 -->
						<div
							class="absolute top-2 right-2 bg-white/90 px-2.5 py-1 rounded-full text-sm font-bold text-indigo-600">
							#{{ index + 1 }}
						</div>
					</div>

					<!-- 内容信息容器 -->
					<div class="absolute bottom-0 left-0 w-full p-4 text-white">
						<NuxtLink
							:to="`/article/detail/${item.id}`"
							class="text-md font-semibold line-clamp-2 mb-2 leading-snug">
							{{ item.title }}
						</NuxtLink>
						<div
							class="flex items-center justify-between text-sm opacity-90">
							<div class="flex items-center space-x-2">
								<Icon
									name="fa-regular fa-eye"
									class="text-sm" />
								<span>{{ item.browse }}阅读</span>
							</div>
							<span class="font-mono">{{
								item.create_time
							}}</span>
						</div>
					</div>

					<!-- 悬停装饰条 -->
					<div
						class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				</div>
			</div>
		</Card>

		<Card
			v-if="type === 'ranking'" 
			:title="title"
            :icon="icon"
            v-bind="$attrs">
			<!-- 列表项优化 -->
            <ul class="mt-3 space-y-2.5">
                <li
                    v-for="(item, index) in data"
                    :key="item.id"
                    class="group relative transition-colors duration-200 hover:bg-white/20 dark:hover:bg-gray-800/30 rounded-lg">
                    <NuxtLink
                        :to="`/article/detail/${item.id}`"
                        class="flex items-center px-3 py-2.5 gap-2 hover:pl-4 transition-all duration-300">
                        <!-- 排名徽章 -->
                        <div
                            class="w-6 h-6 flex items-center justify-center text-xs font-bold bg-custom-solid text-white rounded-full shadow-sm">
                            {{ index + 1 }}
                        </div>

                        <!-- 标题样式 -->
                        <span
                            class="title-custom line-clamp-1 transition-all duration-500 group-hover:text-indigo-500">
                            {{ item.title }}
                        </span>

                        <!-- 悬浮装饰线 -->
                        <div
                            class="absolute bottom-0 left-0 w-0 h-px bg-custom-solid transition-all duration-500 group-hover:w-full"></div>
                    </NuxtLink>
                </li>
            </ul>
		</Card>

		<ElCarousel
			v-if="type === 'adv'"
			class="w-full"
			trigger="click"
			height="185px"
			v-bind="$attrs">
			<ElCarouselItem
				v-for="(item, index) in data"
				:key="index">
				<div class="relative w-full h-full">
					<NuxtLink
						:to="item.url"
						:target="item.target"
						:title="item.title">
						<ElImage
							class="w-full h-full rounded-[8px] overflow-hidden object-cover"
							fit="cover"
							:src="item.image" />
					</NuxtLink>
					<div
						v-if="item.title"
						class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center">
						<h2 class="text-white font-bold text-4xl">
							{{ item.title }}
						</h2>
						<p class="text-slate-100 font-medium text-lg mt-2">
							{{ item?.desc }}
						</p>
					</div>
				</div>
			</ElCarouselItem>
		</ElCarousel>
	</div>
</template>

<script setup lang="ts">
	import Card from "./Card.vue";

	defineProps({
		type: {
			type: String,
		},
		title: {
			type: String,
			default: "",
		},
        icon: {
            type: String,
            default: "",
        },
		data: {
			type: Array<any>,
			default: () => {
				return [];
			},
		},
	});
</script>

<style scoped lang="scss">
	:deep(.el-card__body) {
		padding-top: 0;
		padding-bottom: 0;
	}

	.ranking {
		li span {
			width: 40px;
			height: 61px;
			margin-right: 10px;
			font-family: Mangal, serif;
			font-size: 36px;
			font-weight: bold;
			line-height: 61px;
			color: #dbdbdb;
		}
	}

	.lately {
		padding: 5px 0;
		li a {
			display: block;
			height: 20px;
			overflow: hidden;
			font-size: 14px;
			line-height: 20px;
			color: #333333;
			text-overflow: ellipsis;
			white-space: nowrap;
			span {
				color: #dab26b;
			}
		}
	}
</style>
