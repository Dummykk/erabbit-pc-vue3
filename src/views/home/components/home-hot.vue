<template>
  <div class="home-hot">
    <home-panel :title="'人气推荐'" :subTitle="'人气爆款 不容错过'">
      <div ref="target" style="position: relative; height: 426px">
        <transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <a href="javascript:;">
                <img v-lazy="item.picture" />
                <p class="title">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </a>
            </li>
          </ul>
          <home-skeleton v-else />
        </transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { getHot } from '@/api/home'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeHot',

  components: {
    HomePanel,
    HomeSkeleton
  },

  setup () {
    const target = ref(null)
    const goods = useLazyData(target, getHot)
    return { target, goods }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 100%;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
