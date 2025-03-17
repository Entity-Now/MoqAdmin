<template>
	<div class="header top-0 w-full bg-background/80 backdrop-blur-sm transition duration-500"
		:class="currentPageClass">
		<div class="flex items-center justify-between h-full px-4">
			<div class="flex flex-row gap-3 items-center h-full">
				<NuxtLink v-if="pcConfig.logo" to="/" class="logo">
					<img :src="pcConfig.logo" :alt="pcConfig.name" />
				</NuxtLink>
				<ul class="navigation hidden lg:flex flex-row gap-2 list-none">
					<li v-for="(item, index) in menus" :key="index"
						:class="activeMenu === item.path ? 'active text-indigo-500' : ''">
						<NuxtLink :to="item.path" :target="item.target">
							{{ item.name }}
							<icon v-if="item.children" name="el-icon-ArrowDown" />
						</NuxtLink>
						<dl v-if="item.children">
							<dd v-for="(sub, i) in item.children" :key="i">
								<NuxtLink :to="sub.path" :target="sub.target">
									{{ sub.name }}
								</NuxtLink>
							</dd>
						</dl>
					</li>
				</ul>
			</div>
			<div class="ml-auto mr-4 cursor-pointer flex items-center select-none" @click="changeDark()">
				<icon v-if="isDark" name="svg-icon-Dark" :size="22" />
				<icon v-else name="svg-icon-Light" :size="22" />
			</div>
			<div class="cursor-pointer lg:hidden flex flex-row gap-3">
				<icon class="text-custom select-none" name="fa-solid fa-bars" :size="22" @click="collapse = true" />
			</div>
			<div class="hidden lg:flex flex-row gap-3 items-center h-full">

				<template v-if="!userStore.isLogin">
					<button @click="appStore.setPopup(popupEnum.LOGIN)"
						class="bg-custom-solid !text-white rounded-xl shadow-lg px-4 py-2">登录</button>
					<button @click="appStore.setPopup(popupEnum.REGISTER)"
						class="bg-custom-solid !text-white rounded-xl shadow-lg px-4 py-2">注册</button>
				</template>
				<el-dropdown v-else class="px-2.5 h-full" @command="handleCommand">
					<div class="flex items-center">
						<el-avatar :size="30" :src="userInfo.avatar" />
						<div class="ml-2 mr-1">{{ userInfo.nickname }}</div>
						<icon name="el-icon-ArrowDown" />
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<router-link to="/user/center">
								<el-dropdown-item>个人设置</el-dropdown-item>
							</router-link>
							<el-dropdown-item :divided="true" command="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<Teleport to="body">
			<Motion as="header" :layout="true" v-bind="GradientOpacity"
				class="mobile bg-slate-100 fixed top-0 left-0 w-full h-full z-50" v-if="collapse">
				<div class="flex flex-col h-full">
					<div class="flex flex-row items-center justify-between p-4 bg-slate-800">
						<NuxtLink v-if="pcConfig.logo" to="/" class="logo">
							<img :src="pcConfig.logo" :alt="pcConfig.name" />
						</NuxtLink>
						<div class="ml-auto mr-3 flex flex-row gap-2" v-if="!userStore.isLogin">
							<button @click="appStore.setPopup(popupEnum.LOGIN)"
								class="bg-custom-solid !text-white rounded-xl shadow-lg px-4 py-2">登录</button>
							<button @click="appStore.setPopup(popupEnum.REGISTER)"
								class="bg-custom-solid !text-white rounded-xl shadow-lg px-4 py-2">注册</button>
						</div>
						<div class="flex flex-row gap-2 items-center text-white">
							<template v-if="userStore.isLogin">
								<el-avatar :size="30" :src="userInfo.avatar" />
								<NuxtLink to="/user/center" class="ml-2 mr-1">{{ userInfo.nickname }}</NuxtLink>
								<div class="text-gray-300 border h-3 mx-2"></div>
							</template>
							<icon class="cursor-pointer select-none" name="fa-solid fa-xmark hover:text-red-500"
								:size="22" @click="collapse = false" />
						</div>
					</div>
					<ul class="divide-y list-none w-full h-full py-2 px-4">
						<Motion as="li" v-bind="listFromBottomToUp" :custom="index" v-for="(item, index) in menus"
							:key="index"
							class="group cursor-pointer transition-opacity duration-500 my-2 py-2 text-center rounded-lg w-full"
							:class="activeMenu === item.path ? 'active text-indigo-100 bg-indigo-500' : 'text-slate-800 hover:bg-indigo-100'"
							@click="() => $router.push(item.path)">
							<NuxtLink :to="item.path" :target="item.target">
								{{ item.name }}
								<icon v-if="item.children" name="el-icon-ArrowDown" />
							</NuxtLink>
							<Motion as="div" v-bind="fromBottomToUp" :layout="true" :exit="{ y: 10, opacity: 0 }"
								:in-view-options="{ once: false }" class="hidden group-hover:block"
								v-if="item.children">
								<dd class="cursor-pointer  my-2 py-2 text-center rounded-lg w-full hover:bg-indigo-200"
									v-for="(sub, i) in item.children" :key="i">
									<NuxtLink :to="sub.path" :target="sub.target">
										{{ sub.name }}
									</NuxtLink>
								</dd>
							</Motion>
						</Motion>
					</ul>
					<div v-if="userStore.isLogin" class="mt-auto flex flex-col gap-2 p-4 bg-slate-800">
						<NuxtLink class="w-full" to="/user/center">
							<Motion as="button" v-bind="fromBottomToUp" :in-view-options="{ once: false }"
								class="w-full bg-custom-solid !text-white rounded-xl shadow-lg px-4 py-2">个人信息</Motion>
						</NuxtLink>
						<Motion as="button" v-bind="fromBottomToUp" :in-view-options="{ once: false }"
							@click="() => handleCommand('logout')"
							class="bg-gray-500 !text-white rounded-xl shadow-lg px-4 py-2">退出登录</Motion>
					</div>
				</div>
			</Motion>
		</Teleport>
	</div>

