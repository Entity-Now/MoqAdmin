<template>
  <div
    ref="root"
    class="banner-carousel relative w-full focus:outline-none overflow-hidden group"
    tabindex="0"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <!-- 左右控制按钮 - 悬停时显示 -->
    <button
      v-if="props.items.length > 1"
      class="ctrl-btn ctrl-prev"
      aria-label="上一张"
      @click="prev"
    >
      <Icon name="fas fa-chevron-left" class="text-xl" />
    </button>
    <button
      v-if="props.items.length > 1"
      class="ctrl-btn ctrl-next"
      aria-label="下一张"
      @click="next"
    >
      <Icon name="fas fa-chevron-right" class="text-xl" />
    </button>

    <!-- 轨道容器 -->
    <div class="track-wrapper">
      <div
        class="track"
        :class="{ 'no-transition': !transitioning }"
        :style="{ transform: `translateX(-${innerIndex * 100}%)` }"
      >
        <div
          v-for="(item, idx) in list"
          :key="idx"
          class="slide relative flex-shrink-0 w-full"
        >
          <!-- 背景图 -->
          <div
            v-if="!item.image"
            class="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          />
          <img
            v-else
            :src="item.image"
            :alt="item.title ?? 'Banner'"
            class="absolute inset-0 w-full h-full object-cover "
          />
          
          <!-- 渐变遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-indigo-700/30 to-indigo-100/10 z-10"></div>

          <!-- 内容层 -->
          <div class="content-layer">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
              <div
                class="grid h-full items-center justify-center"
                :class="[
                  item.secondImage 
                    ? 'grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12' 
                    : 'grid-cols-1'
                ]"
              >
                <!-- 文字区 -->
                <div
                  class="text-panel"
                  :class="{
                    'mx-auto text-center max-w-3xl': !item.secondImage,
                    'max-w-xl': item.secondImage
                  }"
                >
                  <Motion
                    as="h1"
                    :variants="titleVars"
                    initial="hidden"
                    in-view="visible"
                    :in-view-options="{ once: true }"
                    class="title"
                  >
                    {{ item.title ?? '欢迎体验' }}
                  </Motion>

                  <Motion
                    as="p"
                    v-if="item.desc"
                    :variants="descVars"
                    initial="hidden"
                    in-view="visible"
                    :in-view-options="{ once: true }"
                    class="desc"
                  >
                    {{ item.desc }}
                  </Motion>

                  <Motion
                    as="div"
                    v-if="item.button"
                    :variants="btnVars"
                    initial="hidden"
                    in-view="visible"
                    :in-view-options="{ once: true }"
                    class="mt-8"
                  >
                    <NuxtLink
                      :to="item.url ?? '#'"
                      :target="item.target ?? '_self'"
                      class="inline-block"
                    >
                      <button class="btn-primary group/btn">
                        <span>{{ item.button }}</span>
                        <Icon name="fas fa-arrow-right" class="text-sm transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </NuxtLink>
                  </Motion>
                </div>

                <!-- 右侧产品图 -->
                <Motion
                  v-if="item.secondImage"
                  as="div"
                  class="second-img-container hidden lg:flex items-center justify-center"
                  :variants="imgVars"
                  initial="hidden"
                  in-view="visible"
                  :in-view-options="{ once: true }"
                >
                  <div class="image-wrapper">
                    <img
                      :src="item.secondImage"
                      :alt="`${item.title} 产品图`"
                      class="second-img"
                      :class="blendClass(item.secondImage)"
                      @load="detectBlendMode(item.secondImage)"
                    />
                  </div>
                </Motion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 指示器 -->
    <div v-if="props.items.length > 1" class="dots">
      <button
        v-for="(_, i) in props.items"
        :key="i"
        :aria-label="`第 ${i + 1} 张`"
        :class="{ active: i === current }"
        @click.stop="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Icon from '~/components/Icon/index.vue'
import { Motion } from 'motion-v'
import { useCarousel } from '~/composables/useCarousel'

interface BannerItem {
  image?: string
  title?: string
  desc?: string
  secondImage?: string
  button?: string
  url?: string
  target?: string
}

const props = defineProps<{
  items: BannerItem[]
  autoplay?: boolean
  interval?: number
}>()

const {
  list,
  innerIndex,
  current,
  goTo,
  next,
  prev,
  transitioning,
  start: startAutoplay,
  stop: stopAutoplay,
} = useCarousel(props.items, {
  autoplay: props.autoplay ?? true,
  interval: props.interval ?? 5000,
})

// ---------- 动画配置 ----------
const titleVars = { 
  hidden: { opacity: 0, y: 40 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } } 
}
const descVars = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7 } } 
}
const btnVars = { 
  hidden: { opacity: 0, scale: 0.9 }, 
  visible: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.6 } } 
}
const imgVars = { 
  hidden: { opacity: 0, scale: 0.9, x: 50 }, 
  visible: { opacity: 1, scale: 1, x: 0, transition: { delay: 0.3, duration: 0.8 } } 
}

// ---------- 自动去底 ----------
type BlendMode = 'multiply' | 'screen' | 'normal'
const blendCache = ref<Map<string, BlendMode>>(new Map())

const blendClass = (src: string) => {
  const mode = blendCache.value.get(src) ?? 'normal'
  return {
    'blend-multiply': mode === 'multiply',
    'blend-screen': mode === 'screen',
  }
}

async function detectBlendMode(src: string): Promise<void> {
  if (blendCache.value.has(src)) return
  if (import.meta.server) {
    blendCache.value.set(src, 'normal')
    return
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return void blendCache.value.set(src, 'normal')

      canvas.width = 1
      canvas.height = 1
      ctx.drawImage(img, 0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

      const isWhite = r > 240 && g > 240 && b > 240
      const isBlack = r < 30 && g < 30 && b < 30
      const mode: BlendMode = isWhite ? 'multiply' : isBlack ? 'screen' : 'normal'
      blendCache.value.set(src, mode)
    } catch {
      blendCache.value.set(src, 'normal')
    }
  }
  img.onerror = () => blendCache.value.set(src, 'normal')
  img.src = src
}

