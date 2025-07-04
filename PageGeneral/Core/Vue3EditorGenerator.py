from string import Template
from .CodeGenerator import CodeGenerator
from .MTable import Table, Property

class Vue3EditorGenerator(CodeGenerator):
    TEMPLATE = Template('''
<template>
    <popup
        :show="showEdit"
        :title="popTitle"
        :loading="loading"
        :async-close="true"
        width="100%"
        @close="emits('close')"
        @confirm="handleSubmit"
    >
        <div class="p-6 pb-0 relative">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
$form_items
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import ${model_name_lower}Api from '@/api/${permission}/${model_name_lower}'
import { ref, reactive, computed } from 'vue'

const emits = defineEmits(['success', 'close'])
const formRef = ref()
const showMode = ref('add')
const showEdit = ref(false)

const popTitle = computed(() => (showMode.value === 'edit' ? '编辑${tag}' : '新增${tag}'))

const loading = ref(false)

const formData = reactive<any>({
$form_data
})

const formRules = reactive({
$form_rules
})

const { optionsData } = useDictOptions({
    cate: {
        api: ${model_name_lower}Api.selects || (() => Promise.resolve([]))
    }
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
        if (showMode.value === 'edit') {
            await ${model_name_lower}Api.edit(formData)
        } else {
            await ${model_name_lower}Api.add(formData)
        }
        feedback.msgSuccess('操作成功')
        emits('close')
        emits('success')
    } finally {
        loading.value = false
    }
}

const open = async (type: string, row?: any): Promise<void> => {
    showMode.value = type
    showEdit.value = true

    if (type === 'edit') {
        for (const key in formData) {
            if (row[key] !== null && row[key] !== undefined) {
                formData[key] = row[key]
            }
        }
    }
}

defineExpose({
    open
})
</script>
''')

    def map_field_to_formitem(self, prop: Property) -> str:
        label = prop.describe or prop.title
        name = prop.title

        if name in ('cid', 'category_id'):
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <el-select v-model="formData.{name}" placeholder="请选择{label}" clearable>
                        <el-option v-for="(item, index) in optionsData.cate" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            '''.rstrip()

        elif prop.type == int and name.startswith('is_'):
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <el-radio-group v-model="formData.{name}">
                        <el-radio :value="1">是</el-radio>
                        <el-radio :value="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            '''.rstrip()

        elif prop.type in (int, float):
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <el-input-number v-model="formData.{name}" :min="0" :max="999999" />
                </el-form-item>
            '''.rstrip()

        elif name == 'content':
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <TiptapAntDesign v-if="showEdit" class="w-full h-[400px]" v-model:content="formData.{name}" :height="667" />
                </el-form-item>
            '''.rstrip()

        elif name == 'image':
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <material-picker v-model="formData.{name}" :limit="1" />
                </el-form-item>
            '''.rstrip()

        else:
            return f'''
                <el-form-item label="{label}" prop="{name}">
                    <el-input v-model="formData.{name}" placeholder="请输入{label}" maxlength="100" />
                </el-form-item>
            '''.rstrip()

    def generate_form_items(self, properties: list[Property]) -> str:
        return '\n'.join(self.map_field_to_formitem(p) for p in properties)

    def generate_form_data(self, properties: list[Property]) -> str:
        lines = []
        for p in properties:
            default_val = '""' if p.type == str else '0'
            lines.append(f'    {p.title}: {default_val},')
        return '\n'.join(lines)

    def generate_form_rules(self, properties: list[Property]) -> str:
        lines = []
        for p in properties:
            if not p.nullable:
                lines.append(f'''    {p.title}: [{{ required: true, message: '{p.describe or p.title}不能为空', trigger: ['blur'] }}],''')
        return '\n'.join(lines)

    def generate(self, table: Table) -> str:
        model_name_lower = table.tableName.lower()
        permission = table.apiPrefix
        tag = table.tableName.replace('_', ' ').title()

        form_items = self.generate_form_items(table.properties)
        form_data = self.generate_form_data(table.properties)
        form_rules = self.generate_form_rules(table.properties)

        return self.TEMPLATE.substitute(
            model_name_lower=model_name_lower,
            permission=permission,
            tag=tag,
            form_items=form_items,
            form_data=form_data,
            form_rules=form_rules,
        )

    def get_filename(self, table: Table) -> str:
        return "editor.vue"
    
    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        return f'admin/src/views/{table.category.lower()}/{table.tableName.lower()}'
