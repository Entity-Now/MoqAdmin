<template>
	<header
		class="top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent"
		:class="[
			isHomePage ? 'fixed' : 'sticky',
			isScrolled
				? 'bg-background/80 dark:bg-black/80 backdrop-blur-xl border-border/40 shadow-sm py-2'
				: isHomePage
				? 'bg-transparent border-transparent py-5'
				: 'bg-background border-border shadow-lighter py-5',
		]">
		<div class="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<div class="shrink-0 flex items-center gap-2">
					<NuxtLink
						to="/"
						class="flex items-center gap-2 group">
						<img
							v-if="pcConfig.logo"
							:src="pcConfig.logo"
							:alt="pcConfig.name"
							class="h-9 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105" />
						<span
							v-else
							class="text-2xl font-nike tracking-tight text-foreground">
							{{ pcConfig.name }}
						</span>
					</NuxtLink>
				</div>

				<!-- Desktop Navigation -->
				<nav class="hidden lg:flex items-center gap-8">
					<template
						v-for="(item, index) in menus"
						:key="index">
						<div class="relative group/menu">
							<NuxtLink
								:to="item.path"
								:target="item.target"
								class="flex items-center gap-1.5 text-[15px] font-medium transition-all duration-300 py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
								:class="[
									activeMenu === item.path
										? 'text-primary after:w-full'
										: 'text-foreground/80 hover:text-primary',
								]">
								{{ item.name }}
								<Icon
									v-if="item.children"
									name="fas fa-chevron-down"
									class="text-[10px] opacity-50 transition-transform duration-300 group-hover/menu:rotate-180" />
							</NuxtLink>

							<!-- Dropdown -->
							<div
								v-if="item.children"
								class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300 ease-apple">
								<div
									class="w-52 bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-border/50 border border-white/20 dark:border-white/5 overflow-hidden p-1.5">
									<NuxtLink
										v-for="(sub, i) in item.children"
										:key="i"
										:to="sub.path"
										:target="sub.target"
										class="block px-4 py-3 text-sm text-foreground/80 rounded-xl hover:bg-secondary hover:text-primary transition-all duration-200">
										{{ sub.name }}
									</NuxtLink>
								</div>
							</div>
						</div>
					</template>
				</nav>

				<!-- Right Actions -->
				<div class="flex items-center gap-4">
					<!-- Theme Toggle -->
					<button
						@click="changeDark"
						class="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all">
						<Icon
							:name="
								isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'
							"
							class="text-lg" />
					</button>

					<!-- User / Auth (Desktop) -->
					<div class="hidden lg:flex items-center gap-3">
						<template v-if="!userStore.isLogin">
							<button
								@click="appStore.setPopup(popupEnum.LOGIN)"
								class="px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
								登录
							</button>
							<button
								@click="appStore.setPopup(popupEnum.REGISTER)"
								class="px-7 py-2.5 text-sm font-nike uppercase tracking-widest text-primary-foreground bg-primary rounded-full hover:opacity-90 shadow-md transition-all hover:-translate-y-0.5 active:scale-95">
								注册
							</button>
						</template>

						<el-dropdown
							v-else
							trigger="click"
							@command="handleCommand">
							<div
								class="flex items-center gap-2 cursor-pointer py-1 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
								<el-avatar
									:size="32"
									:src="userInfo.avatar"
									class="ring-2 ring-white dark:ring-slate-700" />
								<span
									class="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
									{{ userInfo.nickname }}
								</span>
								<Icon
									name="fas fa-chevron-down"
									class="text-xs text-slate-400" />
							</div>
							<template #dropdown>
								<el-dropdown-menu
									class="p-1! rounded-xl! border-none! shadow-xl!">
									<div
										class="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
										<p class="text-xs text-slate-500">
											Signed in as
										</p>
										<p
											class="text-sm font-medium text-slate-900 truncate">
											{{ userInfo.nickname }}
										</p>
									</div>
									<NuxtLink to="/account/center">
										<el-dropdown-item class="rounded-lg!"
											>个人中心</el-dropdown-item
										>
									</NuxtLink>
									<el-dropdown-item
										divided
										command="logout"
										class="text-red-500! rounded-lg! hover:bg-red-50! dark:hover:bg-red-900/30!">
										退出登录
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>

					<!-- Mobile Menu Button -->
					<button
						class="lg:hidden p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
						@click="collapse = true">
						<Icon
							name="fa-solid fa-bars"
							class="text-xl" />
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Drawer -->
		<Teleport to="body">
			<!-- Backdrop -->
			<Transition
				enter-active-class="transition-opacity duration-300 ease-out"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition-opacity duration-200 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0">
				<div
					v-if="collapse"
					class="fixed inset-0 bg-black/30 backdrop-blur-sm z-60"
					@click="collapse = false"></div>
			</Transition>

			<!-- Drawer Content -->
			<Transition
				enter-active-class="transition-transform duration-300 ease-out"
				enter-from-class="translate-x-full"
				enter-to-class="translate-x-0"
				leave-active-class="transition-transform duration-200 ease-in"
				leave-from-class="translate-x-0"
				leave-to-class="translate-x-full">
				<div
					v-if="collapse"
					class="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl z-70 overflow-y-auto">
					<div class="flex flex-col h-full">
						<!-- Header -->
						<div
							class="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
							<span
								class="text-lg font-bold text-slate-900 dark:text-white"
								>Menu</span
							>
							<button
								@click="collapse = false"
								class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
								<Icon
									name="fas fa-times"
									class="text-lg text-slate-500" />
							</button>
						</div>

						<!-- Menu Items -->
						<div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
							<template
								v-for="(item, index) in menus"
								:key="index">
								<div v-if="!item.children">
									<NuxtLink
										:to="item.path"
										class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors"
										:class="[
											activeMenu === item.path
												? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
												: 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
										]"
										@click="collapse = false">
										{{ item.name }}
									</NuxtLink>
								</div>

								<!-- Mobile Dropdown -->
								<Disclosure
									v-else
									v-slot="{ open }"
									as="div">
									<DisclosureButton
										class="flex w-full items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
										:class="{
											'bg-slate-50 dark:bg-slate-800':
												open,
										}">
										<span>{{ item.name }}</span>
										<Icon
											name="fas fa-chevron-down"
											class="text-xs transition-transform duration-200"
											:class="{ 'rotate-180': open }" />
									</DisclosureButton>
									<DisclosurePanel
										class="px-4 py-2 space-y-1">
										<NuxtLink
											v-for="(sub, i) in item.children"
											:key="i"
											:to="sub.path"
											class="block px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
											@click="collapse = false">
											{{ sub.name }}
										</NuxtLink>
									</DisclosurePanel>
								</Disclosure>
							</template>
						</div>

						<!-- Footer Actions -->
						<div
							class="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
							<template v-if="!userStore.isLogin">
								<div class="grid grid-cols-2 gap-3">
									<button
										@click="
											() => {
												appStore.setPopup(
													popupEnum.LOGIN
												);
												collapse = false;
											}
										"
										class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors">
										登录
									</button>
									<button
										@click="
											() => {
												appStore.setPopup(
													popupEnum.REGISTER
												);
												collapse = false;
											}
										"
										class="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
										注册
									</button>
								</div>
							</template>
							<div
								v-else
								class="space-y-3">
								<div class="flex items-center gap-3 px-2">
									<el-avatar
										:size="40"
										:src="userInfo.avatar" />
									<div>
										<p
											class="font-medium text-slate-900 dark:text-white">
											{{ userInfo.nickname }}
										</p>
										<p class="text-xs text-slate-500">
											Welcome back
										</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-3">
									<NuxtLink
										to="/user/center"
										class="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors"
										@click="collapse = false">
										个人中心
									</NuxtLink>
									<button
										@click="handleCommand('logout')"
										class="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
										退出
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</header>
</template>

