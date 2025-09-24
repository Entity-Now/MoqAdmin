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
                    label="模型名称"
                    prop="keyword">
                    <el-input
                        v-model="queryParams.keyword"
                        class="w-[250px]"
                        placeholder="请输入模型名称或平台"
                        clearable
                        @keyup.enter="resetPaging" />
                </el-form-item>
                <el-form-item label="所属平台" prop="platform">
                    <el-input
                        v-model="queryParams.platform"
                        class="w-[250px]"
                        placeholder="请输入所属平台"
                        clearable />
                </el-form-item>
                <el-form-item label="是否启用" prop="is_active">
                    <el-select
                        v-model="queryParams.is_active"
                        class="w-[120px]">
                        <el-option
                            value=""
                            label="全部" />
                        <el-option
                            :value="1"
                            label="是" />
                        <el-option
                            :value="0"
                            label="否" />
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
                    label="模型名称"
                    prop="model_name"
                    min-width="200"
                    show-tooltip-when-overflow />
                <el-table-column
                    label="所属平台"
                    prop="platform"
                    min-width="150"
                    show-tooltip-when-overflow />
                <el-table-column
                    label="最大令牌数"
                    prop="max_tokens"
                    min-width="100" />
                <el-table-column
                    label="创造性"
                    prop="temperature"
                    min-width="100" />
                <el-table-column
                    label="是否启用"
                    prop="is_active">
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.is_active"
                            :active-value="true"
                            :inactive-value="false"
                            @change="handleStatusChange(row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="created_at"
                    min-width="170"
                    show-tooltip-when-overflow />
                <el-table-column
                    label="更新时间"
                    prop="updated_at"
                    min-width="170"
                    show-tooltip-when-overflow />
                <el-table-column
                    label="操作"
                    width="120"
                    fixed="right">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            link
                            @click="handleEditor('edit', row)"
                            >编辑</el-button
                        >
                        <el-button
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
        <Editor
            v-if="showEdit"
            ref="editorRef"
            @success="queryLists"
            @close="showEdit = false" />
    </div>
</template>

<script setup lang="ts">
import { usePaging } from '@/hooks/usePaging';
import feedback from '@/utils/feedback';
import aiModelConfigApi from '@/api/ai/ai-model-config';
import Editor from './editor.vue';
import { ref, reactive, shallowRef, nextTick, onMounted } from 'vue';

const showEdit = ref(false);
const editorRef = ref();

const queryParams = reactive({
    keyword: '',
    platform: '',
    is_active: ''
});

const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: async (params: any) => {
        const res = await aiModelConfigApi.lists(params);
        return res.code === 0 ? {
            data: res.data.data,
            total: res.data.total,
            per_page: res.data.per_page
        } : [];
    },
    params: queryParams,
    firstLoading: true
});

const handleEditor = async (type: string, row?: any): Promise<void> => {
    showEdit.value = true;
    await nextTick();
    editorRef.value?.open(type, row);
};

const handleDelete = async (id: number): Promise<void> => {
    feedback
        .confirm('确定要删除此项数据吗?')
        .then(async () => {
            const res = await aiModelConfigApi.delete(id);
            if (res.code === 0) {
                feedback.msgSuccess('删除成功');
                await queryLists();
            } else {
                feedback.msgError(res.msg);
            }
        })
        .catch(() => {});
};

// 状态切换
const handleStatusChange = async (row: any) => {
    try {
        const res = await aiModelConfigApi.changeStatus({
            id: row.id,
            is_active: row.is_active
        });
        if (res.code !== 0) {
            row.is_active = !row.is_active;
            feedback.msgError(res.msg);
        }
    } catch (error) {
        row.is_active = !row.is_active;
        feedback.msgError('状态切换失败');
    }
};

onMounted(async () => {
    await queryLists();
});
</script>

<style scoped>
</style>