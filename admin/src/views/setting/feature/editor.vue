<template>
    <popup :show="showEdit" :title="popTitle" :loading="loading" :async-close="true" width="500px"
        @close="emits('close')" @confirm="handleSubmit">
        <div class="p-6 pb-0">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
                <el-form-item label="功能类型" prop="position">
                    <el-select v-model="formData.type" placeholder="请选择功能类型" clearable>
                        <el-option v-for="(item, index) in optionsData.type" :key="index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="功能标题" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入功能标题" maxlength="200" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" v-model="formData.desc" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" :min="0" :max="999999" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="formData.is_disable">
                        <el-radio :value="0">正常</el-radio>
                        <el-radio :value="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import featureApi from '@/api/setting/feature'

const emits = defineEmits(['success', 'close'])

const formRef = ref()
const showMode = ref<string>('add')
const showEdit = ref<boolean>(false)
const popTitle = computed<string>(() => {
    return showMode.value === 'edit' ? '编辑数据' : '新增数据'
})

// 表单数据
const loading = ref<boolean>(false)
const formData = reactive<any>({
    id: '',        // 管理ID
    type: '',  // 类型
    title: '',     // 功能标题
    desc: '',     // 功能描述
    icon: '',     // 功能图标
    sort: 0,       // 排序编号
    is_disable: 0, // 是否禁用:[0=否, 1=是]
})

// 表单规则
const formRules = reactive({
    type: [
        { required: true, message: '请选择功能类型', trigger: ['blur'] }
    ],
    title: [
        { required: true, message: '标题不能为空', trigger: 'blur' },
        { max: 200, message: '标题不能大于200个字符', trigger: 'blur' }
    ],
    desc: [
        { required: true, message: '描述不能为空', trigger: 'blur' },
    ]
})

// 字典选项
const { optionsData } = useDictOptions<{
    type: any[]
}>({
    type: {
        api: featureApi.sites
    }
})

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
    await formRef.value?.validate()
    loading.value = true
    if (showMode.value === 'edit') {
        await featureApi.edit(formData)
            .finally(() => {
                loading.value = false
            })
    } else {
        await featureApi.add(formData)
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

    if (type === 'edit') {
        const data = await featureApi.detail(row.id)
        for (const key in formData) {
            if (data[key] !== null && data[key] !== undefined) {
                formData[key] = data[key]
            }
        }
    }
}

defineExpose({
    open
})
</script>
