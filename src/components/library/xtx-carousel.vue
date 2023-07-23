<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ show: index === i }"
      >
        <router-link :to="item.hrefUrl">
          <img :src="item.imgUrl" />
        </router-link>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(0)"
      ><i class="iconfont icon-angle-left"
    /></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"
      ><i class="iconfont icon-angle-right"
    /></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',

  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3000
    }
  },

  setup (props) {
    // 显示的图片的索引
    const index = ref(0)

    // 自动轮播
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        index.value %= props.sliders.length
      }, props.duration)
    }

    // 侦听sliders参数的状态
    watch(() => props.sliders, (newValue) => {
      if (newValue.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })

    // 鼠标进入暂停自动播放，离开开启自动播放
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    const toggle = (type) => {
      if (type === 0) {
        index.value--
        index.value = (index.value + 5) % props.sliders.length
      } else if (type === 1) {
        index.value++
        index.value %= props.sliders.length
      }
    }

    // 组件销毁时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { index, stop, start, toggle }
  }
}
</script>

<style lang='less' scoped>
.xtx-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      opacity: 0;
      width: 100%;
      height: 100%;
      transition: opacity 0.5s linear;
      &.show {
        opacity: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-btn {
      position: absolute;
      top: 228px;
      width: 44px;
      height: 44px;
      z-index: 2;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      color: #fff;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        margin-left: 12px;
        width: 12px;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
      }
      .active {
        background-color: #fff;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
