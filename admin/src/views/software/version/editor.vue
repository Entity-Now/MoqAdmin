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
                <el-form-item label="所属软件" prop="software_id">
                    <el-select
                        v-model="formData.software_id"
                        placeholder="请选择软件"
                        class="w-full">
                        <el-option
                            v-for="item in optionsData.software"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="formData.version" placeholder="请输入版本号" maxlength="50" />
                </el-form-item>

                <el-form-item label="版本标题" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入版本标题" maxlength="255" />
                </el-form-item>

                <el-form-item label="版本描述" prop="description">
                    <TiptapAntDesign v-if="showEdit" class="w-full h-[400px]" v-model:content="formData.description" :height="667"  />
                </el-form-item>

                <el-form-item label="下载类型" prop="download_type">
                    <el-radio-group v-model="formData.download_type">
                        <el-radio :value="1">外站链接</el-radio>
                        <el-radio :value="2">本站附件</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="formData.download_type === 1" label="外站链接" prop="download_url">
                    <el-input v-model="formData.download_url" placeholder="请输入外站链接" maxlength="500" />
                </el-form-item>

                <el-form-item v-if="formData.download_type === 2" label="本站附件" prop="attach_id">
                    <material-picker
                        v-model="formData.attach_id"
                        :limit="1"
                        @change="handleAttachChange"
                    />
                    <div v-if="attachInfo" class="mt-2 text-sm text-gray-500">
                        文件名称：{{ attachInfo.file_name }}<br/>
                        文件大小：{{ formatFileSize(attachInfo.file_size) }}
                    </div>
                </el-form-item>

                <el-form-item label="是否显示" prop="is_show">
                    <el-switch v-model="formData.is_show" />
                </el-form-item>

                <el-form-item label="是否最新版本" prop="is_latest">
                    <el-switch v-model="formData.is_latest" />
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import softwareVersionApi from '@/api/software/softwareVersion'
import { ref, reactive, computed, watch } from 'vue'
import TiptapAntDesign from 'tiptap-ant-design-vue'

const emits = defineEmits(['success', 'close'])
const formRef = ref()
const showMode = ref('add')
const showEdit = ref(false)
const attachInfo = ref<any>(null)

const popTitle = computed(() => (showMode.value === 'edit' ? '编辑软件版本' : '新增软件版本'))

const loading = ref(false)

const formData = reactive<any>({
    id: 0,
    software_id: 0,
    version: "",
    title: "",
    description: "",
    download_type: 1,
    download_url: "",
    attach_id: 0,
    is_show: true,
    is_latest: false
})

const formRules = reactive({
    software_id: [{ required: true, message: '请选择所属软件', trigger: ['blur'] }],
    version: [{ required: true, message: '版本号不能为空', trigger: ['blur'] }],
    title: [{ required: true, message: '版本标题不能为空', trigger: ['blur'] }],
    download_type: [{ required: true, message: '请选择下载类型', trigger: ['change'] }],
    download_url: [
        { required: true, message: '外站链接不能为空', trigger: ['blur'] }
    ],
    attach_id: [
        { required: true, message: '请选择附件', trigger: ['change'] }
    ]
})

const { optionsData } = useDictOptions({
    software: {
        api: softwareVersionApi.selectSoftware || (() => Promise.resolve([])),
    },
});

// 监听下载类型变化，清空对应的字段
watch(() => formData.download_type, (newVal) => {
    if (newVal === 1) {
        formData.attach_id = 0
        attachInfo.value = null
    } else if (newVal === 2) {
        formData.download_url = ''
    }
})

// 处理附件选择变化
const handleAttachChange = (files: any[]) => {
    if (files && files.length > 0) {
        formData.attach_id = files[0].id
        attachInfo.value = {
            file_name: files[0].name,
            file_size: files[0].size
        }
    } else {
        formData.attach_id = 0
        attachInfo.value = null
    }
}

// 格式化文件大小
const formatFileSize = (size: number): string => {
    if (size < 1024) {
        return size + ' B'
    } else if (size < 1048576) {
        return (size / 1024).toFixed(2) + ' KB'
    } else if (size < 1073741824) {
        return (size / 1048576).toFixed(2) + ' MB'
    } else {
        return (size / 1073741824).toFixed(2) + ' GB'
    }
}

const handleSubmit = async () => {
    // 先进行基本表单验证
    try {
        await formRef.value?.validate()
    } catch (error) {
        return
    }
    
    // 根据下载类型进行动态验证
    if (formData.download_type === 1 && !formData.download_url) {
        feedback.msgError('外站链接不能为空')
        return
    }
    if (formData.download_type === 2 && !formData.attach_id) {
        feedback.msgError('请选择附件')
        return
    }
    
    loading.value = true
    try {
        if (showMode.value === 'edit') {
            await softwareVersionApi.edit(formData)
        } else {
            await softwareVersionApi.add(formData)
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
    
    // 重置表单
    formData.id = 0
    formData.software_id = 0
    formData.version = ''
    formData.title = ''
    formData.description = ''
    formData.download_type = 1
    formData.download_url = ''
    formData.attach_id = 0
    formData.is_show = true
    formData.is_latest = false
    attachInfo.value = null

    if (type === 'edit' && row) {
        // 填充表单数据
        for (const key in formData) {
            if (row[key] !== null && row[key] !== undefined) {
                formData[key] = row[key]
            }
        }
        
        // 如果是附件类型，填充附件信息
        if (row.download_type === 2 && row.attach_info) {
            attachInfo.value = {
                file_name: row.attach_info.file_name,
                file_size: row.attach_info.file_size
            }
        }
    }
}

defineExpose({
    open
})
</script>