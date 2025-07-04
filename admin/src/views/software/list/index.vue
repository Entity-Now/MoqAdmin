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
				<el-form-item
					label="软件名称"
					prop="name">
					<el-input
						v-model="queryParams.name"
						class="w-[250px]"
						placeholder="请输入软件名称"
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
				v-perms="['software:add']"
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
					label="软件名称"
					prop="name"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="软件唯一标识，例如 com.example.app"
					prop="identifier"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="软件图标 URL"
					prop="icon_url"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="软件简要介绍"
					prop="description"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="是否显示"
					prop="is_show"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="创建时间"
					prop="created_at"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="更新时间"
					prop="updated_at"
					min-width="120"
					show-tooltip-when-overflow />
				<el-table-column
					label="操作"
					width="120"
					fixed="right">
					<template #default="{ row }">
						<el-button
							v-perms="['software:edit']"
							type="primary"
							link
							@click="handleEditor('edit', row)"
							>编辑</el-button
						>
						<el-button
							v-perms="['software:delete']"
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
	import { usePaging } from "@/hooks/usePaging";
	import feedback from "@/utils/feedback";
	import softwareApi from "@/api/software/software";
	import Editor from "./editor.vue";
	import { ref, reactive, shallowRef, nextTick, onMounted } from "vue";

	const showEdit = ref(false);
	const editorRef = shallowRef<InstanceType<typeof Editor>>();

	const queryParams = reactive({
		name: "",
        is_show: "",
	});

	const { pager, queryLists, resetParams, resetPaging } = usePaging({
		fetchFun: softwareApi.lists,
		params: queryParams,
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
				await softwareApi.delete(id);
				feedback.msgSuccess("删除成功");
				await queryLists();
			})
			.catch(() => {});
	};

	onMounted(async () => {
		await queryLists();
	});
</script>
