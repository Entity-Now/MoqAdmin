from string import Template
from .CodeGenerator import CodeGenerator
from .MTable import Table, Property


class Vue3IndexGenerator(CodeGenerator):
    TEMPLATE = Template('''<template>
    <div>
        <!-- 搜索栏 -->
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="分类名称">
                    <el-input
                        v-model="queryParams.title"
                        class="w-[250px]"
                        placeholder="请输入分类名称"
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
                <el-form-item>
                    <el-button type="primary" @click="resetPaging">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格栏 -->
        <el-card v-loading="pager.loading" class="!border-none" shadow="never">
            <el-button type="primary" v-perms="['${permission}:add']" @click="handleEditor('add')">
                <template #icon>
                    <icon name="el-icon-plus" />
                </template>
                <span>新增</span>
            </el-button>
            <el-table :data="pager.lists" size="large" class="mt-4">
${table_columns}
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['${permission}:edit']" type="primary" link @click="handleEditor('edit', row)">编辑</el-button>
                        <el-button v-perms="['${permission}:delete']" type="danger" link @click="handleDelete(row.id)">删除</el-button>
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
import ${model_name_lower}Api from '@/api/${category}/${model_name_lower}'
import Editor from './editor.vue'
import { ref, reactive, shallowRef, nextTick, onMounted } from 'vue'

const showEdit = ref(false)
const editorRef = shallowRef<InstanceType<typeof Editor>>()

const queryParams = reactive({ ${search_props} })

const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: ${model_name_lower}Api.lists,
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
            await ${model_name_lower}Api.delete(id)
            feedback.msgSuccess('删除成功')
            await queryLists()
        }).catch(() => {})
}

onMounted(async () => {
    await queryLists()
})
</script>
''')

    def generate_table_columns(self, properties: list[Property]) -> str:
        lines = []
        for prop in properties:
            if prop.title == "id":
                continue  # 通常不显示主键
            lines.append(
                f'''                <el-table-column label="{prop.describe}" prop="{prop.title}" min-width="120" show-tooltip-when-overflow />''')
        return "\n".join(lines)

    def generate_search_props(self, properties: list[Property]) -> str:
        props = []
        for prop in properties:
            if prop.type == str:
                props.append(f'{prop.title}: ""')
            elif prop.type == int:
                props.append(f'{prop.title}: 0')
            # 可根据需求添加更多类型支持
        return ", ".join(props)

    def generate(self, table: Table) -> str:
        model_name = ''.join(word.capitalize() for word in table.tableName.split('_'))
        model_name_lower = table.tableName.lower()
        permission = model_name_lower
        apiPrefix = table.apiPrefix
        category = table.category

        return self.TEMPLATE.substitute(
            model_name=model_name,
            model_name_lower=model_name_lower,
            permission=permission,
            apiPrefix=apiPrefix,
            table_columns=self.generate_table_columns(table.properties),
            search_props=self.generate_search_props(table.properties),
            category=category
        )

    def get_filename(self, table: Table) -> str:
        return "index.vue"
    
    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        return f'admin/src/views/{table.category.lower()}/{table.tableName.lower()}'