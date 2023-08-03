<template>
  <div class="goods-page" v-if="goodsInfo">
    <div class="container">
      <!-- 面包屑 -->
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <xtx-bread-item
          v-if="goodsInfo"
          :to="`/category/${goodsInfo.categories[1].id}`"
        >
          {{ goodsInfo.categories[1].name }}
        </xtx-bread-item>
        <xtx-bread-item
          v-if="goodsInfo"
          :to="`/category/sub/${goodsInfo.categories[0].id}`"
        >
          {{ goodsInfo.categories[0].name }}
        </xtx-bread-item>
        <xtx-bread-item v-if="goodsInfo">{{ goodsInfo.name }}</xtx-bread-item>
      </xtx-bread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images="goodsInfo.mainPictures" />
          <goods-sales />
        </div>
        <div class="spec">
          <goods-name :goods="goodsInfo" />
          <goods-sku :goods="goodsInfo" @change="changeSku" />
          <xtx-numbox label="数量" v-model="num" />
          <xtx-button type="primary" style="margin-top: 20px"
            >加入购物车</xtx-button
          >
        </div>
      </div>
      <!-- 相关商品推荐 -->
      <goods-relevant :goodsId="goodsInfo.id" />
      <!-- 商品详情 热榜 -->
      <div class="goods-footer">
        <div class="goods-left">
          <!-- 详情+评价 -->
          <div class="goods-tab">
            <goods-tabs />
          </div>
          <!-- 详情+评价 -->
          <!-- 注意事项 -->
          <div class="goods-tips">
            <goods-tips />
          </div>
          <!-- 注意事项 -->
        </div>
        <!-- 热榜 -->
        <div class="hot-list">
          <goods-hot type="1" :goodsId="goodsInfo.id" />
          <goods-hot type="2" :goodsId="goodsInfo.id" />
        </div>
        <!-- 热榜 -->
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import { useRoute } from 'vue-router'
import { getGoodsDetail } from '@/api/product'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsTips from './components/goods-tips.vue'

export default {
  name: 'GoodsPage',

  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsTips
  },

  setup () {
    const goodsInfo = getGoodsInfo()

    provide('goodsInfo', goodsInfo)

    // sku改变时触发
    const changeSku = (sku) => {
      if (sku.skuId) {
        goodsInfo.value.price = sku.price
        goodsInfo.value.oldPrice = sku.oldPrice
        goodsInfo.value.inventory = sku.inventory
      }
    }

    const num = ref(1)

    return { goodsInfo, changeSku, num }
  }
}

const getGoodsInfo = () => {
  const goodsInfo = ref(null)
  const route = useRoute()

  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      getGoodsDetail(route.params.id).then(data => {
        goodsInfo.value = null
        nextTick(() => {
          goodsInfo.value = data.result
        })
      })
    }
  }, { immediate: true })
  return goodsInfo
}
</script>

<style lang='less' scoped>
.goods-info {
  min-height: 600px;
  background-color: #fff;
  display: flex;
  .media {
    padding: 30px 50px;
    width: 580px;
    height: 600px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-left {
    margin-right: 20px;
    width: 940px;
    .goods-tab {
      min-height: 600px;
      background-color: #fff;
    }
    .goods-tips {
      margin-top: 20px;
      min-height: 600px;
      background-color: #fff;
    }
  }
  .hot-list {
    width: 280px;
    min-height: 1000px;
  }
}
</style>
