
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

                <el-form-item label="软件名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入软件名称" maxlength="100" />
                </el-form-item>

                <el-form-item label="软件唯一标识，例如 com.example.app" prop="identifier">
                    <el-input v-model="formData.identifier" placeholder="请输入软件唯一标识，例如 com.example.app" maxlength="100" />
                </el-form-item>

                <el-form-item label="软件图标 URL" prop="icon_url">
                    <el-input v-model="formData.icon_url" placeholder="请输入软件图标 URL" maxlength="100" />
                </el-form-item>

                <el-form-item label="软件简要介绍" prop="description">
                    <el-input v-model="formData.description" placeholder="请输入软件简要介绍" maxlength="100" />
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
import softwareApi from '@/api/software/software'
import { ref, reactive, computed } from 'vue'

const emits = defineEmits(['success', 'close'])
const formRef = ref()
const showMode = ref('add')
const showEdit = ref(false)

const popTitle = computed(() => (showMode.value === 'edit' ? '编辑Software' : '新增Software'))

const loading = ref(false)

const formData = reactive<any>({
    id: 0,
    name: "",
    identifier: "",
    icon_url: "",
    description: "",
    is_show: 0,
})

const formRules = reactive({
    id: [{ required: true, message: '主键 ID不能为空', trigger: ['blur'] }],
    name: [{ required: true, message: '软件名称不能为空', trigger: ['blur'] }],
    identifier: [{ required: true, message: '软件唯一标识，例如 com.example.app不能为空', trigger: ['blur'] }],
    is_show: [{ required: true, message: '是否启用不能为空', trigger: ['blur'] }]
})


const handleSubmit = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
        if (showMode.value === 'edit') {
            await softwareApi.edit(formData)
        } else {
            await softwareApi.add(formData)
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
