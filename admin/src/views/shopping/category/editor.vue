<template>
    <popup
        :show="showEdit"
        :title="popTitle"
        :loading="loading"
        :async-close="true"
        width="600px"
        @close="emits('close')"
        @confirm="handleSubmit"
    >
        <div class="p-6 pb-0">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formData.title" maxlength="20" />
                </el-form-item>
                <el-form-item label="分类级别" prop="level">
                    <el-radio-group v-model="formData.level">
                        <el-radio :value="0">一级分类</el-radio>
                        <el-radio :value="1">二级分类</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="formData.level === 1" label="父级分类" prop="parent_id">
                    <el-select
                        v-model="formData.parent_id"
                        placeholder="请选择父级分类"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in optionsData.parent"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="分类图片" prop="image">
                    <material-picker
                        v-model="formData.image"
                        :limit="1"
                    />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" :min="0" :max="9999" />
                </el-form-item>
                <el-form-item label="是否显示" prop="is_show">
                    <el-radio-group v-model="formData.is_show">
                        <el-radio :value="0">否</el-radio>
                        <el-radio :value="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import categoryCateApi from '@/api/shopping/category'

const emits = defineEmits(['success', 'close'])

const formRef = ref()
const showMode = ref<string>('add')
const showEdit = ref<boolean>(false)
const popTitle = computed<string>(() => {
    return showMode.value === 'edit' ? '编辑分类' : '新增分类'
})

// 字典选项
const { optionsData } = useDictOptions<{
    parent: any[]
}>({
    parent: {
        api: () => categoryCateApi.selectsByLevel(0)
    }
})

// 表单数据
const loading = ref<boolean>(false)
const formData = reactive<any>({
    id: '',       // 分类ID
    title: '',     // 分类名称
    parent_id: 0,  // 父级分类ID
    level: 0,      // 分类等级
    image: '',     // 分类图片
    sort: 0,       // 分类排序
    is_show: 1     // 是否显示: [0=否, 1=是]
})

// 监听分类级别变化
watch(() => formData.level, (newLevel) => {
    // 当切换到一级分类时，清空父级分类
    if (newLevel === 0) {
        formData.parent_id = 0
    }
})

// 表单规则
const formRules = reactive({
    title: [
        { required: true, message: '分类名称不能为空', trigger: ['blur'] },
        { max: 20, message: '分类名称不能大于20个字符', trigger: ['blur'] }
    ],
    parent_id: [
        { required: formData.level === 1, message: '请选择父级分类', trigger: ['blur'] }
    ]
})

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
    await formRef.value?.validate()
    loading.value = true
    if (showMode.value === 'edit') {
        await categoryCateApi.edit(formData)
            .finally(() => {
                loading.value = false
            })
    } else {
        await categoryCateApi.add(formData)
            .finally(() => {
                loading.value = false
            })
    }

    feedback.msgSuccess('操作成功')
    emits('close')
    emits('success')
}

/**
 * 打开表单
 *
 * @param {string} type
 * @param {any} row
 * @returns {Promise<void>}
 */
const open = async (type: string, row?: any): Promise<void> => {
    showMode.value = type
    showEdit.value = true

    // 重置表单数据
    formData.id = ''
    formData.title = ''
    formData.parent_id = 0
    formData.level = 0
    formData.image = ''
    formData.sort = 0
    formData.is_show = 0

    if (type === 'edit' && row) {
        // 填充编辑数据
        for (const key in row) {
            if (key in formData) {
                formData[key] = row[key]
            }
        }
    }
}

defineExpose({
    open
})
</script>
