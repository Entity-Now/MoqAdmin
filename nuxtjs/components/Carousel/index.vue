<template>
    <div ref="carousel" class="carousel relative w-full h-full">
        <!-- 左右切换按钮 -->
        <button
            class="z-10 absolute left-4 top-1/2 transform -translate-y-1/2 shadow-lg bg-white hover:bg-gray-100 hover:text-gray-600 rounded-full w-10 h-10 flex items-center justify-center"
            @click="prev">
            <i class="fa-solid fa-caret-left"></i>
        </button>
        <button
            class="z-10 absolute right-4 top-1/2 transform -translate-y-1/2 shadow-lg bg-white hover:bg-gray-100 hover:text-gray-600 rounded-full w-10 h-10 flex items-center justify-center"
            @click="next">
            <i class="fa-solid fa-caret-right"></i>
        </button>

        <!-- Carousel 内容 -->
        <div ref="container" class="carouselContainer overflow-hidden relative w-full h-full">
            <div v-for="(item, index) in itemsWithClones" :key="index"
                class="item absolute w-full h-full transition-transform duration-500" :style="getItemStyle(index)">
                <!-- 主图片 -->
                <img :src="item.image" :alt="item.title" class="w-full h-full object-fill rounded-xl shadow-lg" />

                <!-- 二级内容 -->
                <div v-if="item.secondImage && item.title"
                    class="flex flex-col md:flex-row items-center justify-around gap-8 absolute left-0 top-0 w-full h-full px-8">
                    <!-- 文字内容 -->
                    <div
                        class="w-full md:max-w-[600px] lg:max-w-[800px] flex flex-col items-start justify-start gap-4 backdrop-blur-sm bg-gradient-to-br from-white/80 to-[#f0f4ff]/80 dark:from-gray-800/80 dark:to-[#1a237e]/80 rounded-xl shadow-lg px-8 py-10">
                        <div class="title text-[#5b6bd8] dark:text-[#7986cb] text-3xl font-bold">
                            {{ item.title }}
                        </div>
                        <div class="desc text-gray-700 dark:text-gray-300">
                            {{ item.desc }}
                        </div>
                        <NuxtLink v-if="item.button" :to="item.url" :target="item.target" :title="item.button">
                            <el-button
                                class="mt-4 !bg-gradient-to-br from-[#5b6bd8] to-[#3f51b5] dark:from-[#5b6bd8] dark:to-[#3f51b5] !text-white !h-[50px] !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                {{ item.button }}
                            </el-button>
                        </NuxtLink>
                    </div>

                    <!-- 二级图片 -->
                    <img :src="item.secondImage" class="object-fill max-w-[500px] rounded-xl shadow-lg" />
                </div>
            </div>
        </div>

        <!-- 指示器 -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button v-for="(item, index) in props.items" :key="index"
                class="flex items-center justify-center w-[25px] h-[25px] bg-white rounded-full text-center hover:bg-blue-300"
                :class="{ '!bg-red-300': (currentIndex - 1) == index }" @click="goTo(index)">
                {{ index + 1 }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface CarouselItem {
    image: string;
    title?: string;
    desc?: string;
    secondImage?: string;
    button?: string;
    url?: string;
    target?: string;
}

const props = defineProps<{
    items: CarouselItem[];
    interval?: number;
    autoplay?: boolean;
}>();

const currentIndex = ref(1); // 从克隆项开始
const lockStyle = ref(false);
const carousel = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const autoplayInterval = ref<NodeJS.Timeout | null>(null);

// 添加克隆项以实现无缝衔接
const itemsWithClones = computed(() => {
    return [props.items[props.items.length - 1], ...props.items, props.items[0]];
});
// 获取每个项目的样式
const getItemStyle = (index: number) => {
    const offset = (index - currentIndex.value) * 100;
    return {
        transform: `translateX(${offset}%)`,
        transition: lockStyle.value ? 'none' : 'transform 0.5s ease',
    };
};

// 切换到下一项
const next = () => {
    currentIndex.value++;
    if(currentIndex.value === itemsWithClones.value.length - 1){
        setTimeout(() => {
            lockStyle.value = true;
            currentIndex.value = 1;
            setTimeout(()=>{
                lockStyle.value = false;
            }, 10)
        }, 500);
    }

};

// 切换到上一项
const prev = () => {
    currentIndex.value--;
    if(currentIndex.value === 0){
        setTimeout(() => {
            lockStyle.value = true;
            currentIndex.value = itemsWithClones.value.length - 2;
            setTimeout(() => {
                lockStyle.value = false;
            }, 10)
        }, 500);
    }
};

// 跳转到指定项
const goTo = (index: number) => {
    currentIndex.value = index + 1; // 调整索引以匹配克隆项
};

// 启动自动播放
const startAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
    }
    if (props.autoplay) {
        autoplayInterval.value = setInterval(next, props.interval || 5000);
    }
};

// 停止自动播放
const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
    }
};

// 组件挂载时启动自动播放
onMounted(() => {
    startAutoplay();
    carousel.value?.addEventListener('mouseover', stopAutoplay);
    carousel.value?.addEventListener('mouseout', startAutoplay);
    window.addEventListener('blur', stopAutoplay);
    window.addEventListener('focus', startAutoplay);
});

// 组件卸载时清理事件监听器
onBeforeUnmount(() => {
    stopAutoplay();
    carousel.value?.removeEventListener('mouseover', stopAutoplay);
    carousel.value?.removeEventListener('mouseout', startAutoplay);
    window.removeEventListener('blur', stopAutoplay);
    window.removeEventListener('focus', startAutoplay);
});
</script>

<style scoped lang="scss">
.carouselContainer {
    display: flex;
    transition: transform 0.5s ease;
}

.item {
    flex: 0 0 100%;
}
</style>