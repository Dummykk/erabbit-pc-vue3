<template>
  <div class="home-banner">
    <xtx-carousel :sliders="sliders" :autoPlay="true" />
  </div>
</template>

<script>
import xtxCarousel from '@/components/library/xtx-carousel.vue'
import { getBanner } from '@/api/home'
import { ref } from 'vue'

export default {
  name: 'HomeBanner',

  components: { xtxCarousel },

  setup () {
    const sliders = ref([])
    getBanner(1).then(data => {
      sliders.value = data.result
    })

    return { sliders }
  }
}
</script>

<style lang='less' scoped>
.home-banner {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
  width: 100%;
  height: 500px;
  .xtx-carousel {
    // 修改子组件的样式
    ::v-deep .carousel-btn.prev {
      left: 270px;
    }
    ::v-deep .carousel-indicator {
      padding-left: 250px;
    }
  }
}
</style>
