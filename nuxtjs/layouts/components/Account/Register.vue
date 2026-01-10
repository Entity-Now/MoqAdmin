<template>
	<div
		class="w-full max-w-[420px] bg-background p-8 md:p-10 rounded-4xl shadow-2xl border border-white/10">
		<div class="mb-10 text-center">
			<h2
				class="text-3xl font-nike tracking-tighter uppercase text-foreground">
				加入我们
			</h2>
			<p class="mt-2 text-sm text-muted-foreground font-medium">
				创建新账户，开启您的精彩旅程
			</p>
		</div>

		<!-- 注册账号 -->
		<div v-if="registerConfigs.length > 0">
			<div class="flex gap-1 p-1 bg-secondary/50 rounded-2xl mb-8">
				<button
					v-if="registerConfigs.includes('mobile')"
					@click="handleTabChange('mobile')"
					class="flex-1 py-3 text-sm font-nike tracking-widest uppercase rounded-xl transition-all duration-300"
					:class="
						currentRegister === 'mobile'
							? 'bg-background shadow-lg text-primary font-bold'
							: 'text-foreground/40 hover:text-foreground'
					">
					手机注册
				</button>
				<button
					v-if="registerConfigs.includes('email')"
					@click="handleTabChange('email')"
					class="flex-1 py-3 text-sm font-nike tracking-widest uppercase rounded-xl transition-all duration-300"
					:class="
						currentRegister === 'email'
							? 'bg-background shadow-lg text-primary font-bold'
							: 'text-foreground/40 hover:text-foreground'
					">
					邮箱注册
				</button>
			</div>

			<ElForm
				ref="formRef"
				size="large"
				:model="formData"
				:rules="formRules"
				class="modern-form">
				<ElFormItem
					v-if="currentRegister === 'mobile'"
					prop="mobile">
					<div class="w-full relative group">
						<Icon
							name="fa-solid fa-phone"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
						<ElInput
							v-model="formData.mobile"
							placeholder="手机号码"
							class="premium-input pl-12">
							<template #prefix>
								<span
									class="text-xs font-bold text-foreground/40 mr-2 ml-8"
									>+86</span
								>
							</template>
						</ElInput>
					</div>
				</ElFormItem>
				<ElFormItem
					v-if="currentRegister === 'email'"
					prop="email">
					<div class="w-full relative group">
						<Icon
							name="fa-solid fa-envelope"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
						<ElInput
							v-model="formData.email"
							placeholder="邮箱地址"
							class="premium-input" />
					</div>
				</ElFormItem>
				<ElFormItem
					v-if="enable_captcha == 'False' || enable_captcha == false"
					prop="code">
					<div class="w-full relative group">
						<Icon
							name="fa-solid fa-shield-halved"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
						<ElInput
							v-model="formData.code"
							placeholder="验证码"
							class="premium-input">
							<template #suffix>
								<div class="pr-2">
									<VerifyCode
										ref="verificationCodeRef"
										@click-get="onSendSms" />
								</div>
							</template>
						</ElInput>
					</div>
				</ElFormItem>
				<ElFormItem prop="password">
					<div class="w-full relative group">
						<Icon
							name="fa-solid fa-lock"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
						<ElInput
							v-model="formData.password"
							type="password"
							show-password
							placeholder="设置密码 (6-20位字符)"
							class="premium-input" />
					</div>
				</ElFormItem>
				<ElFormItem prop="password_confirm">
					<div class="w-full relative group">
						<Icon
							name="fa-solid fa-check-double"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-sm" />
						<ElInput
							v-model="formData.password_confirm"
							type="password"
							show-password
							placeholder="再次确认密码"
							class="premium-input" />
					</div>
				</ElFormItem>
				<ElFormItem class="mt-10">
					<ElButton
						type="primary"
						class="w-full premium-button h-14"
						:loading="isLock"
						@click="onRegisterLock()">
						<span class="font-nike tracking-widest uppercase"
							>立即注册</span
						>
					</ElButton>
				</ElFormItem>
			</ElForm>
		</div>

		<div
			v-else
			class="py-20 flex flex-col items-center">
			<Icon
				name="fa-solid fa-ban"
				class="text-6xl text-muted-foreground/20 mb-6" />
			<p
				class="text-sm font-nike tracking-widest uppercase text-muted-foreground font-bold">
				注册服务已关闭
			</p>
		</div>

		<div class="mt-8 text-center">
			<p class="text-sm text-muted-foreground">
				已有账号？
				<button
					@click="appStore.setPopup(popupEnum.LOGIN)"
					class="text-primary font-bold hover:underline transition-all">
					立即登录
				</button>
			</p>
		</div>

		<!-- Footer Protocol -->
		<div
			class="mt-10 py-6 px-4 bg-secondary/30 rounded-2xl text-[11px] leading-relaxed text-muted-foreground text-center">
			创建账号即代表您同意我们的
			<NuxtLink
				:to="`/policy/${policyEnum.SERVICE}`"
				class="text-foreground font-bold hover:text-primary underline underline-offset-2 transition-colors"
				target="_blank"
				>用户协议</NuxtLink
			>
			与
			<NuxtLink
				:to="`/policy/${policyEnum.PRIVACY}`"
				class="text-foreground font-bold hover:text-primary underline underline-offset-2 transition-colors"
				target="_blank"
				>隐私政策</NuxtLink
			>。
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { FormInstance, FormRules } from "element-plus";
	import { popupEnum, policyEnum } from "@/enums/app";
	import { noticeEnum } from "~/enums/notice";
	import useAppStore from "~/stores/app";
	import useUserStore from "~/stores/user";
	import loginApi from "~/api/login";
	import appApi from "~/api/app";

	const appStore = useAppStore();
	const userStore = useUserStore();

	// 注册配置
	const registerConfigs: any = appStore.getLoginConfig.register;
	const currentRegister = ref(registerConfigs[0]);
	const enable_captcha: any = appStore.getLoginConfig.disable_captcha;

	const handleTabChange = (tab: string) => {
		currentRegister.value = tab;
	};
	// 表单参数
	const formData = reactive({
		mobile: "",
		email: "",
		code: "",
		password: "",
		password_confirm: "",
	});

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
		email: [
			{ required: true, message: "请输入邮箱号", trigger: "blur" },
			{
				pattern:
					/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
				min: 2,
				max: 30,
				message: "邮箱格式错误",
				trigger: "blur",
			},
		],
		code: [
			{ required: true, message: "请输入验证码", trigger: "blur" },
			{ min: 4, max: 20, message: "验证码不正确", trigger: "blur" },
		],
		password: [
			{
				required: true,
				message: "请输入6-20位数字+字母或符号组合",
				trigger: "blur",
			},
			{
				min: 6,
				max: 20,
				message: "密码长度应为6~20个字符",
				trigger: "blur",
			},
		],
		password_confirm: [
			{
				trigger: "blur",
				validator(_rule: any, value: any, callback: any) {
					if (value === "") {
						callback(new Error("请再次输入密码"));
					} else if (value !== formData.password) {
						callback(new Error("两次输入的密码不一致"));
					} else {
						callback();
					}
				},
			},
		],
	};

	/**
	 * 发验证码
	 */
	const verificationCodeRef = shallowRef();
	const onSendSms = async () => {
		if (currentRegister.value === "mobile") {
			await formRef.value?.validateField(["mobile"]);
			await appApi
				.sendSms({
					scene: noticeEnum.MOBILE_REG,
					mobile: formData.mobile,
				})
				.then(() => {
					verificationCodeRef.value?.start();
				})
				.catch(() => {});
		} else {
			await formRef.value?.validateField(["email"]);
			await appApi
				.sendEmail({
					scene: noticeEnum.EMAIL_REG,
					email: formData.email,
				})
				.then(() => {
					verificationCodeRef.value?.start();
				})
				.catch(() => {});
		}
	};

	/**
	 * 注册账号
	 */
	const { lockFn: onRegisterLock, isLock } = useLockFn(async () => {
		const scene = currentRegister.value;
		const account = scene === "mobile" ? formData.mobile : formData.email;
		const params = {
			scene: scene,
			account: account,
			code: formData.code,
			password: formData.password,
		};

		await loginApi
			.register(params)
			.then(async (res: any) => {
				feedback.msgSuccess("注册成功");
				userStore.login(res.token);
				await userStore.getUser();
				setTimeout(() => {
					appStore.setPopup(popupEnum.NULL);
					location.reload();
				}, 1500);
			})
			.catch(() => {});
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
</style>
