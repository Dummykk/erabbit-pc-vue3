<template>
  <header class="app-header">
    <div class="container">
      <h1 class="logo"><router-link to="/"></router-link></h1>
      <app-header-nav />
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>
      <app-header-cart />
    </div>
  </header>
</template>

<script>
import AppHeaderNav from '@/components/app-header-nav'
import AppHeaderCart from './app-header-cart.vue'

export default {
  components: {
    AppHeaderNav,
    AppHeaderCart
  }
}
</script>

<style lang='less' scoped>
.app-header {
  height: 132px;
  background-color: #fff;
  .container {
    display: flex;
    align-items: center;
    .logo {
      height: 132px;
      a {
        display: inline-block;
        width: 200px;
        height: 100%;
        background: url(~@/assets/images/logo.png) no-repeat center 16px /
          contain;
      }
    }
    .search {
      width: 170px;
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #e7e7e7;
      margin-right: 5px;
      i {
        font-size: 18px;
      }
      input {
        width: 140px;
        height: 18px;
        color: #666;
      }
    }
    .cart {
      width: 50px;
      text-align: center;
      a {
        position: relative;
        display: block;
        height: 32px;
        i {
          font-size: 22px;
        }
        em {
          position: absolute;
          top: 0;
          right: 0;
          font-style: normal;
          width: 20px;
          height: 14px;
          line-height: 14px;
          text-align: center;
          font-size: 12px;
          color: #fff;
          background-color: @helpColor;
          border-radius: 50%;
          font-family: Arial;
        }
      }
    }
  }
}
</style>
