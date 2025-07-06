<template>
    <div>
        <!-- 搜索栏 -->
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="用户信息">
                    <el-input v-model="queryParams.user" class="w-[250px]" placeholder="请输入用户编号/昵称/手机号" clearable
                        @keyup.enter="resetPaging" />
                </el-form-item>
                <el-form-item label="订单编号">
                    <el-input v-model="queryParams.order_sn" class="w-[250px]" placeholder="请输入订单编号" clearable
                        @keyup.enter="resetPaging" />
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="queryParams.pay_way" class="w-[250px]" placeholder="请选择">
                        <el-option value="" label="全部" />
                        <el-option v-for="(value, key) in pager.extend?.payWay" :key="key" :label="value"
                            :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-select v-model="queryParams.pay_status" class="w-[250px]" placeholder="请选择">
                        <el-option value="" label="全部" />
                        <el-option v-for="(value, key) in pager.extend?.payStatus" :key="key" :label="value"
                            :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间">
                    <date-picker v-model:startTime="queryParams.start_time" v-model:endTime="queryParams.end_time" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPaging">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格栏 -->
        <el-card v-loading="pager.loading" class="!border-none" shadow="never">
            <el-table :data="pager.lists" size="large">
                <el-table-column label="用户信息" min-width="120">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="36" :src="row.user.avatar" />
                            <span class="ml-2">{{ row?.user.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" prop="order_type" min-width="100">
                    <template #default="{ row }">
                        <span v-if="row.order_type == 1">充值</span>
                        <span v-else-if="row.order_type == 2">商品</span>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单编号" prop="order_sn" min-width="100" />
                <el-table-column label="支付流水号" prop="transaction_id" min-width="100" />
                <el-table-column label="付款金额" prop="paid_amount" min-width="100" />
                <el-table-column label="赠送金额" prop="give_amount" min-width="100" />
                <el-table-column label="支付方式" prop="pay_way" min-width="100" />
                <el-table-column label="支付状态" prop="pay_status" min-width="100">
                    <template #default="{ row }">
                        <span v-if="row.pay_status">已支付</span>
                        <span v-else>未支付</span>
                    </template>
                </el-table-column>
                <el-table-column label="收货状态" prop="delivery_status" min-width="100">
                    <template #default="{ row }">
                        <span v-if="row.delivery_status == 0">未发货</span>
                        <span v-else-if="row.delivery_status == 1">等待发货</span>
                        <span v-else-if="row.delivery_status == 2">已发货</span>
                        <span v-else-if="row.delivery_status == 3">失败</span>
                        <span v-else-if="row.delivery_status == 4">已收货</span>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单备注" prop="remark" min-width="175" />
                <el-table-column label="创建时间" prop="create_time" min-width="175" />
                <el-table-column label="支付时间" prop="pay_time" min-width="175" />
            </el-table>
            <div class="flex justify-end mt-4">
                <paging v-model="pager" @change="queryLists" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { usePaging } from '@/hooks/usePaging'
import rechargeApi from '@/api/finance/recharge'

// 查询参数
const queryParams = reactive({
    user: '',
    order_sn: '',
    pay_way: '',
    pay_status: '',
    start_time: '',
    end_time: ''
})

// 分页查询
const { pager, queryLists, resetParams, resetPaging } = usePaging({
    fetchFun: rechargeApi.lists,
    params: queryParams
})

onMounted(async () => {
    await queryLists()
})
</script>
