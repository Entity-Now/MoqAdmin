
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

                <el-form-item label="主键" prop="id">
                    <el-input-number v-model="formData.id" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="关联商品ID" prop="commodity_id">
                    <el-input-number v-model="formData.commodity_id" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="卡号 / 卡密内容" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入卡号 / 卡密内容" maxlength="100" />
                </el-form-item>

                <el-form-item label="卡密密码（如无可留空）" prop="password">
                    <el-input v-model="formData.password" placeholder="请输入卡密密码（如无可留空）" maxlength="100" />
                </el-form-item>

                <el-form-item label="是否已使用: [0=否, 1=是]" prop="is_used">
                    <el-radio-group v-model="formData.is_used">
                        <el-radio :value="1">是</el-radio>
                        <el-radio :value="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="关联订单ID（使用后记录）" prop="order_id">
                    <el-input-number v-model="formData.order_id" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="使用时间（时间戳）" prop="use_time">
                    <el-input-number v-model="formData.use_time" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]" prop="card_type">
                    <el-input-number v-model="formData.card_type" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="共享库存数量，仅在 card_type=1 时有效" prop="stock">
                    <el-input-number v-model="formData.stock" :min="0" :max="999999" />
                </el-form-item>

                <el-form-item label="是否删除" prop="is_delete">
                    <el-radio-group v-model="formData.is_delete">
                        <el-radio :value="1">是</el-radio>
                        <el-radio :value="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="创建时间" prop="create_time">
                    <el-input-number v-model="formData.create_time" :min="0" :max="999999" />
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { useDictOptions } from '@/hooks/useOption'
import feedback from '@/utils/feedback'
import warehouse_cardApi from '@/api/warehouse:card/warehouse_card'
import TiptapAntDesign from 'tiptap-ant-design-vue'
import { ref, reactive, computed } from 'vue'

const emits = defineEmits(['success', 'close'])
const formRef = ref()
const showMode = ref('add')
const showEdit = ref(false)

const popTitle = computed(() => (showMode.value === 'edit' ? '编辑Warehouse Card' : '新增Warehouse Card'))

const loading = ref(false)

const formData = reactive({
    id: 0,
    commodity_id: 0,
    title: "",
    password: "",
    is_used: 0,
    order_id: 0,
    use_time: 0,
    card_type: 0,
    stock: 0,
    is_delete: 0,
    create_time: 0,
})

const formRules = reactive({
    id: [{ required: true, message: '主键不能为空', trigger: ['blur'] }],
    commodity_id: [{ required: true, message: '关联商品ID不能为空', trigger: ['blur'] }],
    title: [{ required: true, message: '卡号 / 卡密内容不能为空', trigger: ['blur'] }],
    password: [{ required: true, message: '卡密密码（如无可留空）不能为空', trigger: ['blur'] }],
    is_used: [{ required: true, message: '是否已使用: [0=否, 1=是]不能为空', trigger: ['blur'] }],
    order_id: [{ required: true, message: '关联订单ID（使用后记录）不能为空', trigger: ['blur'] }],
    use_time: [{ required: true, message: '使用时间（时间戳）不能为空', trigger: ['blur'] }],
    card_type: [{ required: true, message: '卡密类型: [0=唯一, 1=共享库存, 2=无限库存]不能为空', trigger: ['blur'] }],
    stock: [{ required: true, message: '共享库存数量，仅在 card_type=1 时有效不能为空', trigger: ['blur'] }],
    is_delete: [{ required: true, message: '是否删除不能为空', trigger: ['blur'] }],
    create_time: [{ required: true, message: '创建时间不能为空', trigger: ['blur'] }],
})

const { optionsData } = useDictOptions({
    cate: {
        api: warehouse_cardApi.wholeCategory || (() => Promise.resolve([]))
    }
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
        if (showMode.value === 'edit') {
            await warehouse_cardApi.edit(formData)
        } else {
            await warehouse_cardApi.add(formData)
        }
        feedback.msgSuccess('操作成功')
        emits('close')
        emits('success')
    } finally {
        loading.value = false
    }
}

const open = async (type: string, row?: any) => {
    showMode.value = type
    if (type === 'edit' && row?.id) {
        const data = await warehouse_cardApi.detail(row.id)
        Object.assign(formData, data)
    } else {
        for (const key in formData) {
            formData[key] = typeof formData[key] === 'number' ? 0 : ''
        }
    }
    showEdit.value = true
}

defineExpose({
    open
})
</script>
