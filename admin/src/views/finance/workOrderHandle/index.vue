<template>
	<popup
		:show="showEdit"
		:title="popTitle"
		:loading="loading"
		:async-close="true"
		width="600px"
		@close="emits('close')"
		@confirm="handleSubmit">
		<div class="p-6 pb-0">
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="120px">
				<el-form-item label="工单ID">
					<el-input
						v-model="formData.work_order_id"
						disabled
						placeholder="工单ID" />
				</el-form-item>

				<el-form-item label="子订单ID">
					<el-input
						v-model="formData.sub_order_id"
						disabled
						placeholder="子订单ID" />
				</el-form-item>

				<el-form-item
					label="处理操作"
					prop="action">
					<el-radio-group v-model="formData.action">
						<el-radio label="agree">同意售后</el-radio>
						<el-radio label="refuse">拒绝售后</el-radio>
						<el-radio label="confirm">确认退货成功</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item
					v-if="formData.action === 'refuse'"
					label="拒绝原因"
					prop="refuse_reason">
					<el-input
						v-model="formData.refuse_reason"
						type="textarea"
						:rows="4"
						placeholder="请输入拒绝原因"
						maxlength="500"
						show-word-limit />
				</el-form-item>

				<el-alert
					v-if="formData.action === 'agree'"
					title="同意售后后，如果是仅退款将直接完成；如果是退货退款，状态将变为处理中，等待用户退货。"
					type="info"
					:closable="false"
					class="mb-4" />

				<el-alert
					v-if="formData.action === 'confirm'"
					title="确认退货成功后，订单状态将变为已完成，并触发退款流程。"
					type="warning"
					:closable="false"
					class="mb-4" />
			</el-form>
		</div>
	</popup>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, watch } from "vue";
	import feedback from "@/utils/feedback";
	import orderApi from "@/api/finance/order";

	const emits = defineEmits(["success", "close"]);

	const formRef = ref();
	const showEdit = ref<boolean>(false);
	const loading = ref<boolean>(false);
	const popTitle = computed<string>(() => {
		return "处理售后";
	});

	// 表单数据
	const formData: any = reactive({
		work_order_id: "", // 工单ID
		sub_order_id: "", // 子订单ID
		action: "agree", // 操作类型
		refuse_reason: "", // 拒绝原因
	});

	// 表单规则
	const formRules: any = reactive({
		action: [
			{ required: true, message: "请选择处理操作", trigger: ["change"] },
		],
		refuse_reason: [
			{ required: true, message: "请填写拒绝原因", trigger: ["blur"] },
		],
	});

	// 监听action变化，清空拒绝原因
	watch(
		() => formData.action,
		(newVal) => {
			if (newVal !== "refuse") {
				formData.refuse_reason = "";
			}
		}
	);

	/**
	 * 提交表单
	 */
	const handleSubmit = async (): Promise<void> => {
		await formRef.value?.validate();
		loading.value = true;
		try {
			await orderApi.handleAfterSales({
				work_order_id: formData.work_order_id,
				action: formData.action,
				refuse_reason:
					formData.action === "refuse"
						? formData.refuse_reason
						: null,
			});

			const actionText =
				formData.action === "agree"
					? "同意"
					: formData.action === "refuse"
					? "拒绝"
					: "确认退货";
			feedback.msgSuccess(`${actionText}成功`);

			emits("close");
			emits("success");
		} catch (error: any) {
			feedback.msgError(error.message || "操作失败，请重试");
		} finally {
			loading.value = false;
			showEdit.value = false;
		}
	};

	/**
	 * 打开表单
	 *
	 * @param {any} row - 包含work_order_id和sub_order_id的数据行
	 * @returns {Promise<void>}
	 */
	const open = async (row?: any): Promise<void> => {
		// 重置表单数据
		formData.work_order_id = row?.work_order_id || "";
		formData.sub_order_id = row?.sub_order_id || "";
		formData.action = "agree";
		formData.refuse_reason = "";

		// 重置表单验证状态
		if (formRef.value) {
			formRef.value.resetFields();
		}

		showEdit.value = true;
	};

	defineExpose({
		open,
	});
</script>

<style scoped lang="scss">
	/* 组件样式可以根据需要进行扩展 */
</style>
