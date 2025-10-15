<template>
    <div>
        <!-- 搜索栏 -->
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="分类名称">
                    <el-select v-model="queryParams.cid" placeholder="请选择分类名称" class="w-[250px]">
                        <el-option value="" label="全部" />
                        <el-option v-for="item in optionsData.cate" :key="item.value" :value="item.value" :label="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input
                        v-model="queryParams.title"
                        class="w-[250px]"
                        placeholder="请输入商品名称"
                        clearable
                        @keyup.enter="resetPaging"
                    />
                </el-form-item>
                
                <el-form-item label="是否显示">
                    <el-select v-model="queryParams.is_show" class="w-[250px]">
                        <el-option value="" label="全部" />
                        <el-option value="0" label="否" />
                        <el-option value="1" label="是" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-select v-model="queryParams.is_topping" class="w-[250px]">
                        <el-option value="" label="全部" />
                        <el-option value="0" label="否" />
                        <el-option value="1" label="是" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否推荐">
                    <el-select v-model="queryParams.is_recommend" class="w-[250px]">
                        <el-option value="" label="全部" />
                        <el-option value="0" label="否" />
                        <el-option value="1" label="是" />
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
            <el-button type="primary" v-perms="['shopping:shop_commodity:add']" @click="handleEditor('add')">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                <span>新增</span>
            </el-button>
            <el-table :data="pager.lists" size="large" class="mt-4">
                <el-table-column label="ID" prop="id" min-width="80" />
                <el-table-column label="商品名称" prop="title" min-width="120" show-tooltip-when-overflow />
                <el-table-column label="价格" prop="price" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="运费" prop="fee" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="库存" prop="stock" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="销量" prop="sales" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="浏览" prop="browse" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="收藏" prop="collect" min-width="60" show-tooltip-when-overflow />
                <el-table-column label="排序" prop="sort" min-width="80" />
                <el-table-column label="是否使用规格库存" prop="use_sku_stock" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.use_sku_stock == 0 || row.use_sku_stock == null">否</el-tag>
                        <el-tag v-else>是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发货方式" prop="deliveryType" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.deliveryType == 0">快递</el-tag>
                        <el-tag v-else-if="row.deliveryType == 1">自提</el-tag>
                        <el-tag v-else-if="row.deliveryType == 2">无需物流[人工发]</el-tag>
                        <el-tag v-else-if="row.deliveryType == 3">无需物流[自动发]</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="发货" prop="delivery" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.delivery == 0">未发货</el-tag>
                        <el-tag v-else-if="row.delivery == 1">已发货</el-tag>
                        <el-tag v-else-if="row.delivery == 2">发货失败</el-tag>
                        <el-tag v-else-if="row.delivery == 3">已收货</el-tag>
                        <el-tag v-else-if="row.delivery == 4">退货</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column label="是否显示" prop="is_show" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_show == 0" type="danger">否</el-tag>
                        <el-tag v-else>是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否置顶" prop="is_show" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_topping == 0" type="danger">否</el-tag>
                        <el-tag v-else>是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否推荐" prop="is_show" min-width="80">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_recommend == 0" type="danger">否</el-tag>
                        <el-tag v-else>是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time" min-width="175" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-perms="['shopping:shop_commodity:edit']"
                            type="primary"
                            link
                            @click="handleEditor('edit', row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['shopping:shop_commodity:delete']"
                            type="danger"
                            link
                            @click="handleDelete(row.id)"
                        >
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
import { useDictOptions } from '@/hooks/useOption'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import categoryApi from '@/api/shopping/category'
import commodityApi from '@/api/shopping/commodity'
import Editor from './editor.vue'

const showEdit = ref(false)
const editorRef = shallowRef<InstanceType<typeof Editor>>()

// 查询参数
const queryParams = reactive({
    cid: undefined,
    title: '',
    is_show: '',
    is_topping: '',
    is_recommend: '',
})

// 分页查询
const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: commodityApi.lists,
    params: queryParams
})

// 字典选项
const { optionsData } = useDictOptions<{
    cate: any[]
}>({
    cate: {
        api: categoryApi.selects
    }
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
            await commodityApi.delete(id)
            feedback.msgSuccess('删除成功')
            await queryLists()
        }).catch(() => {})
}

onMounted(async () => {
    await queryLists()
})
</script>
