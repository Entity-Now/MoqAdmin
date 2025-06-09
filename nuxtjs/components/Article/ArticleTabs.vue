<template>
    <!-- 整体背景 -->
    <div class=" p-6">
        <!-- 顶部 Tabs -->
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap gap-4 mb-8">
                <div v-for="(tab, index) in tabs" :key="index"
                    class="px-4 py-2 text-sm title-custom rounded-lg cursor-pointer transition-colors duration-300"
                    :class="{
                        'bg-custom-tint': activeTab === tab.value,
                        'bg-custom-tint-hover': activeTab !== tab.value,
                    }" @click="activeTab = tab.value">
                    {{ tab.label }}
                </div>
                <div v-for="(tab, index) in categorys" :key="index"
                    class="px-4 py-2 text-sm title-custom rounded-lg cursor-pointer transition-colors duration-300"
                    :class="{
                        'bg-custom-tint': activeTab === tab,
                        'bg-custom-tint-hover': activeTab !== tab,
                    }" @click="activeTab = tab">
                    {{ tab }}
                </div>

            </div>

            <!-- 文章列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(article, index) in articles" :key="index"
                    class="flex flex-col  bg-custom rounded-xl shadow-lg hover:shadow-xl bg-ring transition-all duration-300 transform hover:-translate-y-2">
                    <!-- 文章图片 -->
                    <NuxtLink :to="'/article/detail/' + article.id">
                        <img :src="article.image" :alt="article.title" class="w-full h-48 object-fill rounded-t-xl" />
                    </NuxtLink>

                    <!-- 文章内容 -->
                    <div class="flex flex-col flex-1 p-6">
                        <!-- 标题 -->
                        <NuxtLink :to="'/article/detail/' + article.id" class="text-2xl font-bold title-custom mb-4">
                            {{ article.title }}
                        </NuxtLink>

                        <!-- 简介 -->
                        <div class="text-slate-700 dark:text-slate-300 mb-4">
                            {{ article.intro }}
                        </div>

                        <!-- 元信息 -->
                        <div class="mt-auto flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <!-- 发布日期 -->
                            <div class="flex items-center gap-2">
                                <Icon name="fa-solid fa-calendar" class="w-4 h-4 title-custom" />
                                <span>{{ article.create_time }}</span>
                            </div>

                            <!-- 阅读量 -->
                            <div class="flex items-center gap-2">
                                <Icon name="fa-solid fa-eye" class="w-4 h-4 title-custom" />
                                <span>{{ article.browse }} 阅读</span>
                            </div>
                            <div class="rounded-lg bg-gray-200 px-2 py-1">{{ article.category }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        default: null
    }
})
const data = computed(() => {
    let res = [...props.data.ranking, ...props.data.lately, ...props.data.everyday];
    res = res.filter((item, index) => res.findIndex(it => it.id == item.id) === index)
    return res
});

const tabs = [
    { label: "全部", value: "all" },
    { label: "排行", value: "ranking" },
    { label: "最近", value: "lately" },
    { label: "今日推荐", value: "everyday" },
];
// 标签数据
const categorys = computed(() => {
    const other = data.value.map(it => it.category).filter((it, index) => data.value.findIndex(i => i.category == it) === index);
    return other
})
// 文章数据
const articles = computed(() => {
    if (activeTab.value == "all") {
        return data.value;
    } else if (tabs.find(it => it.value == activeTab.value)) {
        return props.data[activeTab.value]
    }
    return data.value.filter(it => it.category == activeTab.value);
})


// 当前选中的标签
const activeTab = ref("all");




</script>