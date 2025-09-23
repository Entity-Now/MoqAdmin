
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
                        placeholder="所属软件"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in optionsData.cate"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入公告标题" maxlength="100" />
                </el-form-item>

                <el-form-item label="公告内容" prop="content">
                    <TiptapAntDesign v-if="showEdit" class="w-full h-[400px]" v-model:content="formData.content" :height="667" />
                </el-form-item>

                <el-form-item label="是否置顶显示" prop="is_pinned">
                    <el-radio-group v-model="formData.is_pinned">
                        <el-radio :value="false">否</el-radio>
                        <el-radio :value="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示" prop="is_show">
                    <el-radio-group v-model="formData.is_show">
                        <el-radio :value="false">否</el-radio>
                        <el-radio :value="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import announcementApi from '@/api/software/announcement'
import softwareApi from '@/api/software/software'
import { ref, reactive, computed } from 'vue'
import TiptapAntDesign from 'tiptap-ant-design-vue'

const emits = defineEmits(['success', 'close'])
const formRef = ref()
const showMode = ref('add')
const showEdit = ref(false)

const popTitle = computed(() => (showMode.value === 'edit' ? '编辑Announcement' : '新增Announcement'))

const loading = ref(false)

const formData = reactive<any>({
    id: null,
    software_id: "",
    title: "",
    content: "",
    is_pinned: false,
    is_show: true,
})

const formRules = reactive({
    software_id: [{ required: true, message: '所属软件 ID不能为空', trigger: ['blur'] }],
    title: [{ required: true, message: '公告标题不能为空', trigger: ['blur'] }],
    content: [{ required: true, message: '公告内容不能为空', trigger: ['blur'] }],
    is_pinned: [{ required: true, message: '是否置顶显示不能为空', trigger: ['blur'] }],
    is_show: [{ required: true, message: '是否置顶显示不能为空', trigger: ['blur'] }],
})

const { optionsData } = useDictOptions({
    cate: {
        api: softwareApi.selects || (() => Promise.resolve([]))
    }
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
        if (showMode.value === 'edit') {
            await announcementApi.edit(formData)
        } else {
            await announcementApi.add(formData)
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
