<template>
	<div class="space-y-6">
		<!-- 置顶文章 -->
		<Card
			v-if="type === 'topping'"
			:title="title"
			:icon="icon"
			v-bind="$attrs">
			<div class="grid gap-4">
				<div
					v-for="(item, index) in data"
					:key="item.id"
					class="group relative rounded-xl overflow-hidden bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300">
					<!-- 图片容器 -->
					<div class="relative aspect-[16/9] overflow-hidden">
						<NuxtLink
							:to="`/article/detail/${item.id}`"
							class="block h-full w-full">
							<el-image
								:src="item.image"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								:fit="'cover'"
								loading="lazy">
								<template #error>
									<div
										class="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
										<Icon
											name="fa-solid fa-image"
											class="text-2xl" />
									</div>
								</template>
							</el-image>
						</NuxtLink>

						<!-- 渐变遮罩 -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

						<!-- 排名角标 -->
						<div class="absolute top-3 left-3">
							<span
								class="flex items-center justify-center w-6 h-6 bg-white/20 backdrop-blur-md border border-white/30 rounded text-xs font-bold text-white">
								{{ index + 1 }}
							</span>
						</div>
					</div>

					<!-- 内容信息 -->
					<div class="absolute bottom-0 left-0 w-full p-4">
						<NuxtLink
							:to="`/article/detail/${item.id}`"
							class="block">
							<h3
								class="text-sm font-bold text-white line-clamp-2 mb-2 leading-relaxed group-hover:text-indigo-300 transition-colors">
								{{ item.title }}
							</h3>
						</NuxtLink>

						<div
							class="flex items-center justify-between text-xs text-slate-300/90">
							<div class="flex items-center gap-1.5">
								<Icon
									name="fa-regular fa-eye"
									class="text-xs" />
								<span>{{ item.browse }}</span>
							</div>
							<span class="font-mono opacity-75">{{
								item.create_time?.split(" ")[0]
							}}</span>
						</div>
					</div>
				</div>
			</div>
		</Card>

		<!-- 排行榜 -->
		<Card
			v-if="type === 'ranking'"
			:title="title"
			:icon="icon"
			v-bind="$attrs">
			<ul class="space-y-1">
				<li
					v-for="(item, index) in data"
					:key="item.id"
					class="group">
					<NuxtLink
						:to="`/article/detail/${item.id}`"
						class="flex items-start gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50">
						<!-- 排名数字 -->
						<div
							class="flex-shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center text-xs font-bold rounded"
							:class="[
								index < 3
									? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
									: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
							]">
							{{ index + 1 }}
						</div>

						<!-- 标题 -->
						<div class="flex-1 min-w-0">
							<h4
								class="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
								{{ item.title }}
							</h4>
							<div
								class="mt-1 flex items-center gap-2 text-xs text-slate-400">
								<Icon
									name="fa-regular fa-eye"
									class="text-[10px]" />
								<span>{{ item.browse }}</span>
							</div>
						</div>
					</NuxtLink>
				</li>
			</ul>
		</Card>

		<!-- 广告轮播 -->
		<div
			v-if="type === 'adv'"
			class="rounded-2xl overflow-hidden shadow-sm">
			<ElCarousel
				class="w-full group"
				trigger="click"
				:height="height || '180px'"
				arrow="hover"
				v-bind="$attrs">
				<ElCarouselItem
					v-for="(item, index) in data"
					:key="index">
					<NuxtLink
						:to="item.url"
						:target="item.target"
						class="block w-full h-full relative">
						<ElImage
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							fit="cover"
							:src="item.image"
							loading="lazy" />

						<!-- 标题遮罩 -->
						<div
							v-if="visibleAvgTitle && item.title"
							class="absolute inset-0 flex flex-col justify-center items-center bg-black/20 hover:bg-black/30 transition-colors p-4 text-center">
							<h2
								class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg mb-2">
								{{ item.title }}
							</h2>
							<p
								v-if="item.desc"
								class="text-white/90 text-sm md:text-base font-medium drop-shadow-md max-w-[80%]">
								{{ item.desc }}
							</p>
						</div>
					</NuxtLink>
				</ElCarouselItem>
			</ElCarousel>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Card from "./Card.vue";

	defineProps({
		type: {
			type: String,
			required: true,
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
			default: () => [],
		},
		visibleAvgTitle: {
			type: Boolean,
			default: true,
		},
		height: {
			type: String,
			default: "",
		},
	});
</script>

<style scoped>
	/* 覆盖 Element Plus 轮播样式以匹配设计 */
	:deep(.el-carousel__indicators--horizontal) {
		bottom: 10px;
	}

	:deep(.el-carousel__button) {
		width: 20px;
		height: 3px;
		border-radius: 2px;
		background-color: rgba(255, 255, 255, 0.5);
	}

	:deep(.el-carousel__indicator.is-active button) {
		background-color: #fff;
		width: 30px;
	}
</style>
