# SKUEditor 组件

一个用于可视化添加和展示SKU信息的Vue 3组件，支持v-model绑定，可用于商品管理系统中的规格设置。

## 组件特点

- 支持动态添加、编辑、删除规格项
- 支持动态添加、编辑、删除规格值
- 实时预览SKU数据格式
- 支持v-model双向绑定
- 响应式设计，适应不同屏幕尺寸

## 安装与引入

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import SKUEditor from '@/components/SKUEditor'

const app = createApp(App)
app.use(SKUEditor)
app.mount('#app')
```

### 局部引入

```vue
<script setup lang="ts">
import SKUEditor from '@/components/SKUEditor'
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| modelValue | Object | {} | SKU数据对象，格式为 {"规格名称": ["规格值1", "规格值2"]} |

## 组件事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| update:modelValue | Object | SKU数据对象变化时触发 |

## 使用示例

```vue
<template>
  <div class="container">
    <h2>商品规格设置</h2>
    <SKUEditor v-model="skuData" />
    
    <div class="result">
      <h3>当前SKU数据：</h3>
      <pre>{{ JSON.stringify(skuData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SKUEditor from '@/components/SKUEditor'

// 初始化SKU数据
const skuData = ref({
  '颜色': ['红色', '绿色', '蓝色'],
  '尺寸': ['S', 'M', 'L', 'XL']
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.result {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.result pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
```

## 数据格式说明

SKUEditor组件使用的是嵌套对象格式：

```javascript
{
  "规格名称1": ["规格值1", "规格值2", "规格值3"],
  "规格名称2": ["规格值A", "规格值B", "规格值C"]
}
```

例如：

```javascript
{
  "颜色": ["红色", "绿色", "蓝色"],
  "尺寸": ["S", "M", "L"]
}
```

## 注意事项

1. 每个规格至少需要包含一个规格值
2. 规格名称不能为空字符串
3. 建议合理设置规格名称和值，避免重复或无意义的内容