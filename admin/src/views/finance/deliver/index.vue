<template>
    <popup
        :show="showEdit"
        :title="popTitle"
        :loading="loading"
        :async-close="true"
        width="500px"
        @close="emits('close')"
        @confirm="handleSubmit"
    >
        <div class="p-6 pb-0">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
                <el-form-item label="子订单ID">
                    <el-input v-model="formData.sub_order_id" disabled placeholder="子订单ID" />
                </el-form-item>
                <el-form-item label="快递公司" prop="logistics_company">
                    <el-input v-model="formData.logistics_company" placeholder="请输入快递公司名称" />
                </el-form-item>
                <el-form-item label="物流单号" prop="logistics_no">
                    <el-input v-model="formData.logistics_no" placeholder="请输入物流单号" />
                </el-form-item>
            </el-form>
        </div>
    </popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import feedback from '@/utils/feedback'
import orderApi from '@/api/finance/order'

const emits = defineEmits(['success', 'close'])

const formRef = ref()
const showEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const popTitle = computed<string>(() => {
    return '订单发货'
})

// 表单数据
const formData: any = reactive({
    sub_order_id: '',       // 子订单ID
    logistics_company: '',  // 快递公司
    logistics_no: ''        // 物流单号
})

// 表单规则
const formRules: any = reactive({
    logistics_company: [
        { required: true, message: '请填写快递公司名称', trigger: ['blur'] }
    ],
    logistics_no: [
        { required: true, message: '请填写物流单号', trigger: ['blur'] }
    ]
})

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
    await formRef.value?.validate()
    loading.value = true
    try {
        await orderApi.deliveryOrder(
            formData.sub_order_id,
            formData.logistics_company,
            formData.logistics_no
        )
        feedback.msgSuccess('发货成功')

        emits('close')
        emits('success')
    } catch (error: any) {
        feedback.msgError(error.message || '发货失败，请重试')
    } finally {
        loading.value = false
        showEdit.value = false
    }
}

/**
 * 打开表单
 *
 * @param {any} row - 包含sub_order_id的数据行
 * @returns {Promise<void>}
 */
const open = async (row?: any): Promise<void> => {
    // 重置表单数据
    formData.sub_order_id = row?.sub_order_id || ''
    formData.logistics_company = row?.logistics_company || ''
    formData.logistics_no = row?.logistics_no || ''
    
    // 重置表单验证状态
    if (formRef.value) {
        formRef.value.resetFields()
    }
    
    showEdit.value = true
}

defineExpose({
    open
})
</script>

<style scoped lang="scss">
/* 组件样式可以根据需要进行扩展 */
</style>
