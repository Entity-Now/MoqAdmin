<template>
	<el-tabs
		v-model="activeTab"
		class="seo-tabs">
		<!-- 百度SEO -->
		<el-tab-pane
			label="百度SEO"
			name="baidu">
			<el-form
				ref="baiduFormRef"
				:rules="baiduRules"
				:model="baiduFormData"
				label-width="120px">
				<el-card
					shadow="never"
					class="!border-none">
					<div class="text-xl font-medium mb-[20px]">百度SEO配置</div>
					<el-form-item
						label="网站域名："
						prop="site">
						<div class="w-[380px]">
							<el-input
								v-model.trim="baiduFormData.site"
								placeholder="请输入网站域名，如：https://www.example.com"
								clearable />
						</div>
					</el-form-item>
					<el-form-item
						label="Token："
						prop="token">
						<div class="w-[380px]">
							<el-input
								v-model.trim="baiduFormData.token"
								placeholder="请输入百度站长平台Token"
								clearable />
						</div>
					</el-form-item>
				</el-card>

				<!-- 操作按钮 -->
				<el-card
					shadow="never"
					class="!border-none mt-4">
					<el-space>
						<el-button
							v-perms="['setting:seo:save']"
							:loading="baiduSaveLoading"
							type="primary"
							@click="handleBaiduSave"
							>保存配置</el-button
						>
						<el-button
							v-perms="['setting:seo:submit']"
							:loading="baiduSubmitLoading"
							type="success"
							@click="handleBaiduSubmit"
							>提交URL到百度</el-button
						>
					</el-space>
				</el-card>
			</el-form>
		</el-tab-pane>

		<!-- Bing SEO -->
		<el-tab-pane
			label="Bing SEO"
			name="bing">
			<el-form
				ref="bingFormRef"
				:rules="bingRules"
				:model="bingFormData"
				label-width="120px">
				<el-card
					shadow="never"
					class="!border-none">
					<div class="text-xl font-medium mb-[20px]">
						Bing SEO配置
					</div>
					<el-form-item
						label="网站域名："
						prop="siteUrl">
						<div class="w-[380px]">
							<el-input
								v-model.trim="bingFormData.siteUrl"
								placeholder="请输入网站域名，如：https://www.example.com"
								clearable />
						</div>
					</el-form-item>
					<el-form-item
						label="API Key："
						prop="apikey">
						<div class="w-[380px]">
							<el-input
								v-model.trim="bingFormData.apikey"
								placeholder="请输入Bing Webmaster API Key"
								clearable />
						</div>
					</el-form-item>
				</el-card>

				<!-- 操作按钮 -->
				<el-card
					shadow="never"
					class="!border-none mt-4">
					<el-space>
						<el-button
							v-perms="['setting:seo:save']"
							:loading="bingSaveLoading"
							type="primary"
							@click="handleBingSave"
							>保存配置</el-button
						>
						<el-button
							v-perms="['setting:seo:submit']"
							:loading="bingSubmitLoading"
							type="success"
							@click="handleBingSubmit"
							>提交URL到Bing</el-button
						>
					</el-space>
				</el-card>
			</el-form>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
	import feedback from "@/utils/feedback";
	import seoApi from "@/api/setting/seo";

	const activeTab = ref("baidu");

	// ==================== 百度SEO ====================
	const baiduSaveLoading = ref(false);
	const baiduSubmitLoading = ref(false);
	const baiduFormRef = ref();
	const baiduFormData = reactive({
		site: "",
		token: "",
	});

	// 百度表单验证
	const baiduRules = {
		site: [
			{ required: true, message: "请输入网站域名", trigger: "blur" },
			{ max: 200, message: "网站域名不能超出200个字符", trigger: "blur" },
		],
		token: [
			{ required: true, message: "请输入Token", trigger: "blur" },
			{ max: 200, message: "Token不能超出200个字符", trigger: "blur" },
		],
	};

	/**
	 * 查询百度配置参数
	 */
	const queryBaiduConfig = async (): Promise<void> => {
		const data = await seoApi.baiduDetail();
		Object.assign(baiduFormData, data);
	};

	/**
	 * 保存百度配置
	 */
	const handleBaiduSave = async (): Promise<void> => {
		await baiduFormRef.value?.validate();

		baiduSaveLoading.value = true;
		await seoApi.baiduSave(baiduFormData).finally(() => {
			setTimeout(() => {
				baiduSaveLoading.value = false;
			}, 500);
		});

		await queryBaiduConfig();
		feedback.msgSuccess("保存成功");
	};

	/**
	 * 提交URL到百度
	 */
	const handleBaiduSubmit = async (): Promise<void> => {
		await baiduFormRef.value?.validate();

		baiduSubmitLoading.value = true;
		try {
			const result = await seoApi
				.baiduSubmit(baiduFormData)
				.finally(() => {
					setTimeout(() => {
						baiduSubmitLoading.value = false;
					}, 500);
				});

			// 显示提交结果
			const successCount = result.success || 0;
			const remainCount = result.remain || 0;
			feedback.msgSuccess(
				`提交成功！成功提交 ${successCount} 个URL，今日剩余 ${remainCount} 次`
			);
		} catch (error: any) {
			feedback.msgError(error.message || "提交失败");
		}
	};

	// ==================== Bing SEO ====================
	const bingSaveLoading = ref(false);
	const bingSubmitLoading = ref(false);
	const bingFormRef = ref();
	const bingFormData = reactive({
		siteUrl: "",
		apikey: "",
	});

	// Bing表单验证
	const bingRules = {
		siteUrl: [
			{ required: true, message: "请输入网站域名", trigger: "blur" },
			{ max: 200, message: "网站域名不能超出200个字符", trigger: "blur" },
		],
		apikey: [
			{ required: true, message: "请输入API Key", trigger: "blur" },
			{ max: 200, message: "API Key不能超出200个字符", trigger: "blur" },
		],
	};

	/**
	 * 查询Bing配置参数
	 */
	const queryBingConfig = async (): Promise<void> => {
		const data = await seoApi.bingDetail();
		Object.assign(bingFormData, data);
	};

	/**
	 * 保存Bing配置
	 */
	const handleBingSave = async (): Promise<void> => {
		await bingFormRef.value?.validate();

		bingSaveLoading.value = true;
		await seoApi.bingSave(bingFormData).finally(() => {
			setTimeout(() => {
				bingSaveLoading.value = false;
			}, 500);
		});

		await queryBingConfig();
		feedback.msgSuccess("保存成功");
	};

	/**
	 * 提交URL到Bing
	 */
	const handleBingSubmit = async (): Promise<void> => {
		await bingFormRef.value?.validate();

		bingSubmitLoading.value = true;
		try {
			await seoApi.bingSubmit(bingFormData).finally(() => {
				setTimeout(() => {
					bingSubmitLoading.value = false;
				}, 500);
			});

			feedback.msgSuccess("提交成功！");
		} catch (error: any) {
			feedback.msgError(error.message || "提交失败");
		}
	};

	// ==================== 生命周期 ====================
	onMounted(async () => {
		await queryBaiduConfig();
		await queryBingConfig();
	});
</script>

<style scoped lang="scss">
	.seo-tabs {
		:deep(.el-tabs__content) {
			padding-top: 20px;
		}
	}
</style>
