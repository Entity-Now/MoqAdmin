<template>
	<div
		class="w-full max-w-[420px] bg-background p-8 md:p-10 rounded-4xl shadow-2xl border border-white/10">
		<div class="mb-10 text-center">
			<h2
				class="text-3xl font-nike tracking-tighter uppercase text-foreground">
				欢迎回来
			</h2>
			<p class="mt-2 text-sm text-muted-foreground font-medium">
				登录以访问您的账户
			</p>
		</div>

		<!-- 普通登录 -->
		<template v-if="meansChannel.includes(currentLogin)">
			<div
				v-if="meansChannel.length"
				class="mb-8">
				<div class="flex gap-1 p-1 bg-secondary/50 rounded-2xl mb-8">
					<button
						v-if="meansChannel.includes('account')"
						@click="currentLogin = 'account'"
						class="flex-1 py-3 text-sm font-nike tracking-widest uppercase rounded-xl transition-all duration-300"
						:class="
							currentLogin === 'account'
								? 'bg-background shadow-lg text-primary font-bold'
								: 'text-foreground/40 hover:text-foreground'
						">
						账号登录
					</button>
					<button
						v-if="meansChannel.includes('mobile')"
						@click="currentLogin = 'mobile'"
						class="flex-1 py-3 text-sm font-nike tracking-widest uppercase rounded-xl transition-all duration-300"
						:class="
							currentLogin === 'mobile'
								? 'bg-background shadow-lg text-primary font-bold'
								: 'text-foreground/40 hover:text-foreground'
						">
						手机登录
					</button>
				</div>

				<!-- 账号登录 -->
				<el-form
					v-if="currentLogin === 'account'"
					ref="formRef"
					size="large"
					:model="formData"
					:rules="formRules"
					class="modern-form">
					<el-form-item prop="account">
						<div class="w-full relative group">
							<Icon
								name="fa-solid fa-user"
								class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
							<el-input
								v-model="formData.account"
								placeholder="用户名 / 邮箱"
								class="premium-input" />
						</div>
					</el-form-item>
					<el-form-item prop="password">
						<div class="w-full relative group">
							<Icon
								name="fa-solid fa-lock"
								class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
							<el-input
								v-model="formData.password"
								type="password"
								show-password
								placeholder="密码"
								class="premium-input" />
						</div>
					</el-form-item>

					<div class="flex justify-between items-center mb-8 px-1">
						<button
							type="button"
							class="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer"
							@click="appStore.setPopup(popupEnum.REGISTER)">
							立即注册
						</button>
						<button
							type="button"
							class="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer"
							@click="appStore.setPopup(popupEnum.FORGOT_PWD)">
							忘记密码?
						</button>
					</div>

					<el-form-item>
						<el-button
							type="primary"
							class="w-full premium-button h-14"
							:loading="isLock"
							@click="onAccountLoginLock()">
							<span class="font-nike tracking-widest uppercase"
								>立即登录</span
							>
						</el-button>
					</el-form-item>
				</el-form>

				<!-- 短信登录 -->
				<el-form
					v-if="currentLogin === 'mobile'"
					ref="formRef"
					size="large"
					:model="formData"
					:rules="formRules"
					class="modern-form">
					<el-form-item prop="mobile">
						<div class="w-full relative group">
							<Icon
								name="fa-solid fa-phone"
								class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
							<el-input
								v-model="formData.mobile"
								placeholder="手机号码"
								class="premium-input pl-12">
								<template #prefix>
									<span
										class="text-xs font-bold text-foreground/40 mr-2 ml-8"
										>+86</span
									>
								</template>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item prop="code">
						<div class="w-full relative group">
							<Icon
								name="fa-solid fa-shield-halved"
								class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
							<el-input
								v-model="formData.code"
								placeholder="验证码"
								class="premium-input">
								<template #suffix>
									<div class="pr-2">
										<verify-code
											ref="verifyCodeRef"
											@click-get="handleSendSms" />
									</div>
								</template>
							</el-input>
						</div>
					</el-form-item>

					<div class="flex justify-between items-center mb-8 px-1">
						<button
							type="button"
							class="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer"
							@click="appStore.setPopup(popupEnum.REGISTER)">
							立即注册
						</button>
						<button
							type="button"
							class="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer"
							@click="appStore.setPopup(popupEnum.FORGOT_PWD)">
							忘记密码?
						</button>
					</div>

					<el-form-item>
						<el-button
							type="primary"
							class="w-full premium-button h-14"
							:loading="isLock"
							@click="onAccountLoginLock()">
							<span class="font-nike tracking-widest uppercase"
								>立即登录</span
							>
						</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div
				v-if="oauthChannel.length"
				class="mt-12">
				<div class="relative mb-10">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-border/40"></div>
					</div>
					<div
						class="relative flex justify-center text-xs uppercase tracking-widest">
						<span
							class="bg-background px-4 text-muted-foreground font-bold italic"
							>或快捷登录</span
						>
					</div>
				</div>

				<div class="flex justify-center gap-6">
					<button
						v-if="oauthChannel.includes('wx')"
						@click="currentLogin = 'wx'"
						class="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center hover:bg-[#07c160] hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
						<Icon
							name="svg-icon-Wechat"
							class="text-2xl" />
					</button>
					<button
						v-if="oauthChannel.includes('wx_mini')"
						@click="currentLogin = 'wx_mini'"
						class="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center hover:bg-black hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
						<Icon
							name="fas fa-solid fa-qrcode"
							class="text-2xl" />
					</button>
				</div>
			</div>
		</template>

		<!-- 微信登录 -->
		<template v-if="oauthChannel.includes(currentLogin)">
			<div class="py-10 flex flex-col items-center">
				<h3
					class="text-2xl font-nike tracking-tighter uppercase text-foreground mb-10 text-center">
					{{
						currentLogin === "wx"
							? "扫码关注登录"
							: "小程序扫码登录"
					}}
				</h3>

				<div class="relative group">
					<div
						v-loading="!sanQrCodeUrl"
						class="relative w-60 h-60 p-4 bg-white rounded-3xl shadow-xl border border-border/40 overflow-hidden">
						<img
							v-if="sanQrCodeUrl"
							:src="sanQrCodeUrl"
							alt="qr"
							class="w-full h-full object-contain" />

						<div
							v-if="sanCodeStatus !== ScanCodeStatus.WAITING"
							class="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col justify-center items-center cursor-pointer transition-all duration-300"
							@click="onRefreshOrCode()">
							<div class="space-y-4 text-center">
								<div
									v-if="
										sanCodeStatus === ScanCodeStatus.EXPIRED
									"
									class="flex flex-col items-center gap-3">
									<Icon
										name="fa-solid fa-rotate-right"
										class="text-3xl text-primary animate-spin-slow" />
									<span
										class="text-sm font-nike tracking-widest uppercase font-bold"
										>刷新二维码</span
									>
								</div>
								<div
									v-if="
										sanCodeStatus === ScanCodeStatus.SCANNED
									"
									class="flex flex-col items-center gap-3">
									<Icon
										name="fa-solid fa-spinner"
										class="text-3xl text-indigo-500 animate-spin" />
									<span
										class="text-sm font-nike tracking-widest uppercase font-bold"
										>等待确认...</span
									>
								</div>
								<div
									v-if="
										sanCodeStatus === ScanCodeStatus.SUCCESS
									"
									class="flex flex-col items-center gap-3">
									<Icon
										name="fa-solid fa-check"
										class="text-3xl text-green-500" />
									<span
										class="text-sm font-nike tracking-widest uppercase font-bold"
										>登录成功</span
									>
								</div>
							</div>
						</div>
					</div>
					<!-- QR Corners decoration -->
					<div
						class="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl opacity-40"></div>
					<div
						class="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl opacity-40"></div>
					<div
						class="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl opacity-40"></div>
					<div
						class="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl opacity-40"></div>
				</div>

				<div class="mt-10 text-center space-y-4">
					<template v-if="sanCodeStatus === ScanCodeStatus.WAITING">
						<p
							class="text-sm font-bold tracking-widest uppercase text-foreground">
							使用微信扫码
						</p>
						<p
							class="text-xs text-muted-foreground max-w-[200px] leading-relaxed italic">
							{{
								currentLogin === "wx"
									? "首次扫码关注公众号后将自动注册新账号"
									: "使用微信扫描小程序码进行登录/注册"
							}}
						</p>
					</template>
					<template v-if="sanCodeStatus === ScanCodeStatus.EXPIRED">
						<p
							class="text-sm font-bold tracking-widest uppercase text-destructive">
							二维码已过期
						</p>
						<p class="text-xs text-muted-foreground italic">
							点击二维码区域手动刷新
						</p>
					</template>
				</div>

				<button
					v-if="meansChannel.length"
					@click="currentLogin = meansChannel[0]"
					class="mt-12 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-primary/70 transition-colors group">
					<Icon
						name="fa-solid fa-arrow-left"
						class="group-hover:-translate-x-1 transition-transform" />
					返回账号登录
				</button>
			</div>
		</template>

		<!-- Footer Protocol -->
		<div
			class="mt-12 py-6 px-4 bg-secondary/30 rounded-2xl text-[11px] leading-relaxed text-muted-foreground text-center">
			登录或注册即代表您同意
			<nuxt-link
				:to="`/policy/${policyEnum.SERVICE}`"
				class="text-foreground font-bold hover:text-primary underline underline-offset-2 transition-colors"
				>用户协议</nuxt-link
			>
			与
			<nuxt-link
				:to="`/policy/${policyEnum.PRIVACY}`"
				class="text-foreground font-bold hover:text-primary underline underline-offset-2 transition-colors"
				>隐私政策</nuxt-link
			>。
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { FormInstance, FormRules } from "element-plus";
	import { policyEnum, popupEnum } from "@/enums/app";
	import { noticeEnum } from "~/enums/notice";
	import { ScanCodeStatus } from "~/enums/login";
	import useUserStore from "~/stores/user";
	import useAppStore from "~/stores/app";
	import loginApi from "~/api/login";
	import appApi from "~/api/app";

	const appStore = useAppStore();
	const userStore = useUserStore();

	// 登录配置
	const currentLogin = ref(appStore.getLoginConfig.defaults);
	const meansChannel = computed(() => (appStore.getLoginConfig || {}).means);
	const oauthChannel = computed(() => (appStore.getLoginConfig || {}).oauth);

	// 表单参数
	const formData = reactive({
		password: "",
		account: "",
		mobile: "",
		code: "",
	});

	// 扫码登录
	let timer: any = null;
	const sanCodeStatus = ref<ScanCodeStatus>(ScanCodeStatus.WAITING);
	const sanQrCodeUrl = ref(""); // 二维码链接
	const sanLoginKey = ref(""); // 登录密钥
	const sanExpire = ref(0); // 失效时间

	// 表单验证
	const formRef = shallowRef<FormInstance>();
	const formRules: FormRules = {
		mobile: [
			{ required: true, message: "请输入手机号", trigger: "blur" },
			{
				pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
				message: "请输入正确的手机号码",
				trigger: "blur",
			},
		],
		account: [{ required: true, message: "请输入手机号", trigger: "blur" }],
		password: [{ required: true, message: "请输入密码", trigger: "blur" }],
		code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
	};

	/**
	 * 发验证码
	 */
	const isSendIng = ref(false);
	const verifyCodeRef = shallowRef();
	const handleSendSms = async () => {
		if (!formData.mobile) {
			return feedback.msgError("请填写手机号");
		}
		if (isSendIng.value) {
			return feedback.msgError("操作频繁,请稍后再试");
		}
		await formRef.value
			?.validateField(["mobile"])
			.then(async () => {
				isSendIng.value = true;
				verifyCodeRef.value?.ing();
				await appApi
					.sendSms({
						scene: noticeEnum.LOGIN,
						mobile: formData.mobile,
					})
					.then(() => {
						feedback.msgSuccess("发送成功");
						verifyCodeRef.value?.start();
					})
					.catch(() => {
						verifyCodeRef.value?.end();
					})
					.finally(() => {
						isSendIng.value = false;
					});
			})
			.catch(() => {});
	};

	/**
	 * 账号登录
	 */
	const { lockFn: onAccountLoginLock, isLock } = useLockFn(async () => {
		const scene = currentLogin.value;
		let params = {};
		switch (scene) {
			case "account":
				params = {
					scene: scene,
					account: formData.account,
					password: formData.password,
				};
				break;
			case "mobile":
				params = {
					scene: scene,
					mobile: formData.mobile,
					code: formData.code,
				};
		}

		await loginApi
			.login(params)
			.then(async (res) => {
				feedback.msgSuccess("登录成功");
				userStore.login(res.token);
				await userStore.getUser();
				appStore.setPopup(popupEnum.NULL);
				// setTimeout(() => {
				//     location.reload()
				// }, 800)
			})
			.catch(() => {});
	});

	/**
	 * 刷新二维码
	 */
	const onRefreshOrCode = () => {
		if (sanCodeStatus.value === ScanCodeStatus.EXPIRED) {
			if (currentLogin.value === "wx") {
				getOaLoginQrCode();
			} else if (currentLogin.value === "wx_mini") {
				getMiniLoginQrCode();
			}
		}
	};

	/**
	 * 公众号登录
	 */
	const getOaLoginQrCode = async () => {
		sanQrCodeUrl.value = "";
		sanCodeStatus.value = ScanCodeStatus.WAITING;
		const data = await loginApi.oaLoginQr("login");
		data.expire_seconds = parseInt(String(data.expire_seconds || 120));
		sanQrCodeUrl.value = data.url;
		sanLoginKey.value = data.key;
		sanExpire.value = data.expire_seconds;

		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		timer = setInterval(async () => {
			try {
				if (sanExpire.value) {
					sanExpire.value = sanExpire.value - 1;
					const result = await loginApi.oaTicket(data.key);
					if (
						result?.token &&
						result.status === ScanCodeStatus.SUCCESS
					) {
						clearInterval(timer);
						timer = null;
						sanCodeStatus.value = ScanCodeStatus.SUCCESS;
						userStore.login(result.token);
						await userStore.getUser();
						setTimeout(() => {
							appStore.setPopup(popupEnum.NULL);
							location.reload();
						}, 1800);
					} else if (result.status === ScanCodeStatus.SCANNED) {
						sanCodeStatus.value = ScanCodeStatus.SCANNED;
					} else if (result.status !== ScanCodeStatus.WAITING) {
						clearInterval(timer);
						timer = null;
					}
				} else {
					sanCodeStatus.value = ScanCodeStatus.EXPIRED;
					clearInterval(timer);
					timer = null;
				}
			} catch (error) {
				console.error("OA login polling error:", error);
				// 继续轮询,不中断
			}
		}, 2000);
	};

	/**
	 * 小程序登录
	 */
	const getMiniLoginQrCode = async () => {
		sanQrCodeUrl.value = "";
		sanCodeStatus.value = ScanCodeStatus.WAITING;

		try {
			const data = await loginApi.miniLoginQr("login");
			data.expire_seconds = parseInt(String(data.expire_seconds || 120));

			sanQrCodeUrl.value = data.url;
			sanLoginKey.value = data.key;
			sanExpire.value = data.expire_seconds;

			if (timer) {
				clearInterval(timer);
				timer = null;
			}

			// Polling logic - same as getOaLoginQrCode
			timer = setInterval(async () => {
				try {
					if (sanExpire.value) {
						sanExpire.value = sanExpire.value - 1;
						const result = await loginApi.oaTicket(data.key);
						if (
							result?.token &&
							result.status === ScanCodeStatus.SUCCESS
						) {
							clearInterval(timer);
							timer = null;
							sanCodeStatus.value = ScanCodeStatus.SUCCESS;
							userStore.login(result.token);
							await userStore.getUser();
							setTimeout(() => {
								appStore.setPopup(popupEnum.NULL);
								location.reload();
							}, 1800);
						} else if (result.status === ScanCodeStatus.SCANNED) {
							sanCodeStatus.value = ScanCodeStatus.SCANNED;
						} else if (result.status !== ScanCodeStatus.WAITING) {
							clearInterval(timer);
							timer = null;
						}
					} else {
						sanCodeStatus.value = ScanCodeStatus.EXPIRED;
						clearInterval(timer);
						timer = null;
					}
				} catch (error) {
					console.error("Mini login polling error:", error);
					// 继续轮询,不中断
				}
			}, 2000);
		} catch (error) {
			console.error("Failed to generate miniprogram QR code:", error);
			feedback.msgError("生成小程序码失败");
		}
	};

	watch(
		currentLogin,
		() => {
			sanCodeStatus.value = ScanCodeStatus.WAITING;
			sanQrCodeUrl.value = "";
			sanLoginKey.value = "";
			sanExpire.value = 0;
			if (timer !== null && timer !== undefined) {
				clearInterval(timer);
			}

			if (currentLogin.value === "wx") {
				getOaLoginQrCode();
			} else if (currentLogin.value === "wx_mini") {
				getMiniLoginQrCode();
			}
		},
		{ immediate: true }
	);

	const { popupType } = toRefs(appStore);
	watch(popupType, () => {
		if (timer !== null) {
			clearInterval(timer);
		}
	});

	onBeforeUnmount(() => {
		if (timer !== null) {
			clearInterval(timer);
		}
	});