onMounted(() => {
  props.items
    .filter(i => i.secondImage)
    .forEach(i => detectBlendMode(i.secondImage!))
})

// ---------- 鼠标悬停控制 ----------
const root = ref<HTMLElement | null>(null)
let mouseEnterHandler: (() => void) | null = null
let mouseLeaveHandler: (() => void) | null = null

onMounted(() => {
  if (!root.value) return
  
  mouseEnterHandler = () => stopAutoplay()
  mouseLeaveHandler = () => startAutoplay()
  
  root.value.addEventListener('mouseenter', mouseEnterHandler)
  root.value.addEventListener('mouseleave', mouseLeaveHandler)
})

onBeforeUnmount(() => {
  if (root.value && mouseEnterHandler && mouseLeaveHandler) {
    root.value.removeEventListener('mouseenter', mouseEnterHandler)
    root.value.removeEventListener('mouseleave', mouseLeaveHandler)
  }
})
</script>

<style scoped lang="scss">
/* ===== 响应式高度 ===== */
.banner-carousel {
  height: 100%;
  @screen sm { height: 500px; }
  @screen md { height: 560px; }
  @screen lg { height: 100%; }
  @screen xl { height: 100% }
}

/* ===== 轨道 ===== */
.track-wrapper {
  @apply absolute inset-0 overflow-hidden;
}

.track {
  @apply flex w-full h-full;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.no-transition { 
  transition: none; 
}

/* ===== 控制按钮 ===== */
.ctrl-btn {
  @apply absolute top-1/2 -translate-y-1/2 z-30
         w-11 h-11 sm:w-12 sm:h-12 rounded-full
         flex items-center justify-center
         bg-white/90 backdrop-blur-md
         text-gray-800 shadow-xl
         transition-all duration-300
         opacity-0 group-hover:opacity-100
         hover:bg-white hover:scale-110 hover:shadow-2xl
         active:scale-95;
  
  /* 确保按钮可点击 */
  pointer-events: auto;
  cursor: pointer;
}

.ctrl-prev { 
  left: 1rem;
  @screen sm { left: 1.5rem; }
  @screen lg { left: 2rem; }
}

.ctrl-next { 
  right: 1rem;
  @screen sm { right: 1.5rem; }
  @screen lg { right: 2rem; }
}

/* ===== 内容层 ===== */
.content-layer {
  @apply absolute inset-0 flex items-center z-20;
  /* 防止内容层阻止按钮点击 */
  pointer-events: none;
}

.content-layer > * {
  pointer-events: auto;
}

/* ===== 文字面板 ===== */
.text-panel {
  @apply space-y-4 sm:space-y-5;
}

/* ===== 标题 ===== */
.title {
  @apply font-bold leading-tight text-white;
  font-size: clamp(2rem, 6vw, 4rem);
  letter-spacing: -0.02em;
  text-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.3),
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.4);
}

/* ===== 描述文字 ===== */
.desc {
  @apply text-white/95 leading-relaxed;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.7;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 90%;
}

/* ===== 按钮 ===== */
.btn-primary {
  @apply px-8 py-3.5 sm:px-10 sm:py-4
         bg-gradient-to-r from-blue-600 to-indigo-600
         hover:from-blue-700 hover:to-indigo-700
         text-white font-semibold text-base sm:text-lg
         rounded-full shadow-2xl
         transition-all duration-300
         hover:shadow-blue-500/50 hover:-translate-y-1
         active:scale-95
         flex items-center gap-3;
  
  box-shadow: 
    0 10px 30px rgba(59, 130, 246, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.1);
    
  &:hover {
    box-shadow: 
      0 15px 40px rgba(59, 130, 246, 0.5),
      0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

/* ===== 右侧图片容器 ===== */
.second-img-container {
  @apply relative w-full h-full;
  perspective: 1000px;
}

.image-wrapper {
  @apply relative w-full max-w-lg mx-auto;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-out;
  
  &:hover {
    transform: translateZ(20px) scale(1.02);
  }
  
  /* 添加光晕效果 */
  &::before {
    content: '';
    @apply absolute inset-0 rounded-2xl;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
    z-index: -1;
    filter: blur(30px);
    transform: translateZ(-10px);
  }
}

.second-img {
  @apply w-full h-auto object-contain rounded-2xl;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5));
  max-height: 500px;
  transition: filter 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6));
  }
}

.blend-multiply { 
  mix-blend-mode: multiply; 
}

.blend-screen { 
  mix-blend-mode: screen; 
}

/* ===== 指示器 ===== */
.dots {
  @apply absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 
         flex gap-2.5 z-30;
}

.dots button {
  @apply w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full 
         bg-white/40 backdrop-blur-sm
         transition-all duration-300
         hover:bg-white/60 hover:scale-110;
  
  /* 确保指示器可点击 */
  cursor: pointer;
  pointer-events: auto;
  
  &.active {
    @apply w-8 sm:w-10 bg-white shadow-lg;
  }
}

/* ===== 响应式优化 ===== */
@media (max-width: 640px) {
  .text-panel {
    @apply px-4;
  }
  
  .desc {
    @apply text-sm;
    max-width: 100%;
  }
  
  /* 移动端始终显示控制按钮 */
  .ctrl-btn {
    opacity: 0.8;
  }
}

/* ===== 动画增强 ===== */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.second-img-container:hover .second-img {
  animation: float 3s ease-in-out infinite;
}
</style>