<template>
    <el-card class="!border-none h-full" shadow="never">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">地址管理</h2>
            <el-button type="primary" @click="handleAdd">新增地址</el-button>
        </div>
        
        <div v-if="addressList.length > 0" class="address-list">
            <div 
                v-for="item in addressList" 
                :key="item.id"
                class="address-item"
                :class="{ 'default': item.is_default === 1 }"
            >
                <div class="address-header">
                    <div class="flex items-center">
                        <span class="name mr-4">{{ item.name }}</span>
                        <span class="phone">{{ item.phone }}</span>
                        <el-tag v-if="item.is_default === 1" type="primary" size="small" class="ml-2">默认</el-tag>
                    </div>
                    <div class="address-actions">
                        <el-button type="text" @click="handleEdit(item)" size="small">编辑</el-button>
                        <el-button type="text" @click="handleDelete(item.id)" size="small" danger>
                            删除
                        </el-button>
                        <el-button 
                            v-if="item.is_default !== 1" 
                            type="text" 
                            @click="handleSetDefault(item.id)" 
                            size="small"
                        >
                            设为默认
                        </el-button>
                    </div>
                </div>
                <div class="address-content">
                    {{ item.province }} {{ item.city }} {{ item.district }} {{ item.address }}
                </div>
            </div>
        </div>
        
        <div v-else class="empty-address">
            <div class="empty-content text-center py-10">
                <el-icon class="empty-icon text-gray-300 text-5xl mb-4"><Location /></el-icon>
                <p class="text-gray-400">您还没有添加收货地址</p>
                <el-button type="primary" @click="handleAdd" class="mt-4">添加收货地址</el-button>
            </div>
        </div>
        
        <!-- 地址编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleClose">
            <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="80px">
                <el-form-item label="收货人" prop="name">
                    <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addressForm.phone" placeholder="请输入收货人手机号" />
                </el-form-item>
                <el-form-item label="所在地区">
                    <el-cascader
                        v-model="addressForm.region"
                        :options="citys"
                        :props="regionProps"
                        placeholder="请选择省/市/区"
                        @change="handleRegionChange"
                    />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input
                        v-model="addressForm.address"
                        type="textarea"
                        placeholder="请输入详细地址信息"
                        :rows="3"
                    />
                </el-form-item>
                <el-form-item>
                    <el-switch 
                        v-model="addressForm.is_default" 
                        active-value="1" 
                        inactive-value="0"
                        active-text="设为默认地址"
                        inactive-text="设为默认地址"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Location } from '@element-plus/icons-vue'

import citys from '~/utils/citys'
import feedback from '~/utils/feedback'
import addressApi from '~/api/address'

// 地址列表
const addressList = ref<any[]>([])

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增地址')
const editingId = ref<number | null>(null)

// 表单引用
const addressFormRef = ref<any>()

// 表单数据
const addressForm = reactive({
    name: '',
    phone: '',
    region: [] as string[],
    province: '',
    city: '',
    district: '',
    address: '',
    is_default: '0'
})

// 表单验证规则
const addressRules = reactive<any>({
    name: [
        { required: true, message: '请输入收货人姓名', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入收货人手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    address: [
        { required: true, message: '请输入详细地址', trigger: 'blur' }
    ]
})

const regionProps = {
    label: 'name',
    value: 'name',
    children: 'sub'
}

// 加载地址列表
const loadAddressList = async () => {
    try {
        const res = await addressApi.lists()
        if (res) {
            addressList.value = res
        }
    } catch (error) {
        feedback.msgError('获取地址列表失败')
    }
}

// 处理新增地址
const handleAdd = () => {
    dialogTitle.value = '新增地址'
    editingId.value = null
    resetForm()
    dialogVisible.value = true
}

// 处理编辑地址
const handleEdit = async (item: any) => {
    dialogTitle.value = '编辑地址'
    editingId.value = item.id
    
    // 填充表单数据
    addressForm.name = item.name
    addressForm.phone = item.phone
    addressForm.province = item.province
    addressForm.city = item.city
    addressForm.district = item.district
    addressForm.address = item.address
    addressForm.is_default = String(item.is_default)
    
    // 设置地区选择器的值
    addressForm.region = [item.province, item.city, item.district]
    
    dialogVisible.value = true
}

// 处理删除地址
const handleDelete = async (id: number) => {
    feedback.confirm('确定要删除此地址吗？')
        .then(async () => {
            try {
                const res = await addressApi.delete({ id })
                if (res >= 0) {
                    feedback.msgSuccess('删除成功')
                    await loadAddressList()
                } else {
                    feedback.msgError(res?.msg || '删除失败')
                }
            } catch (error) {
                feedback.msgError('删除失败')
            }
        })
        .catch(() => {})
}

// 处理设置默认地址
const handleSetDefault = async (id: number) => {
    try {
        const res = await addressApi.setDefault({ id })
        if (res >= 0) {
            feedback.msgSuccess('设置成功')
            await loadAddressList()
        } else {
            feedback.msgError('设置失败')
        }
    } catch (error) {
        feedback.msgError('设置失败')
    }
}

// 处理地区选择变化
const handleRegionChange = (values: any) => {
    if (values && Array.isArray(values) && values.length === 3) {
        addressForm.province = values[0]
        addressForm.city = values[1]
        addressForm.district = values[2]
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!addressFormRef.value) return
    
    try {
        await addressFormRef.value.validate()
        
        const formData = {
            ...addressForm,
            is_default: Number(addressForm.is_default)
        }
        
        let res
        if (editingId.value) {
            res = await addressApi.edit({
                ...formData,
                id: editingId.value
            })
        } else {
            res = await addressApi.add(formData)
        }
        
        if (res >= 0) {
            feedback.msgSuccess(editingId.value ? '编辑成功' : '新增成功')
            handleClose()
            await loadAddressList()
        } else {
            feedback.msgError(res?.msg || (editingId.value ? '编辑失败' : '新增失败'))
        }
    } catch (error) {
        // 表单验证失败或API调用失败
    }
}

// 关闭弹窗
const handleClose = () => {
    dialogVisible.value = false
    resetForm()
}

// 重置表单
const resetForm = () => {
    if (addressFormRef.value) {
        addressFormRef.value.resetFields()
    }
    Object.assign(addressForm, {
        name: '',
        phone: '',
        region: [],
        province: '',
        city: '',
        district: '',
        address: '',
        is_default: '0'
    })
}

// 页面加载时获取地址列表
onMounted(async () => {
    await loadAddressList()
})
</script>

<style scoped lang="scss">
.address-list {
    .address-item {
        position: relative;
        padding: 20px;
        margin-bottom: 15px;
        border: 1px solid var(--el-border-color-light);
        border-radius: 8px;
        transition: all 0.3s;
        
        &:hover {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        
        &.default {
            border-color: var(--el-color-primary);
            background-color: rgba(64, 158, 255, 0.05);
            
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: var(--el-color-primary);
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
        }
        
        .address-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .name {
                font-weight: 500;
            }
            
            .phone {
                color: var(--el-text-color-secondary);
            }
        }
        
        .address-content {
            color: var(--el-text-color-regular);
            line-height: 1.6;
        }
    }
}

.empty-address {
    .empty-content {
        .empty-icon {
            opacity: 0.3;
        }
    }
}

:deep(.el-cascader) {
    width: 100%;
}

:deep(.el-dialog) {
    .el-form-item {
        margin-bottom: 20px;
    }
}
</style>