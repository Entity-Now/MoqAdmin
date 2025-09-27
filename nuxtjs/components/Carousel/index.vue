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

                <!-- 内容区域 -->
                <div v-if="item.title || item.desc || item.button" class="absolute inset-0 w-full h-full p-4 lg:p-8">
                    <div class="flex flex-col lg:flex-row items-center justify-around gap-4 lg:gap-8 h-full">
                        <!-- 文字内容 -->
                        <Motion as="div" v-bind="GradientOpacity" 
                            class="w-full lg:w-auto z-10 backdrop-blur-sm bg-custom-blurring/90 rounded-xl shadow-lg p-6 md:p-8 
                                flex flex-col items-start justify-center gap-4">
                            <Motion as="div" :variants="inViewAnimate" initial="Start" in-view="End"
                                :transition="inViewAnimate.transition" :in-view-options="{once: true}"
                                class="title text-custom-primary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight 
                                    [text-wrap:balance]">
                                {{ item.title }}
                            </Motion>
                            <Motion as="div" :variants="inViewAnimate" initial="Start" in-view="End"
                                :transition="inViewAnimate.transition" :in-view-options="{ once: true }"
                                v-if="item.desc"
                                class="desc text-slate-700 dark:text-slate-300 whitespace-pre text-wrap 
                                    text-base md:text-lg leading-relaxed">
                                {{ item.desc }}
                            </Motion>
                            <Motion as-child :variants="inViewAnimate" initial="Start" in-view="End"
                                :transition="inViewAnimate.transition" :in-view-options="{ once: true }">
                                <NuxtLink v-if="item.button" :to="item.url" class="w-full sm:w-auto mt-2" 
                                    :variants="inViewAnimate" initial="Start" in-view="End" 
                                    :transition="inViewAnimate.transition" :target="item.target" 
                                    :title="item.button">
                                    <button
                                        class="w-full sm:w-auto bg-custom-solid !text-white !h-[45px] !rounded-xl shadow-lg hover:shadow-xl 
                                            transition-all duration-300 transform hover:-translate-y-1 px-6">
                                        {{ item.button }}
                                    </button>
                                </NuxtLink>
                            </Motion>
                        </Motion>

                        <!-- 二级图片 -->
                        <Motion as="img" v-bind="GradientOpacity" :src="item.secondImage" 
                            v-if="item.secondImage"
                            class="hidden lg:block object-fill max-w-[500px] rounded-xl shadow-lg z-10" /> 
                    </div>
                </div>
            </div>
        </div>

        <!-- 指示器 -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button v-for="(item, index) in props.items" :key="index"
                class="flex items-center justify-center w-[25px] h-[25px] bg-white rounded-full text-center hover:bg-blue-300"
                :class="{ 'bg-custom-solid': (currentIndex - 1) == index }" @click="goTo(index)">
                {{ index + 1 }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Motion } from 'motion-v'
import { inViewAnimate, GradientOpacity } from '~/animate/inViewAnimate'

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
    min-height: 300px;
}

/* 响应式优化 */
@media (max-width: 768px) {
    .carousel .absolute {
        max-width: 100%;
    }
    
    .title {
        font-size: 1.5rem !important;
    }
    
    .desc {
        font-size: 0.95rem !important;
    }
    
    .carousel button {
        width: 2rem !important;
        height: 2rem !important;
        padding: 0 !important;
    }
}
</style>