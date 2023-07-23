<template>
  <div class="home-page">
    <div class="container">
      <!-- 左侧分类 -->
      <home-category />
      <!-- 轮播图 -->
      <home-banner />
    </div>
    <!-- 新鲜好物 -->
    <home-new />
    <!-- 人气推荐 -->
    <home-hot />
    <!-- 热门品牌 -->
    <home-brands />
    <!-- 产品区块 -->
    <home-products />
    <!-- 最新专题 -->
    <home-special />
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrands from './components/home-brands.vue'
import HomeProducts from './components/home-products.vue'
import HomeSpecial from './components/home-special.vue'

export default {
  name: 'HomePage',

  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrands,
    HomeProducts,
    HomeSpecial
  }
}
</script>

<style lang='less' scoped>
</style>
