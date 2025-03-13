<template>
    <!-- 整体背景 -->
    <div class="bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-900 dark:to-[#1a237e] min-h-screen p-6">
        <!-- 顶部 Tabs -->
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap gap-4 mb-8">
                <div v-for="(tab, index) in tabs" :key="index"
                    class="px-4 py-2 text-sm text-[#5b6bd8] dark:text-[#7986cb] rounded-lg cursor-pointer transition-colors duration-300"
                    :class="{
                        'bg-[#e0e7ff] dark:bg-[#3f51b5]': activeTab === tab.value,
                        'hover:bg-[#d0d7ff] dark:hover:bg-[#5b6bd8]': activeTab !== tab.value,
                    }" @click="activeTab = tab.value">
                    {{ tab.label }}
                </div>
            </div>

            <!-- 文章列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(article, index) in filteredArticles" :key="index"
                    class="flex flex-col bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] rounded-xl shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2">
                    <!-- 文章图片 -->
                    <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover rounded-t-xl" />

                    <!-- 文章内容 -->
                    <div class="flex flex-col flex-1 p-6">
                        <!-- 标题 -->
                        <div class="text-2xl font-bold text-[#5b6bd8] dark:text-[#7986cb] mb-4">
                            {{ article.title }}
                        </div>

                        <!-- 简介 -->
                        <div class="text-gray-700 dark:text-gray-300 mb-4">
                            {{ article.intro }}
                        </div>

                        <!-- 元信息 -->
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <!-- 发布日期 -->
                            <div class="flex items-center gap-2">
                                <Icon name="fa-solid fa-calendar" class="w-4 h-4 text-[#5b6bd8] dark:text-[#7986cb]" />
                                <span>{{ article.create_time }}</span>
                            </div>

                            <!-- 阅读量 -->
                            <div class="flex items-center gap-2">
                                <Icon name="fa-solid fa-eye" class="w-4 h-4 text-[#5b6bd8] dark:text-[#7986cb]" />
                                <span>{{ article.browse }} 阅读</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 标签数据
const tabs = [
    { label: "全部", value: "all" },
    { label: "技术分享", value: "技术分享" },
    { label: "前端开发", value: "前端" },
    { label: "PHP", value: "PHP" },
];

// 文章数据
const articles = [
    {
        id: 6,
        category: "技术分享",
        image: "http://localhost:8100/static/default/images/article06.jpg",
        title: "PHP如何实现不模糊包含表达式",
        intro: "不模糊包含表达式是指匹配字符串时必须完全匹配，而不是只匹配部分字符。在 PHP 中，可以使用 preg_match 函数来实现正则表达式匹配。",
        browse: 0,
        create_time: "2024-05-20 10:00:00",
        update_time: "2024-05-20 10:00:00",
    },
    {
        id: 7,
        category: "前端",
        image: "http://localhost:8100/static/default/images/article07.jpg",
        title: "Vue 3 的新特性与最佳实践",
        intro: "Vue 3 引入了 Composition API、性能优化和新特性，本文将带你深入了解这些变化并分享最佳实践。",
        browse: 123,
        create_time: "2024-05-19 09:00:00",
        update_time: "2024-05-19 09:00:00",
    },
    {
        id: 8,
        category: "PHP",
        image: "http://localhost:8100/static/default/images/article08.jpg",
        title: "PHP 8 新特性解析",
        intro: "PHP 8 引入了许多新特性，如 JIT 编译器、联合类型、属性提升等，本文将为你详细解析这些新功能。",
        browse: 456,
        create_time: "2024-05-18 08:00:00",
        update_time: "2024-05-18 08:00:00",
    },
];

// 当前选中的标签
const activeTab = ref("all");

// 根据标签筛选文章
const filteredArticles = computed(() => {
    if (activeTab.value === "all") {
        return articles;
    }
    return articles.filter((article) => article.category === activeTab.value);
});

</script>