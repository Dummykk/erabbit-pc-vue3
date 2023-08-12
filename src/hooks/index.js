import { onUnmounted, ref } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

/**
 * 节流函数
 * @param {Function} fn - 要执行的操作
 * @param {Number} delay - 间隔的时间
 * @returns Function
 */
export const throttle = (fn, delay) => {
  let timer = null

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 数据懒加载
 * @param {Element} target - 需要数据懒加载的DOM对象
 * @param {Function} apiFn - 请求数据的API方法
 * @returns 返回请求结果
 */
export const useLazyData = (target, apiFn) => {
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    {
      // threshold: 容器和可视区交叉的占比（进入的面积/容器完整面积） 取值在0-1之间，默认值比0大，所以当容器较长时需要滚动较多距离才能触发进入可视区域事件。
      threshold: 0
    }
  )
  return result
}

/**
 * 支付倒计时函数
 */
export const useCountdown = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)

  onUnmounted(() => {
    pause()
  })

  // 开启定时器
  const start = (t) => {
    time.value = t
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return { start, timeText }
}