</template>

<script setup lang="ts">
	import { popupEnum } from "~/enums/app";
	import useAppStore from "~/stores/app";
	import useUserStore from "~/stores/user";
	import useConfStore from "~/stores/conf";
	import menus from "~/config/menu";
	import { Motion, useScroll } from 'motion-v'
import { fromBottomToUp, GradientOpacity, listFromBottomToUp } from '~/animate/inViewAnimate'

	const route = useRoute();
	const appStore = useAppStore();
	const userStore = useUserStore();
	const confStore = useConfStore();
    const collapse = ref(false);
	const { scrollY } = useScroll();

	// 暗黑主题
	const isDark = computed(() => confStore.isDarkColor);
	const changeDark = () => {
		confStore.setTheme(confStore.primaryTheme, !isDark.value);
		confStore.setSetting({
			key: "isDarkColor",
			value: !isDark.value,
		});
	};

	// PC端配置
	const pcConfig = computed(() => {
		return {
			logo: appStore.getPcConfig.logo,
			name: appStore.getPcConfig.name,
		};
	});

	// 用户信息
	const userInfo = computed(() => {
		return {
			avatar: userStore.users.avatar,
			nickname: userStore.users.nickname,
		};
	});

	// 激活菜单
	const activeMenu = computed<string>(() => route.path);

	// 是否主页
const defaultClass = ref('text-slate-100');
	const currentPageClass = computed(() => {
		if (route.path === "/") {
			return defaultClass.value + " fixed";
		}else{
			return defaultClass.value + " sticky bg-white text-slate-800";
		}
	});

	scrollY.on("change", (e)=>{
		if(e > 0){
			defaultClass.value = 'bg-white text-slate-800 shadow-lg';
		}else{
			defaultClass.value = 'text-slate-100';
		}
	})
	// 指令处理
	const handleCommand = async (command: string) => {
		switch (command) {
			case "logout":
				feedback
					.confirm("确定退出登录吗？")
					.then(async () => {
						await userStore.logout();
					})
					.catch(() => {});
		}
	};
</script>

<style lang="scss" scope>
	.header {
		height: 60px;
		z-index: 9999;
	}
	.navigation {
		li {
			height: 100%;
			a {
				position: relative;
				display: block;
				padding: 0 24px;
				font-size: 16px;
				font-weight: bold;
			}

			&:hover > a {
				opacity: 0.8;
			}

			&:hover > dl {
				display: block;
				transition: all 300ms;
			}
			dl {
				position: absolute;
				z-index: 2000;
				display: none;
				min-width: 140px;
				padding: 5px 0;
				background: var(--color-white);
				border: 1px solid var(--el-border-color-light);
				border-radius: 2px;
				box-shadow: 0 6px 12px rgb(0 0 0 / 17.5%);
				transition: all 300ms;

				dd a {
					display: block;
					padding: 11px 20px;
					font-size: 15px;
					line-height: 1;
					color: var(--el-text-color-regular);
				}

				dd:hover {
					background: #f3f3f3;
				}
			}
		}
	}
	.mobile{
		z-index: 99999;
	}
</style>
