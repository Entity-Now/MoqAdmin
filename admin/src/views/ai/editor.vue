<template>
    <popup
        :show="showEdit"
        :title="popTitle"
        :loading="loading"
        :async-close="true"
        class="max-w-[800px] w-[90vw]"
        @close="emits('close')"
        @confirm="handleSubmit"
    >
        <div class="p-6 pb-0">
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item
                            label="模型名称"
                            prop="model_name">
                            <el-input
                                v-model="formData.model_name"
                                placeholder="请输入模型名称"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="所属平台"
                            prop="platform">
                            <el-input
                                v-model="formData.platform"
                                placeholder="请输入所属平台"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item
                            label="API地址"
                            prop="api_base_url">
                            <el-input
                                v-model="formData.api_base_url"
                                placeholder="请输入API地址"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item
                            label="API密钥"
                            prop="api_key">
                            <el-input
                                v-model="formData.api_key"
                                placeholder="请输入API密钥"
                                type="password"
                                show-password />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="组织ID"
                            prop="organization">
                            <el-input
                                v-model="formData.organization"
                                placeholder="请输入组织ID（选填）"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item
                            label="最大令牌数"
                            prop="max_tokens">
                            <el-input-number
                                v-model="formData.max_tokens"
                                :min="1"
                                :max="10000"
                                placeholder="请输入最大令牌数" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="创造性"
                            prop="temperature">
                            <el-input-number
                                v-model="formData.temperature"
                                :min="0"
                                :max="2"
                                :step="0.1"
                                placeholder="请输入创造性值" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item
                            label="系统提示词"
                            prop="system_prompt">
                            <el-input
                                v-model="formData.system_prompt"
                                type="textarea"
                                :rows="4"
                                placeholder="请输入系统提示词（选填）" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item
                            label="是否启用"
                            prop="is_active">
                            <el-switch
                                v-model="formData.is_active"
                                :active-value="true"
                                :inactive-value="false" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="排序"
                            prop="sort_order">
                            <el-input-number
                                v-model="formData.sort_order"
                                :min="0"
                                :max="999"
                                placeholder="请输入排序值" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item
                            label="备注"
                            prop="remark">
                            <el-input
                                v-model="formData.remark"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入备注信息（选填）" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import aiModelConfigApi from '@/api/ai/ai-model-config';
import feedback from '@/utils/feedback';

const emits = defineEmits(['success', 'close'])

interface FormDataType {
    id?: number;
    model_name: string;
    platform: string;
    api_base_url: string;
    api_key: string;
    organization: string;
    max_tokens: number;
    temperature: number;
    system_prompt: string;
    is_active: boolean;
    sort_order: number;
    remark: string;
}

const formRef = ref()
const showMode = ref<string>('add')
const showEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const popTitle = computed<string>(() => {
    return showMode.value === 'edit' ? '编辑AI模型配置' : '新增AI模型配置'
})

// 表单数据
const formData = reactive<FormDataType>({
    model_name: '',
    platform: '',
    api_base_url: '',
    api_key: '',
    organization: '',
    max_tokens: 2048,
    temperature: 0.7,
    system_prompt: '',
    is_active: true,
    sort_order: 0,
    remark: ''
})

// 表单规则
const formRules = reactive({
    model_name: [
        { required: true, message: '请输入模型名称', trigger: 'blur' },
        { max: 50, message: '模型名称不能超过50个字符', trigger: 'blur' }
    ],
    platform: [
        { required: true, message: '请输入所属平台', trigger: 'blur' },
        { max: 50, message: '所属平台不能超过50个字符', trigger: 'blur' }
    ],
    api_base_url: [
        { required: true, message: '请输入API地址', trigger: 'blur' },
        { max: 255, message: 'API地址不能超过255个字符', trigger: 'blur' }
    ],
    api_key: [
        { required: true, message: '请输入API密钥', trigger: 'blur' },
        { max: 255, message: 'API密钥不能超过255个字符', trigger: 'blur' }
    ],
    max_tokens: [
        { required: true, message: '请输入最大令牌数', trigger: 'blur' },
        { type: 'number', min: 1, max: 10000, message: '最大令牌数必须在1-10000之间', trigger: 'blur' }
    ],
    temperature: [
        { required: true, message: '请输入创造性值', trigger: 'blur' },
        { type: 'number', min: 0, max: 2, message: '创造性值必须在0-2之间', trigger: 'blur' }
    ],
    sort_order: [
        { required: true, message: '请输入排序值', trigger: 'blur' },
        { type: 'number', min: 0, max: 999, message: '排序值必须在0-999之间', trigger: 'blur' }
    ]
})

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
    await formRef.value?.validate()
    loading.value = true
    if (showMode.value === 'edit') {
        await aiModelConfigApi.update(formData)
            .finally(() => {
                loading.value = false
            })
    } else {
        await aiModelConfigApi.create(formData)
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
    Object.assign(formData, {
        model_name: '',
        platform: '',
        api_base_url: '',
        api_key: '',
        organization: '',
        max_tokens: 2048,
        temperature: 0.7,
        system_prompt: '',
        is_active: true,
        sort_order: 0,
        remark: ''
    })

    if (type === 'edit' && row) {
        // 复制数据到表单
        const data = await aiModelConfigApi.detail(row.id)
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

<style scoped>
:deep(.el-input__wrapper) {
    box-shadow: none !important;
}
</style>