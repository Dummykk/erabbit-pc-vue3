<template>
  <div class="member-home">
    <!-- 概览 -->
    <home-overview />
    <!-- 收藏 -->
    <home-panel title="我的收藏">
      <goods-item v-for="item in collectGoods" :key="item.id" :good="item" />
    </home-panel>
    <!-- 足迹 -->
    <home-panel title="我的足迹">
      <goods-item v-for="item in historyGoods" :key="item.id" :good="item" />
    </home-panel>
    <!-- 猜你 -->
    <goods-relevant>猜你喜欢</goods-relevant>
  </div>
</template>
<script>
import HomeOverview from './components/home-overview'
import HomePanel from './components/home-panel'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { ref } from 'vue'
import { getCollect, getHistory } from '@/api/index'

export default {
  name: 'MemberHome',
  components: {
    HomeOverview,
    HomePanel,
    GoodsRelevant,
    GoodsItem
  },

  setup () {
    // 调用模拟的接口
    const collectGoods = ref([])
    getCollect({
      page: 1,
      pageSize: 4
    }).then(data => {
      collectGoods.value = data.result.items
    })

    const historyGoods = ref([])
    getHistory({
      page: 1,
      pageSize: 4
    }).then(data => {
      historyGoods.value = data.result.items
    })

    return { collectGoods, historyGoods }
  }
}
</script>
<style scoped lang="less">
.goods-relevant {
  :deep .xtx-carousel .carousel-btn.prev {
    left: 0px;
  }
  :deep .xtx-carousel .carousel-btn.next {
    right: 0px;
  }
}
</style>
