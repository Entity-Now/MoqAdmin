<template>
    <div class="pagination-container" v-if="!(hideOnSinglePage && totalPage <= 1)">
        <button class="item previous" @click="changePage(current - 1)" :disabled="current <= 1">上一页</button>
        <template v-for="(page, index) in pageNumbers" :key="index">
            <button class="item ellipsis"
                v-if="page === '...'"
                disabled
            >
                ...
            </button>
            <button class="item page"
                v-else
                :class="{ active: page === props.current }"
                @click="changePage(page)"
            >
                {{ page }}
        </button>
        </template>
        <button class="item next" @click="changePage(props.current + 1)" :disabled="props.current >= totalPage">下一页</button>
    </div>
</template>
    
<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 1,
    validator: (value: number) => value > 0
  },
  length: {
    type: Number,
    default: 7,
    validator: (value: number) => value >= 5 && value % 2 === 1 // 建议使用奇数且不小于5
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false
  },
  template: {
    type: String,
    default: null
  }
})

const emits = defineEmits(['update:current'])

// 计算总页数
const totalPage = computed(() => Math.ceil(props.total / props.size))

// 优化后的页码计算逻辑
const pageNumbers = computed<(number | string)[]>(() => {
  const { current, length } = props
  const total = totalPage.value
  const half = Math.floor(length / 2)
  
  // 总页数小于等于显示长度时，显示所有页码
  if (total <= length) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // 当前页靠近首页时的显示逻辑
  if (current <= half + 1) {
    return [
      ...Array.from({ length: length - 2 }, (_, i) => i + 1),
      '...',
      total
    ]
  }

  // 当前页靠近尾页时的显示逻辑
  if (current >= total - half) {
    return [
      1,
      '...',
      ...Array.from({ length: length - 2 }, (_, i) => total - (length - 3) + i) 
    ]
  }

  // 当前页在中间时的显示逻辑
  return [
    1,
    '...',
    ...Array.from({ length: length - 4 }, (_, i) => current - Math.floor((length - 4) / 2) + i),
    '...',
    total
  ]
})

// 处理页码变化
const changePage = (page: number | string) => {
  if (typeof page !== 'number' || page < 1 || page > totalPage.value || page === props.current) {
    return
  }
  emits('update:current', page)
}

const getLink = (page: number | string) =>{
    if(page == '...') return '#';
    return props.template.replace('{page}', page.toString())
}

// 监听total和size变化，确保current不超过总页数
watch([() => props.total, () => props.size], () => {
  if (props.current > totalPage.value && totalPage.value > 0) {
    emits('update:current', totalPage.value)
  }
})
</script>
    
<style scoped>
    .pagination-container{
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: center;
    }
    .pagination-container .item{
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s, color 0.3s;
    }
    .pagination-container .item.active{
        background-color: rgb(129 140 248 / 1);
        color: #fff;
    }
    .pagination-container .item:disabled{
        cursor: not-allowed;
        opacity: 0.5;
        background-color: rgb(243 244 246 / 1);
    }
    .pagination-container .item:not(:disabled):hover{
        background-color: rgb(165 180 252 / 1);
        color: #fff;
    }
</style>