<script setup lang="ts">
	import { popupEnum } from "~/enums/app";
	import useAppStore from "~/stores/app";
	import useUserStore from "~/stores/user";
	import useConfStore from "~/stores/conf";
	import menus from "~/config/menu";
	import { useScroll } from "@vueuse/core";
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from "@headlessui/vue";
	import Icon from "~/components/Icon/index.vue";

	const route = useRoute();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const confStore = useConfStore();
	const collapse = ref(false);

	// 是否为首页
	const isHomePage = computed(() => route.path === "/");

	// 滚动检测
	const { y } = useScroll(window);
	const isScrolled = computed(() => y.value > 80);

	// 主题
	const isDark = computed(() => confStore.isDarkColor);
	const changeDark = () => {
		confStore.setTheme(confStore.primaryTheme, !isDark.value);
		confStore.setSetting({
			key: "isDarkColor",
			value: !isDark.value,
		});
	};

	// 配置 & 用户信息
	const pcConfig = computed(() => ({
		logo: appStore.getPcConfig.logo,
		name: appStore.getPcConfig.name,
	}));

	const userInfo = computed(() => ({
		avatar: userStore.users.avatar,
		nickname: userStore.users.nickname,
	}));

	const activeMenu = computed(() => route.path);

	// 退出登录
	const handleCommand = async (command: string) => {
		if (command === "logout") {
			try {
				await feedback.confirm("确定退出登录吗？");
				await userStore.logout();
				collapse.value = false;
			} catch {}
		}
	};

	// 路由变化关闭移动菜单
	watch(
		() => route.path,
		() => {
			collapse.value = false;
		}
	);
</script>

<style scoped>
	/* 自定义滚动条 */
	.overflow-y-auto::-webkit-scrollbar {
		width: 4px;
	}
	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 20px;
	}
</style>
