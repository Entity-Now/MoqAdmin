<template>
    <div>
        <!-- 搜索栏 -->
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="queryParams.title" class="w-[250px]" placeholder="请输入标题" clearable
                        @keyup.enter="resetPaging" />
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="queryParams.is_disable" class="w-[250px]" placeholder="请选择">
                        <el-option :value="0" label="启用" />
                        <el-option :value="1" label="禁用" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPaging">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格栏 -->
        <el-card v-loading="pager.loading" class="!border-none" shadow="never">
            <el-button type="primary" v-perms="['setting:feature:add']" @click="handleEditor('add')">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                <span>新增</span>
            </el-button>
            <el-table :data="pager.lists" size="large" class="mt-4">
                <el-table-column label="ID" prop="id" min-width="60" />
                <el-table-column label="图标" prop="icon" min-width="30">
                    <template #default="{ row }">
                        <icon :name="row.icon"/>
                    </template>
                </el-table-column>
                <el-table-column label="标题" prop="title" min-width="140" show-tooltip-when-overflow />
                <el-table-column label="功能描述" prop="desc" min-width="200" />
                <el-table-column label="排序编号" prop="sort" min-width="80" />
                <el-table-column label="是否禁用" prop="is_disable" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_disable === 1">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time" min-width="175" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['setting:feature:edit']" type="primary" link
                            @click="handleEditor('edit', row)">
                            编辑
                        </el-button>
                        <el-button v-perms="['setting:feature:delete']" type="danger" link
                            @click="handleDelete(row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <paging v-model="pager" @change="queryLists" />
            </div>
        </el-card>

        <!-- 编辑器 -->
        <editor v-if="showEdit" ref="editorRef" @success="queryLists" @close="showEdit = false" />
    </div>
</template>

<script setup lang="ts">
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import featureApi from '@/api/setting/feature'
import Editor from './editor.vue'
import Icon from '@/components/Icon/index.vue'

const showEdit = ref(false)
const editorRef = shallowRef<InstanceType<typeof Editor>>()

// 查询参数
const queryParams = reactive({
    title: '',
    is_disable: 0
})

// 分页查询
const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: featureApi.lists,
    params: queryParams
})

/**
 * 处理编辑
 *
 * @param {string} type
 * @param {any} row
 * @returns {Promise<void>}
 */
const handleEditor = async (type: string, row?: any): Promise<void> => {
    showEdit.value = true
    await nextTick()
    editorRef.value?.open(type, row)
}

/**
 * 处理删除
 *
 * @param {number} id
 * @returns {Promise<void>}
 */
const handleDelete = async (id: number): Promise<void> => {
    feedback.confirm('确定要删除此项数据吗?')
        .then(async () => {
            await featureApi.delete(id)
            feedback.msgSuccess('删除成功')
            await queryLists()
        }).catch(() => { })
}

onMounted(async () => {
    await queryLists()
})
</script>
