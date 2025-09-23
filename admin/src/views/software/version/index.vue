<template>
	<div>
		<!-- 搜索栏 -->
		<el-card
			class="!border-none mb-4"
			shadow="never">
			<el-form
				class="mb-[-16px]"
				:model="queryParams"
				:inline="true">
				<el-form-item label="所属软件">
					<el-select
						v-model="queryParams.software_id"
						placeholder="请选择软件"
						class="w-[250px]">
						<el-option
							value=""
							label="全部" />
						<el-option
							v-for="item in optionsData.software"
							:key="item.value"
							:value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="版本号">
					<el-input
						v-model="queryParams.version"
						class="w-[250px]"
						placeholder="请输入版本号"
						clearable
						@keyup.enter="resetPaging" />
				</el-form-item>
				<el-form-item label="是否显示">
					<el-select
						v-model="queryParams.is_show"
						class="w-[250px]">
						<el-option
							value=""
							label="全部" />
						<el-option
							value="0"
							label="否" />
						<el-option
							value="1"
							label="是" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="resetPaging"
						>查询</el-button
					>
					<el-button @click="resetParams">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 表格栏 -->
		<el-card
			v-loading="pager.loading"
			class="!border-none"
			shadow="never">
			<el-button
				type="primary"
				v-perms="['software_version:add']"
				@click="handleEditor('add')">
				<template #icon>
					<icon name="el-icon-plus" />
				</template>
				<span>新增</span>
			</el-button>
			<el-table
				:data="pager.lists"
				size="large"
				class="mt-4">
				<el-table-column
					label="所属软件"
					prop="software_name"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="版本号"
					prop="version"
					min-width="100"
					show-tooltip-when-overflow />
				<el-table-column
					label="版本标题"
					prop="title"
					min-width="150"
					show-tooltip-when-overflow />
				<el-table-column
					label="下载类型"
					prop="download_type"
					width="100">
					<template #default="{ row }">
						<span v-if="row.download_type === 1">外站链接</span>
						<span v-else-if="row.download_type === 2">本站附件</span>
						<span v-else>未知</span>
					</template>
				</el-table-column>
				<el-table-column
					label="是否最新"
					prop="is_latest"
					width="100">
					<template #default="{ row }">
						<el-switch
							v-model="row.is_latest"
							@change="handleLatestChange(row)"
							active-color="#10b981"
							inactive-color="#f3f4f6" />
					</template>
				</el-table-column>
				<el-table-column
					label="是否显示"
					prop="is_show"
					width="100">
					<template #default="{ row }">
						<el-switch
							v-model="row.is_show"
							@change="handleShowChange(row)"
							active-color="#10b981"
							inactive-color="#f3f4f6" />
					</template>
				</el-table-column>
				<el-table-column
					label="创建时间"
					prop="create_time"
					width="180" />
				<el-table-column
					label="操作"
					width="120"
					fixed="right">
					<template #default="{ row }">
						<el-button
							v-perms="['software_version:edit']"
							type="primary"
							link
							@click="handleEditor('edit', row)"
							>编辑</el-button
						>
						<el-button
							v-perms="['software_version:delete']"
							type="danger"
							link
							@click="handleDelete(row.id)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<div class="flex justify-end mt-4">
				<paging
					v-model="pager"
					@change="queryLists" />
			</div>
		</el-card>

		<!-- 编辑器 -->
		<editor
			v-if="showEdit"
			ref="editorRef"
			@success="queryLists"
			@close="showEdit = false" />
	</div>
</template>

<script setup lang="ts">
	import { useDictOptions } from "@/hooks/useOption";
	import { usePaging } from "@/hooks/usePaging";
	import feedback from "@/utils/feedback";
	import softwareVersionApi from "@/api/software/softwareVersion";
	import Editor from "./editor.vue";
	import { ref, reactive, shallowRef, nextTick, onMounted } from "vue";

	const showEdit = ref(false);
	const editorRef = shallowRef<InstanceType<typeof Editor>>();

	const queryParams = reactive({ software_id: "", version: "", is_show: "" });

	const { pager, queryLists, resetParams, resetPaging } = usePaging({
		fetchFun: softwareVersionApi.lists,
		params: queryParams,
	});

	const { optionsData } = useDictOptions({
		software: {
			api: softwareVersionApi.selectSoftware || (() => Promise.resolve([])),
		},
	});

	const handleEditor = async (type: string, row?: any): Promise<void> => {
		showEdit.value = true;
		await nextTick();
		editorRef.value?.open(type, row);
	};

	const handleDelete = async (id: number): Promise<void> => {
		feedback
			.confirm("确定要删除此项数据吗?")
			.then(async () => {
				await softwareVersionApi.delete(id);
				feedback.msgSuccess("删除成功");
				await queryLists();
			})
			.catch(() => {});
	};

	const handleShowChange = async (row: any): Promise<void> => {
		try {
			await softwareVersionApi.edit({
				...row,
				is_show: row.is_show
			});
			feedback.msgSuccess("更新成功");
		} catch (error) {
			// 回滚状态
			row.is_show = !row.is_show;
			feedback.msgError("更新失败");
		}
	};

	const handleLatestChange = async (row: any): Promise<void> => {
		try {
			await softwareVersionApi.edit({
				...row,
				is_latest: row.is_latest
			});
			feedback.msgSuccess("更新成功");
			// 如果设置为最新版本，需要刷新列表以更新其他版本的状态
			if (row.is_latest) {
				await queryLists();
			}
		} catch (error) {
			// 回滚状态
			row.is_latest = !row.is_latest;
			feedback.msgError("更新失败");
		}
	};

	onMounted(async () => {
		await queryLists();
	});
</script>