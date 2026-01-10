<template>
	<popup
		:show="showEdit"
		:title="popTitle"
		:loading="loading"
		:async-close="true"
		width="1000px"
		@close="emits('close')"
		@confirm="handleSubmit">
		<div class="bg-gray-50/50 p-6">
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-position="top"
				class="space-y-6">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- 左侧主要信息 -->
					<div class="space-y-6">
						<!-- 基础信息卡片 -->
						<div
							class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<div
								class="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
								<div
									class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
									<icon
										name="el-icon-InfoFilled"
										size="18" />
								</div>
								<h3 class="text-lg font-bold text-gray-800">
									基础信息
								</h3>
							</div>

							<div class="grid grid-cols-2 gap-x-4">
								<el-form-item
									label="商品名称"
									prop="title"
									class="col-span-2">
									<el-input
										v-model="formData.title"
										placeholder="请输入商品名称"
										maxlength="200"
										show-word-limit />
								</el-form-item>

								<el-form-item
									label="所属分类"
									prop="cid">
									<el-select
										v-model="formData.cid"
										placeholder="请选择分类"
										class="w-full"
										clearable>
										<el-option
											v-for="(
												item, index
											) in optionsData.cate"
											:key="index"
											:label="item.label"
											:value="item.value" />
									</el-select>
								</el-form-item>

								<el-form-item
									label="商品编码"
									prop="code">
									<el-input
										v-model="formData.code"
										placeholder="建议使用自有编码"
										maxlength="50" />
								</el-form-item>

								<el-form-item
									label="发货方式"
									prop="deliveryType"
									class="col-span-2">
									<el-radio-group
										v-model="formData.deliveryType"
										class="flex flex-wrap gap-4">
										<el-radio
											:value="0"
											border
											>无需发货</el-radio
										>
										<el-radio
											:value="1"
											border
											>自动发卡</el-radio
										>
										<el-radio
											:value="2"
											border
											>人工发卡</el-radio
										>
										<el-radio
											:value="3"
											border
											>物流发货</el-radio
										>
									</el-radio-group>
								</el-form-item>
							</div>
						</div>

						<!-- 价格库存卡片 -->
						<div
							class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<div
								class="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
								<div
									class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
									<icon
										name="el-icon-Wallet"
										size="18" />
								</div>
								<h3 class="text-lg font-bold text-gray-800">
									价格与库存
								</h3>
							</div>

							<div class="grid grid-cols-2 gap-x-4">
								<el-form-item
									label="销售价格"
									prop="price">
									<el-input-number
										v-model="formData.price"
										:min="0"
										:precision="2"
										class="!w-full"
										controls-position="right" />
								</el-form-item>

								<el-form-item
									label="基础库存"
									prop="stock">
									<el-input-number
										v-model="formData.stock"
										:min="0"
										class="!w-full"
										controls-position="right" />
								</el-form-item>

								<el-form-item
									label="配送运费"
									prop="fee">
									<el-input-number
										v-model="formData.fee"
										:min="0"
										:precision="2"
										class="!w-full"
										controls-position="right" />
								</el-form-item>

								<el-form-item
									label="规格库存"
									prop="use_sku_stock">
									<el-switch
										v-model="formData.use_sku_stock"
										:active-value="1"
										:inactive-value="0"
										active-text="启用规格库存" />
								</el-form-item>
							</div>
						</div>
					</div>

					<!-- 右侧侧边栏信息 -->
					<div class="space-y-6">
						<!-- 媒体资源卡片 -->
						<div
							class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<div
								class="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
								<div
									class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
									<icon
										name="el-icon-Picture"
										size="18" />
								</div>
								<h3 class="text-lg font-bold text-gray-800">
									媒体管理
								</h3>
							</div>

							<div class="space-y-4">
								<el-form-item
									label="商品主图"
									prop="main_image">
									<material-picker
										v-model="formData.main_image"
										:limit="1" />
									<p class="mt-1 text-xs text-gray-400">
										建议尺寸 800x800，首图将作为主要展示图
									</p>
								</el-form-item>

								<el-form-item
									label="商品相册"
									prop="image">
									<div
										class="max-w-full overflow-x-auto pb-2 custom-scrollbar">
										<material-picker
											v-model="formData.image"
											:limit="5" />
									</div>
									<p class="mt-1 text-xs text-gray-400">
										最多上传 5 张图片，展示在详情页轮播图中
									</p>
								</el-form-item>
							</div>
						</div>

						<!-- 显示配置卡片 -->
						<div
							class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<div
								class="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
								<div
									class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
									<icon
										name="el-icon-Setting"
										size="18" />
								</div>
								<h3 class="text-lg font-bold text-gray-800">
									系统配置
								</h3>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<el-form-item
									label="显示状态"
									prop="is_show">
									<el-radio-group
										v-model="formData.is_show"
										class="flex gap-2">
										<el-radio-button :value="1"
											>上架</el-radio-button
										>
										<el-radio-button :value="0"
											>下架</el-radio-button
										>
									</el-radio-group>
								</el-form-item>

								<el-form-item
									label="排序权重"
									prop="sort">
									<el-input-number
										v-model="formData.sort"
										:min="0"
										:max="9999"
										class="!w-full"
										controls-position="right" />
								</el-form-item>

								<div
									class="col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
									<div class="space-y-1">
										<div
											class="text-sm font-medium text-gray-700">
											置顶与推荐
										</div>
										<div class="text-xs text-gray-500">
											增加商品曝光率和点击量
										</div>
									</div>
									<div class="flex gap-4">
										<el-checkbox
											v-model="formData.is_topping"
											:true-label="1"
											:false-label="0"
											>置顶</el-checkbox
										>
										<el-checkbox
											v-model="formData.is_recommend"
											:true-label="1"
											:false-label="0"
											>推荐</el-checkbox
										>
									</div>
								</div>
							</div>
						</div>

						<!-- 统计数据卡片 -->
						<div
							class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 italic opacity-80">
							<div class="grid grid-cols-3 gap-4">
								<div class="text-center">
									<p class="text-xs text-gray-400">总销量</p>
									<p class="text-lg font-bold text-gray-700">
										{{ formData.sales || 0 }}
									</p>
								</div>
								<div
									class="text-center border-x border-gray-100">
									<p class="text-xs text-gray-400">浏览量</p>
									<p class="text-lg font-bold text-gray-700">
										{{ formData.browse || 0 }}
									</p>
								</div>
								<div class="text-center">
									<p class="text-xs text-gray-400">收藏量</p>
									<p class="text-lg font-bold text-gray-700">
										{{ formData.collect || 0 }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 详情与规格 - 全宽展示 -->
				<div class="space-y-6 mt-6">
					<!-- 规格编辑器 -->
					<div
						class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
						<div
							class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
							@click="isSkuExpanded = !isSkuExpanded">
							<div class="flex items-center gap-2">
								<div
									class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
									<icon
										name="el-icon-Grid"
										size="18" />
								</div>
								<h3 class="text-lg font-bold text-gray-800">
									商品规格
								</h3>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-xs text-gray-400">{{
									isSkuExpanded ? "收起" : "展开配置"
								}}</span>
								<icon
									:name="
										isSkuExpanded
											? 'el-icon-ArrowUp'
											: 'el-icon-ArrowDown'
									"
									size="16"
									class="text-gray-400" />
							</div>
						</div>
						<div
							v-show="isSkuExpanded"
							class="p-6 pt-0 border-t border-gray-50 mt-4">
							<SKUEditor
								v-if="showEdit"
								v-model="formData.sku" />
						</div>
					</div>

					<!-- 富文本详情 -->
					<div
						class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<div
							class="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
							<div
								class="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
								<icon
									name="el-icon-Document"
									size="18" />
							</div>
							<h3 class="text-lg font-bold text-gray-800">
								详细介绍
							</h3>
						</div>
						<TiptapAntDesign
							v-if="showEdit"
							class="w-full !border border-solid border-gray-100 rounded-xl overflow-hidden shadow-inner"
							v-model:content="formData.intro"
							:height="500" />
					</div>
				</div>
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
	const isSkuExpanded = ref<boolean>(false);
	const popTitle = computed<string>(() => {
		return showMode.value === "edit" ? "编辑商品" : "新增商品";
	});

	// 表单数据
	const loading = ref<boolean>(false);
	const formData = reactive<any>({
		id: "", // 分类ID
		cid: "", // 类目
		code: "", // 商品编码
		main_image: "", // 封面
		image: [], // 封面
		title: "", // 标题
		price: 0, // 价格
		fee: 0, // 运费
		stock: 0, // 库存
		sales: 0, // 销量
		browse: 0, // 浏览量
		collect: 0, // 收藏量
		deliveryType: 0, // 发货方式
		intro: "", // 简介
		config: {}, // 动态配置
		sku: {}, // 规格
		is_topping: 0, // 分类名称
		is_recommend: 0, // 是否推荐: [0=否, 1=是]
		sort: 1000, // 分类排序
		is_show: 1, // 是否显示: [0=否, 1=是]
		use_sku_stock: 0, // 是否使用规格库存: [0=否, 1=是]
	});

	// 表单规则
	const formRules = reactive({
		title: [
			{ required: true, message: "商品名称不能为空", trigger: ["blur"] },
			{
				max: 200,
				message: "商品名称不能大于200个字符",
				trigger: ["blur"],
			},
		],
		cid: [
			{ required: true, message: "请选择所属分类", trigger: ["change"] },
		],
		main_image: [
			{ required: true, message: "请上传商品封面", trigger: ["change"] },
		],
		price: [
			{ required: true, message: "请输入商品价格", trigger: ["blur"] },
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
			// 确保图片是数组
			if (typeof formData.image === "string") {
				formData.image = formData.image
					? formData.image.split(",")
					: [];
			}
			// 确保规格是对象
			if (!formData.sku || typeof formData.sku !== "object") {
				formData.sku = {};
			}
		} else {
			// 重置为初始值
			formData.id = "";
			formData.cid = "";
			formData.code = "";
			formData.main_image = "";
			formData.image = [];
			formData.title = "";
			formData.price = 0;
			formData.fee = 0;
			formData.stock = 0;
			formData.sku = {};
			// ... 其他字段可以根据需要重置
		}
	};

	defineExpose({
		open,
	});
</script>

<style scoped>
	.custom-scrollbar::-webkit-scrollbar {
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #cbd5e1;
	}
</style>
