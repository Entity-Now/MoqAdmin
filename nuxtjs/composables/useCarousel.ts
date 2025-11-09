import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

export function useCarousel<T>(items: T[], { autoplay = true, interval = 5000 } = {}) {
  const rawItems = ref(items)
  const current = ref(0)                 // 真实索引（不含克隆）
  const innerIndex = computed(() => current.value + 1) // 带克隆的索引

  // 克隆首尾实现无缝
  const list = computed(() => [
    rawItems.value[rawItems.value.length - 1],
    ...rawItems.value,
    rawItems.value[0],
  ])

  const goTo = (idx: number) => {
    current.value = idx
  }

  const next = () => {
    current.value += 1
    if (current.value >= rawItems.value.length) {
      // 跳到克隆的最后一项后立即回到真实第一项
      current.value = 0
      // 等待 transition 结束再重置
      setTimeout(resetAfterTransition, 500)
    }
  }

  const prev = () => {
    current.value -= 1
    if (current.value < 0) {
      current.value = rawItems.value.length - 1
      setTimeout(resetAfterTransition, 500)
    }
  }

  const resetAfterTransition = () => {
    // 关闭 transition 再瞬间跳回真实位置
    transitioning.value = false
    nextTick(() => {
      transitioning.value = true
    })
  }

  const transitioning = ref(true)

  // ---------- 自动播放 ----------
  let timer: NodeJS.Timeout | null = null
  const start = () => {
    if (!autoplay) return
    timer = setInterval(next, interval)
  }
  const stop = () => timer && clearInterval(timer)

  onMounted(() => {
    start()
    console.log(list);
  })
  onBeforeUnmount(() => stop())

  return {
    list,
    innerIndex,
    current,
    goTo,
    next,
    prev,
    start,
    stop,
    transitioning,
  }
}