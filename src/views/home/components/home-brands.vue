<template>
  <div class="home-brands">
    <home-panel title="热门品牌" subTitle="国际经典 品质保证">
      <template #right>
        <a
          href="javascript:;"
          class="iconfont icon-angle-left prev"
          :class="{ disabled: currentPage === 1 }"
          @click="currentPage--"
        />
        <a
          href="javascript:;"
          class="iconfont icon-angle-right next"
          :class="{ disabled: currentPage * 5 >= brands.length }"
          @click="currentPage++"
        />
      </template>
      <div ref="box" class="box">
        <transition name="fade">
          <ul
            v-if="brands.length"
            class="brands-list"
            :class="{ step: currentPage === 2 }"
          >
            <li v-for="item in brands" :key="item.id">
              <router-link to="/">
                <img v-lazy="item.picture" />
              </router-link>
            </li>
          </ul>
          <div v-else class="skeleton">
            <xtx-skeleton
              v-for="i in 5"
              :key="i"
              animated
              bg="#e4e4e4"
              width="240px"
              height="305px"
            />
          </div>
        </transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import { ref } from 'vue'
import homePanel from './home-panel.vue'
import { getBrand } from '@/api/home'
import { useLazyData } from '@/hooks'

export default {
  components: { homePanel },

  setup () {
    const box = ref(null)
    // 品牌列表
    // useLazyData所执行的API函数若需要传参，则将该API函数放在箭头函数中执行并传参，即将此箭头函数作为useLazyData的第二个参数
    const brands = useLazyData(box, () => getBrand(10))

    // 当前页码，用于切换左右按钮样式
    const currentPage = ref(1)

    return { box, brands, currentPage }
  }
}
</script>

<style lang='less' scoped>
.home-panel {
  background-color: #f5f5f5;
  .iconfont {
    display: inline-block;
    margin-left: 5px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    background-color: @xtxColor;
    color: #fff;
    &.disabled {
      background-color: #ccc;
      pointer-events: none;
    }
  }
  .box {
    padding-bottom: 40px;
    overflow: hidden;
    .brands-list {
      display: flex;
      width: 200%;
      transition: all 0.8s;
      &.step {
        transform: translateX(-50%);
      }
      li {
        width: 240px;
        height: 305px;
        margin-right: 10px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .xtx-skeleton {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
