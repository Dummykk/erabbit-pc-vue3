<template>
  <div class="home-new">
    <home-panel :title="'新鲜好物'" :subTitle="'新鲜出炉 品质靠谱'">
      <template #right><xtx-more /></template>
      <div ref="box" style="position: relative; height: 406px">
        <transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <router-link :to="`/product/${item.id}`">
                <img v-lazy="item.picture" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </router-link>
            </li>
          </ul>
          <home-skeleton v-else bg="#f0f9f4" />
        </transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import { getNew } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeNew',

  components: {
    HomePanel,
    HomeSkeleton
  },

  setup () {
    const box = ref(null)
    const goods = useLazyData(box, getNew)
    return { goods, box }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 100%;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
