<template>
  <div class="goods-detail">
    <ul class="attrs">
      <li v-for="item in goodsInfo.details.properties" :key="item.value">
        <span class="name">{{ item.name }}：</span>
        <span class="value">{{ item.value }}</span>
      </li>
    </ul>
    <img v-for="item in goodsInfo.details.pictures" :key="item" :src="item" />
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'GoodsDetail',

  setup () {
    const goodsInfo = inject('goodsInfo')

    return { goodsInfo }
  }
}
</script>

<style lang='less' scoped>
.goods-detail {
  padding: 40px;
  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;
      .name {
        width: 100px;
        color: #999;
      }
      .value {
        flex: 1;
        color: #666;
      }
    }
  }
  img {
    width: 100%;
  }
}
</style>
