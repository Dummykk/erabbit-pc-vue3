<template>
  <div class="goods-item">
    <router-link class="image" :to="`/product/${good.id}`">
      <img v-lazy="good.picture" />
    </router-link>
    <p class="name ellipsis-2">{{ good.name }}</p>
    <p class="desc ellipsis">{{ good.tag }}</p>
    <p class="price">&yen;{{ good.price }}</p>
    <div class="extra">
      <router-link to="">
        <span>找相似</span>
        <span>发现现多宝贝 &gt;</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeGoods',

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
  position: relative;
  padding: 10px 30px;
  width: 240px;
  height: 300px;
  border: 1px solid transparent;
  overflow: hidden;
  transition: all 0.5s;
  .image {
    display: block;
    margin: 0 auto;
    width: 160px;
    height: 160px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    margin-top: 6px;
    font-size: 16px;
    &.name {
      height: 44px;
    }
    &.desc {
      color: #666;
      height: 22px;
    }
    &.price {
      margin-top: 10px;
      font-size: 20px;
      color: @priceColor;
    }
  }
  .extra {
    position: absolute;
    left: 0;
    bottom: -86px;
    width: 100%;
    height: 86px;
    text-align: center;
    background-color: @xtxColor;
    transition: all 0.5s;
    span {
      display: block;
      margin: 0 auto;
      width: 120px;
      color: #fff;
      line-height: 30px;
      &:first-child {
        font-size: 18px;
        border-bottom: 1px solid #fff;
        line-height: 40px;
        margin-top: 5px;
      }
    }
  }
  &:hover {
    border-color: @xtxColor;
    .extra {
      bottom: 0;
    }
  }
}
</style>
