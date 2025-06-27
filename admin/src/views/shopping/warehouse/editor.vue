<template>
	<popup
		:show="showEdit"
		:title="popTitle"
		:loading="loading"
		:async-close="true"
		width="70%"
		@close="emits('close')"
		@confirm="handleSubmit">
		<div class="p-6 pb-0 relative">
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="150px">
				<el-form-item
					label="关联商品ID"
					prop="commodity_id">
					<el-select
						v-model="formData.commodity_id"
						placeholder="请选择所属商品"
						clearable>
						<el-option
							v-for="(item, index) in optionsData.cate"
							:key="index"
							:label="item.label"
							:value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item
					label="卡号/卡密内容"
					prop="title">
					<el-input
						v-model="formData.title"
						placeholder="请输入卡号 / 卡密内容"
						maxlength="100" />
				</el-form-item>

				<el-form-item
					label="卡密密码"
					prop="password">
					<el-input
						v-model="formData.password"
						placeholder="请输入卡密密码（如无可留空）"
						maxlength="100" />
				</el-form-item>

				<el-form-item
					label="卡密类型"
					prop="card_type">
					<el-select
						v-model="formData.card_type"
						placeholder="请选择卡密类型"
						clearable>
						<el-option
							label="唯一"
							value="0" />
						<el-option
							label="共享库存"
							value="1" />
						<el-option
							label="无限库存"
							value="2" />
					</el-select>
				</el-form-item>

				<el-form-item
					label="库存数量"
					prop="stock">
					<el-input-number
						v-model="formData.stock"
						:min="0"
						:max="999999" />
				</el-form-item>
			</el-form>
		</div>
	</popup>
</template>

<script setup lang="ts">
	import { useDictOptions } from '@/hooks/useOption'
	import feedback from "@/utils/feedback";
	import warehouse_cardApi from "@/api/shopping/warehouse_card";
	import commodityAPI from "@/api/shopping/commodity";

	import { ref, reactive, computed } from "vue";

	const emits = defineEmits(["success", "close"]);
	const formRef = ref();
	const showMode = ref("add");
	const showEdit = ref(false);

	const popTitle = computed(() =>
		showMode.value === "edit" ? "编辑Warehouse Card" : "新增Warehouse Card"
	);

	const loading = ref(false);

	const formData = reactive<any>({
		id: 0,
		commodity_id: "",
		title: "",
		password: "",
		card_type: "",
		stock: 0,
	});

	const formRules = reactive({
		commodity_id: [
			{
				required: true,
				message: "关联商品ID不能为空",
				trigger: ["blur"],
			},
		],
		title: [
			{
				required: true,
				message: "卡号 / 卡密内容不能为空",
				trigger: ["blur"],
			},
		],
		password: [
			{
				required: true,
				message: "卡密密码（如无可留空）不能为空",
				trigger: ["blur"],
			},
		],
		card_type: [
			{
				required: true,
				message: "卡密类型: [0=唯一, 1=共享库存, 2=无限库存]不能为空",
				trigger: ["blur"],
			},
		],
		stock: [
			{
				required: true,
				message: "共享库存数量，仅在 card_type=1 时有效不能为空",
				trigger: ["blur"],
			},
		],
	});

	const { optionsData } = useDictOptions({
		cate: {
			api: commodityAPI.selects || (() => Promise.resolve([])),
		},
	});

	const handleSubmit = async () => {
		await formRef.value?.validate();
		loading.value = true;
		try {
			if (showMode.value === "edit") {
				await warehouse_cardApi.edit(formData);
			} else {
				await warehouse_cardApi.add(formData);
			}
			feedback.msgSuccess("操作成功");
			emits("close");
			emits("success");
		} finally {
			loading.value = false;
		}
	};

	const open = async (type: string, row?: any): Promise<void> => {
		showMode.value = type;
		showEdit.value = true;

		if (type === "edit") {
			for (const key in formData) {
				if (row[key] !== null && row[key] !== undefined) {
					formData[key] = row[key];
				}
			}
		}
	};

	defineExpose({
		open,
	});
</script>
