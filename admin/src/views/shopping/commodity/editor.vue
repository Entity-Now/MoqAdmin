<template>
	<popup
		:show="showEdit"
		:title="popTitle"
		:loading="loading"
		:async-close="true"
		width="80%"
		@close="emits('close')"
		@confirm="handleSubmit">
		<div class="p-6 pb-0">
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="120px">
				<el-form-item
					label="所属分类"
					prop="cid">
					<el-select
						v-model="formData.cid"
						placeholder="请选择所属分类"
						clearable>
						<el-option
							v-for="(item, index) in optionsData.cate"
							:key="index"
							:label="item.label"
							:value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item
					label="商品封面"
					prop="image">
					<material-picker
						v-model="formData.image"
						:limit="5" />
				</el-form-item>
				<el-form-item
					label="名称"
					prop="name">
					<el-input
						v-model="formData.title"
						maxlength="20" />
				</el-form-item>
				<el-form-item
					label="商品价格"
					prop="price">
					<el-input-number
						v-model="formData.price"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="运费"
					prop="fee">
					<el-input-number
						v-model="formData.fee"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="商品库存"
					prop="stock">
					<el-input-number
						v-model="formData.stock"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="商品销量"
					prop="sales">
					<el-input-number
						v-model="formData.sales"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="商品浏览"
					prop="browse">
					<el-input-number
						v-model="formData.browse"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="商品收藏"
					prop="collect">
					<el-input-number
						v-model="formData.collect"
						:min="0" />
				</el-form-item>
				<el-form-item
					label="排序"
					prop="sort">
					<el-input-number
						v-model="formData.sort"
						:min="0"
						:max="9999" />
				</el-form-item>
				<el-form-item
					label="是否使用规格库存"
					prop="use_sku_stock">
					<el-radio-group v-model="formData.use_sku_stock">
						<el-radio :value="0">否</el-radio>
						<el-radio :value="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="是否置顶"
					prop="is_topping">
					<el-radio-group v-model="formData.is_topping">
						<el-radio :value="0">否</el-radio>
						<el-radio :value="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="是否推荐"
					prop="is_recommend">
					<el-radio-group v-model="formData.is_recommend">
						<el-radio :value="0">否</el-radio>
						<el-radio :value="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="发货方式"
					prop="deliveryType">
					<el-radio-group v-model="formData.deliveryType">
						<el-radio :value="0">无需发货</el-radio>
						<el-radio :value="1">自动发卡</el-radio>
						<el-radio :value="2">人工发卡</el-radio>
						<el-radio :value="3">物流发货</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="是否显示"
					prop="is_show">
					<el-radio-group v-model="formData.is_show">
						<el-radio :value="0">否</el-radio>
						<el-radio :value="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="规格"
					prop="sku">
					<SKUEditor
						v-if="showEdit"
						v-model="formData.sku" />
				</el-form-item>
				<el-form-item
					label="介绍"
					prop="intro">
					<TiptapAntDesign
						v-if="showEdit"
						class="w-full h-[400px] !border border-solid border-gray-300"
						v-model:content="formData.intro"
						:height="667" />
				</el-form-item>
			</el-form>
		</div>
	</popup>
</template>

<script setup lang="ts">
	import { useDictOptions } from "@/hooks/useOption";
	import SKUEditor from "@/components/SKUEditor/index.vue";
	import feedback from "@/utils/feedback";
	import categoryApi from "@/api/shopping/category";
	import commodityApi from "@/api/shopping/commodity";
	import TiptapAntDesign from "tiptap-ant-design-vue";

	const emits = defineEmits(["success", "close"]);

	const formRef = ref();
	const showMode = ref<string>("add");
	const showEdit = ref<boolean>(false);
	const popTitle = computed<string>(() => {
		return showMode.value === "edit" ? "编辑分类" : "新增分类";
	});

	// 表单数据
	const loading = ref<boolean>(false);
	const formData = reactive<any>({
		id: "", // 分类ID
		cid: "", // 类目
		image: "", // 封面
		title: "", // 标题
		price: 0, // 价格
		fee: 0, // 运费
		stock: 0, // 库存
		sales: 0, // 销量
		browse: 0, // 浏览量
		collect: 0, // 收藏量
		deliveryType: 0, // 发货方式
		intro: "", // 简介
		config: undefined, // 动态配置
		sku: undefined, // 规格
		is_topping: 0, // 分类名称
		is_recommend: 0, // 是否推荐: [0=否, 1=是]
		sort: 1000, // 分类排序
		is_show: 1, // 是否显示: [0=否, 1=是]
		use_sku_stock: 0, // 是否使用规格库存: [0=否, 1=是]
	});

	// 表单规则
	const formRules = reactive({
		title: [
			{ required: true, message: "分类名称不能为空", trigger: ["blur"] },
			{ max: 20, message: "分类名称不能大于20个字符", trigger: ["blur"] },
		],
	});

	// 字典选项
	const { optionsData } = useDictOptions<{
		cate: any[];
	}>({
		cate: {
			api: categoryApi.selects,
		},
	});

	/**
	 * 提交表单
	 */
	const handleSubmit = async (): Promise<void> => {
		await formRef.value?.validate();
		loading.value = true;
		if (showMode.value === "edit") {
			await commodityApi.edit(formData).finally(() => {
				loading.value = false;
			});
		} else {
			await commodityApi.add(formData).finally(() => {
				loading.value = false;
			});
		}

		feedback.msgSuccess("操作成功");
		emits("close");
		emits("success");
	};

	/**
	 * 打开表单
	 *
	 * @param {string} type
	 * @param {any} row
	 * @returns {Promise<void>}
	 */
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
