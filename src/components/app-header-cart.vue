<template>
  <div class="app-header-cart">
    <router-link to="/cart" class="cart">
      <i class="iconfont icon-cart"></i>
      <em>{{ $store.getters['cart/validCount'] }}</em>
    </router-link>
    <div
      class="layer"
      v-if="$store.getters['cart/validCount'] && $route.path !== '/cart'"
    >
      <div class="list">
        <div
          class="item"
          v-for="item in $store.getters['cart/validList']"
          :key="item.skuId"
        >
          <router-link :to="`/product/${item.id}`">
            <img :src="item.picture" />
            <div class="center">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="attr ellipsis">{{ item.attrsText }}</p>
            </div>
            <div class="right">
              <p class="price">&yen;{{ item.nowPrice }}</p>
              <p class="count">×{{ item.count }}</p>
            </div>
          </router-link>
          <i class="iconfont icon-close-new" @click="deleteGoods(item.skuId)" />
        </div>
      </div>
      <div class="footer">
        <div class="total">
          <p>共{{ $store.getters['cart/validCount'] }}件商品</p>
          <p>&yen;{{ $store.getters['cart/validAmount'] }}</p>
        </div>
        <xtx-button type="plain" @click="$router.push('/cart')">
          去购物车结算
        </xtx-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import Message from './library/Message'
export default {
  name: 'AppHeaderCart',

  setup () {
    // 组件初始化时更新商品信息
    const store = useStore()
    store.dispatch('cart/updateCart')

    // 删除购物车商品
    const deleteGoods = (skuId) => {
      store.dispatch('cart/deleteGoods', skuId)
        .then(() => {
          Message({ type: 'success', text: '删除成功' })
        })
        .catch(e => {
          Message({ type: 'error', text: '删除失败' })
        })
    }

    return { deleteGoods }
  }
}
</script>

<style lang='less' scoped>
.app-header-cart {
  width: 50px;
  position: relative;
  z-index: 500;
  .cart {
    display: block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    .iconfont {
      font-size: 22px;
    }
    em {
      position: absolute;
      right: 0;
      top: 0;
      padding: 1px 6px;
      line-height: 1;
      font-style: normal;
      background-color: @helpColor;
      color: #fff;
      font-size: 12px;
      border-radius: 10px;
      font-family: Arial;
    }
  }
  &:hover {
    .layer {
      opacity: 1;
      transform: none;
    }
  }
  .layer {
    position: absolute;
    top: 50px;
    right: 0;
    padding-top: 10px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    border-radius: 4px;
    opacity: 0;
    transform: translateY(-200px) scaleY(0);
    transition: all 0.4s 0.2s;
    &::before {
      content: '';
      position: absolute;
      right: 14px;
      top: -10px;
      width: 20px;
      height: 20px;
      background-color: #fff;
      transform: scale(0.6, 1) rotate(45deg);
      box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.1);
    }
    .list {
      height: 310px;
      overflow: auto;
      padding: 0 10px;
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      &::-webkit-scrollbar-track {
        background: #f8f8f8;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #eee;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }
      .item {
        position: relative;
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;
        i {
          position: absolute;
          bottom: 38px;
          right: 0;
          opacity: 0;
          color: #666;
          transition: all 0.5s;
        }
        &:hover {
          i {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
      a {
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
        }
        .center {
          padding: 0 10px;
          width: 200px;
          .name {
            font-size: 16px;
          }
          .attr {
            color: #999;
            padding-top: 5px;
          }
        }
        .right {
          width: 100px;
          padding-right: 20px;
          text-align: center;
          .price {
            font-size: 16px;
            color: @priceColor;
          }
          .count {
            margin-top: 5px;
            font-size: 16px;
            color: #999;
          }
        }
      }
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 70px;
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      background: #f8f8f8;
      align-items: center;
      .total {
        padding-left: 10px;
        color: #999;
        p {
          &:last-child {
            font-size: 18px;
            color: @priceColor;
          }
        }
      }
    }
  }
}
</style>
