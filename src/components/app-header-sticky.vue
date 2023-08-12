<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <div class="container" v-show="y > 78">
      <router-link class="logo" to="/" />
      <app-header-nav />
      <div class="right">
        <router-link to="/">品牌</router-link>
        <router-link to="/">专题</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeaderNav from './app-header-nav.vue'
import { useWindowScroll } from '@vueuse/core'
// import { ref } from 'vue'

export default {
  name: 'AppHeaderSticky',

  components: {
    AppHeaderNav
  },

  setup () {
    /* const y = ref(0)

    window.addEventListener('scroll', () => {
      y.value = document.documentElement.scrollTop
      console.log(y.value)
    }) */

    const { y } = useWindowScroll()
    return { y }
  }

}
</script>

<style lang='less' scoped>
.app-header-sticky {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 80px;
  background-color: #fff;
  transform: translateY(-100%);
  opacity: 0;
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }
  .container {
    display: flex;
    align-items: center;
    height: 100%;
    .logo {
      width: 200px;
      height: 100%;
      background: url(~@/assets/images/logo.png) no-repeat right 20px / 160px
        auto;
    }
    .right {
      display: flex;
      text-align: center;
      padding-left: 40px;
      width: 220px;
      border-left: 2px solid @xtxColor;
      a {
        width: 38px;
        margin-right: 40px;
        font-size: 16px;
        line-height: 1;
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
