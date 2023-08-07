<template>
  <div class="cart-none">
    <img src="@/assets/images/none.png" />
    <p>购物车内暂时没有商品</p>
    <div class="btn">
      <xtx-button type="primary" @click="$router.push('/')">
        继续逛逛
      </xtx-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartNone'
}
</script>

<style lang='less' scoped>
.cart-none {
  padding: 150px 0;
  text-align: center;
  img {
    width: 180px;
  }
  p {
    color: #999;
    padding: 20px 0;
  }
}
</style>
