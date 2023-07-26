<template>
  <router-link class="goods-item" :to="`/product/${good.id}`">
    <img :src="good.picture" />
    <p class="name ellipsis">{{ good.name }}</p>
    <p class="desc ellipsis">{{ good.desc }}</p>
    <p class="price">&yen;{{ good.price }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'GoodsName',

  props: {
    good: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.goods-item {
  display: block;
  padding: 20px 30px;
  width: 220px;
  height: 300px;
  text-align: center;
  .hoverShadow();
  img {
    width: 160px;
    height: 160px;
  }
  p {
    padding-top: 10px;
    &.name {
      font-size: 16px;
    }
    &.desc {
      color: #999;
    }
    &.price {
      font-size: 20px;
      color: @priceColor;
    }
  }
}
</style>
