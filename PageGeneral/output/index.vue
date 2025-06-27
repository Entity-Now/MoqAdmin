<template>
    <div>
        <!-- 搜索栏 -->
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="主键" prop="id">
                        <el-input-number
                            v-model="queryParams.id"
                            class="w-[250px]"
                            placeholder="请输入主键"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="关联商品ID" prop="commodity_id">
                        <el-input-number
                            v-model="queryParams.commodity_id"
                            class="w-[250px]"
                            placeholder="请输入关联商品ID"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="卡号 / 卡密内容" prop="title">
                        <el-input
                            v-model="queryParams.title"
                            class="w-[250px]"
                            placeholder="请输入卡号 / 卡密内容"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="卡密密码（如无可留空）" prop="password">
                        <el-input
                            v-model="queryParams.password"
                            class="w-[250px]"
                            placeholder="请输入卡密密码（如无可留空）"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="是否已使用: [0=否, 1=是]" prop="is_used">
                        <el-input-number
                            v-model="queryParams.is_used"
                            class="w-[250px]"
                            placeholder="请输入是否已使用: [0=否, 1=是]"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="关联订单ID（使用后记录）" prop="order_id">
                        <el-input-number
                            v-model="queryParams.order_id"
                            class="w-[250px]"
                            placeholder="请输入关联订单ID（使用后记录）"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="使用时间（时间戳）" prop="use_time">
                        <el-input-number
                            v-model="queryParams.use_time"
                            class="w-[250px]"
                            placeholder="请输入使用时间（时间戳）"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]" prop="card_type">
                        <el-input-number
                            v-model="queryParams.card_type"
                            class="w-[250px]"
                            placeholder="请输入卡密类型: [0=唯一, 1=共享库存, 2=无限库存]"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="共享库存数量，仅在 card_type=1 时有效" prop="stock">
                        <el-input-number
                            v-model="queryParams.stock"
                            class="w-[250px]"
                            placeholder="请输入共享库存数量，仅在 card_type=1 时有效"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="是否删除" prop="is_delete">
                        <el-input-number
                            v-model="queryParams.is_delete"
                            class="w-[250px]"
                            placeholder="请输入是否删除"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                        <el-input-number
                            v-model="queryParams.create_time"
                            class="w-[250px]"
                            placeholder="请输入创建时间"
                            clearable
                            @keyup.enter="resetPaging"
                        />
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPaging">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格栏 -->
        <el-card v-loading="pager.loading" class="!border-none" shadow="never">
            <el-button type="primary" v-perms="['warehouse:card:add']" @click="handleEditor('add')">
                <template #icon>
                    <icon name="el-icon-plus" />
                </template>
                <span>新增</span>
            </el-button>
            <el-table :data="pager.lists" size="large" class="mt-4">
                <el-table-column label="关联商品ID" prop="commodity_id" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="卡号 / 卡密内容" prop="title" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="卡密密码（如无可留空）" prop="password" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="是否已使用: [0=否, 1=是]" prop="is_used" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="关联订单ID（使用后记录）" prop="order_id" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="使用时间（时间戳）" prop="use_time" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]" prop="card_type" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="共享库存数量，仅在 card_type=1 时有效" prop="stock" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="是否删除" prop="is_delete" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="创建时间" prop="create_time" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['warehouse:card:edit']" type="primary" link @click="handleEditor('edit', row)">编辑</el-button>
                        <el-button v-perms="['warehouse:card:delete']" type="danger" link @click="handleDelete(row.id)">删除</el-button>
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
import warehouse_cardApi from '@/api/warehouse:card/warehouse_card'
import Editor from './editor.vue'
import { ref, reactive, shallowRef, nextTick, onMounted } from 'vue'

const showEdit = ref(false)
const editorRef = shallowRef<InstanceType<typeof Editor>>()

const queryParams = reactive({ id: 0, commodity_id: 0, title: "", password: "", is_used: 0, order_id: 0, use_time: 0, card_type: 0, stock: 0, is_delete: 0, create_time: 0 })

const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: warehouse_cardApi.lists,
    params: queryParams
})

const handleEditor = async (type: string, row?: any): Promise<void> => {
    showEdit.value = true
    await nextTick()
    editorRef.value?.open(type, row)
}

const handleDelete = async (id: number): Promise<void> => {
    feedback.confirm('确定要删除此项数据吗?')
        .then(async () => {
            await warehouse_cardApi.delete(id)
            feedback.msgSuccess('删除成功')
            await queryLists()
        }).catch(() => {})
}

onMounted(async () => {
    await queryLists()
})
</script>