</script>

<style lang="scss">
	.modern-form {
		.el-form-item {
			margin-bottom: 24px;
			&.is-error {
				.premium-input {
					.el-input__wrapper {
						border-color: var(--el-color-danger) !important;
					}
				}
			}
		}

		.premium-input {
			.el-input__wrapper {
				padding: 0 16px 0 48px !important;
				background-color: var(--secondary-color) !important;
				border-radius: 16px !important;
				box-shadow: none !important;
				border: 1px solid transparent !important;
				height: 56px !important;
				transition: all 0.3s ease;

				&:hover {
					background-color: var(--secondary-color-hover) !important;
				}

				&.is-focus {
					background-color: var(--el-bg-color) !important;
					border-color: var(--el-color-primary) !important;
					box-shadow: 0 0 0 4px var(--el-color-primary-light-8) !important;
				}
			}

			&.pl-12 {
				.el-input__wrapper {
					padding-left: 0 !important;
				}
			}

			.el-input__inner {
				font-weight: 500;
				color: var(--el-text-color-primary);
				&::placeholder {
					color: var(--el-text-color-placeholder);
					font-weight: 400;
				}
			}
		}

		.premium-button {
			border-radius: 16px !important;
			font-weight: 800 !important;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 20px -4px var(--el-color-primary-light-3);
			}
			&:active {
				transform: translateY(0);
			}
		}
	}

	.animate-spin-slow {
		animation: spin 3s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
