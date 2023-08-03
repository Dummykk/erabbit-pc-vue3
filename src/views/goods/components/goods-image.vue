<template>
  <div class="goods-image">
    <div
      class="large"
      v-show="show"
      :style="[{ backgroundImage: `url(${images[currentIndex]})` }, bgPosition]"
    ></div>
    <div ref="target" class="middle">
      <img :src="images[currentIndex]" />
      <div class="mask" v-show="show" :style="position"></div>
    </div>
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="i"
        :class="{ active: i === currentIndex }"
      >
        <img :src="img" @mouseenter="currentIndex = i" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

export default {
  name: 'GoodsImage',

  props: {
    images: {
      type: Array,
      default: () => []
    }
  },

  setup () {
    const currentIndex = ref(0)

    const target = ref(null)
    const show = ref(false)
    const position = reactive({
      left: 0, top: 0
    })
    const bgPosition = reactive({
      backgroundPositionX: 0, backgroundPositionY: 0
    })
    const { elementX, elementY, isOutside } = useMouseInElement(target)

    watch([elementX, elementY, isOutside], () => {
      show.value = !isOutside.value
      // 计算mask的位置
      if (elementX.value < 100) {
        position.left = 0
      } else if (elementX.value > 300) {
        position.left = 200
      } else {
        position.left = elementX.value - 100
      }
      if (elementY.value < 100) {
        position.top = 0
      } else if (elementY.value > 300) {
        position.top = 200
      } else {
        position.top = elementY.value - 100
      }
      // 计算大图large的背景图的位置
      bgPosition.backgroundPositionX = -position.left * 2 + 'px'
      bgPosition.backgroundPositionY = -position.top * 2 + 'px'

      position.left += 'px'
      position.top += 'px'
    })

    return { currentIndex, target, show, position, bgPosition }
  }
}
</script>

<style lang='less' scoped>
.goods-image {
  position: relative;
  display: flex;
  width: 480px;
  height: 400px;
  .large {
    position: absolute;
    left: 412px;
    width: 400px;
    z-index: 500;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
  }
  .middle {
    position: relative;
    width: 400px;
    height: 400px;
    cursor: move;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .small {
    width: 80px;
    li {
      margin-left: 12px;
      margin-bottom: 15px;
      width: 68px;
      height: 68px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
