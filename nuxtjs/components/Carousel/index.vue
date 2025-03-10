<template>
    <div ref="carousel" class="carousel">
        <button class="left-4 shadow-lg bg-white hover:bg-gray-100 hover:text-gray-600" @click="prev">
            <i class="fa-solid fa-caret-left"></i>
        </button>
        <button class="right-4 shadow-lg bg-white hover:bg-gray-100 hover:text-gray-600" @click="next">
            <i class="fa-solid fa-caret-right"></i>
        </button>
        <div ref="container" class="carouselContainer">
            <slot v-for="(item, index) in props.items" :item="item" :key="item" :index="currentIndex">
                <div v-if="currentIndex == (index)" :key="index" class="item relative w-full h-full">
                    <img :src="item.image" :alt="item.title" class="!w-full !h-full object-fill" />
                    <div v-if="item.secondImage && item.title"
                        class="flex flex-row items-center justify-center gap-2 absolute left-0 top-0 w-full h-full">
                        <div class="flex-1 flex flex-col items-center justify-center gap-2">
                            <div class="title text-white text-3xl">{{ item.title }}</div>
                            <div class="desc text-gray-100">{{ item.desc }}</div>
                            <el-button v-if="item.button" class="mt-4" type="primary" size="large">
                                <NuxtLink :to="item.url" :target="item.target" :title="item.button">
                                    {{ item.button }}
                                </NuxtLink>
                            </el-button>
                        </div>
                        <img :src="item.secondImage" class="object-fill max-w-[500px] mr-12" />
                    </div>
                </div>
            </slot>
        </div>
        <div ref="indicator" class="indicator">
            <button v-for="(item, index) in props.items" :key="index"
                class="flex items-center justify-center w-[25px] h-[25px] bg-white rounded-full text-center hover:bg-blue-300"
                :class="{ 'bg-red-300': currentIndex == index }" @click="currentIndex = index">
                {{ index + 1 }}
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    items: {
        type: Array<any>,
        default: () => []
    },
    interval: {
        type: Number,
        default: 5000
    },
    autoplay: {
        type: Boolean,
        default: true
    }
})

const autoplayInterval = ref<any>(null)
const currentIndex = ref(0)
const carousel = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const indicator = ref<HTMLElement | null>(null)

const next = () => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prev = () => {
    currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
}


const startAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value)
    }
    if (props.autoplay) {
        autoplayInterval.value = setInterval(next, props.interval)
    }
}

const stopAutoplay = () => {
    clearInterval(autoplayInterval.value)
}

onMounted(() => {
    startAutoplay()
    carousel.value?.addEventListener('mouseover', stopAutoplay)
    carousel.value?.addEventListener('mouseout', startAutoplay)
    // 离开标签和离开视图时关闭播放
    window.addEventListener('blur', stopAutoplay)
    window.addEventListener('focus', startAutoplay)
})

onBeforeUnmount(() => {
    stopAutoplay()
    carousel.value?.removeEventListener('mouseover', stopAutoplay)
    carousel.value?.removeEventListener('mouseout', startAutoplay)
    window.removeEventListener('blur', stopAutoplay)
    window.removeEventListener('focus', startAutoplay)

})
</script>

<style scope lang="scss">
.carousel {
    position: relative;
    height: 100%;
    width: 100%;

    &>button {
        z-index: 99;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        font-size: 2rem;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        width: 60px;
        height: 60px;
    }

    .carouselContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .indicator {
        z-index: 99;
        position: absolute;
        width: 100%;
        height: 30px;
        bottom: 5%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
}

/* Transition 动画 */
.carousel-slide-enter-active,
.carousel-slide-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.carousel-slide-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.carousel-slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>