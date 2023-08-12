<template>
  <div class="cart-page">
    <div class="container">
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <xtx-bread-item>购物车</xtx-bread-item>
      </xtx-bread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <xtx-checkbox
                  :modelValue="$store.getters['cart/isSelectAll']"
                  @changeCheck="checkAll"
                >
                  全选
                </xtx-checkbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr
              v-for="item in $store.getters['cart/validList']"
              :key="item.skuId"
            >
              <td>
                <xtx-checkbox
                  :modelValue="item.selected"
                  @changeCheck="checkOne(item.skuId, $event)"
                />
              </td>
              <td>
                <div class="goods">
                  <router-link :to="`/product/${item.id}`">
                    <img :src="item.picture" />
                  </router-link>
                  <div class="info">
                    <router-link
                      class="name ellipsis"
                      :to="`/product/${item.id}`"
                    >
                      {{ item.name }}
                    </router-link>
                    <cart-sku
                      :attrsText="item.attrsText"
                      :skuId="item.skuId"
                      @change="changeSku(item.skuId, $event)"
                    />
                  </div>
                </div>
              </td>
              <td class="price">
                <p>&yen;{{ (+item.nowPrice).toFixed(2) }}</p>
                <p v-if="item.price - item.nowPrice > 0">
                  比加入时降价
                  <span class="red">
                    &yen;{{ (item.price - item.nowPrice).toFixed(2) }}
                  </span>
                </p>
              </td>
              <td class="num">
                <xtx-numbox
                  :modelValue="item.count"
                  @changeNum="changeNum(item.skuId, $event)"
                />
              </td>
              <td class="sum">
                <p class="red f16">
                  &yen;{{
                    ((item.count * item.nowPrice * 100) / 100).toFixed(2)
                  }}
                </p>
              </td>
              <td class="op">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    href="javascript:;"
                    class="orange"
                    @click="deleteOne(item.skuId)"
                  >
                    删除
                  </a>
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
            <tr v-if="!$store.getters['cart/validCount']">
              <td colspan="6">
                <cart-none />
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr>
              <td colspan="6" class="invalid">失效商品</td>
            </tr>
            <tr
              v-for="item in $store.getters['cart/invalidList']"
              :key="item.skuId"
            >
              <td>
                <!-- <xtx-checkbox /> -->
                <p v-if="item.stock === 0">无库存</p>
                <p v-if="!item.isEffective">已下架</p>
              </td>
              <td>
                <div>
                  <router-link class="goods" to="/">
                    <img :src="item.picture" />
                    <div class="info">
                      <p class="name ellipsis">{{ item.name }}</p>
                      <p class="attr">{{ item.attrsText }}</p>
                    </div>
                  </router-link>
                </div>
              </td>
              <td class="price">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="num">1</td>
              <td class="sum">
                <p class="red f16">
                  &yen;{{
                    ((item.count * item.nowPrice * 100) / 100).toFixed(2)
                  }}
                </p>
              </td>
              <td class="op">
                <p>
                  <a
                    href="javascript:;"
                    class="orange"
                    @click="deleteOne(item.skuId)"
                  >
                    删除
                  </a>
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 底部操作栏 -->
      <div class="action">
        <div class="left">
          <xtx-checkbox
            :modelValue="$store.getters['cart/isSelectAll']"
            @changeCheck="checkAll"
          >
            全选
          </xtx-checkbox>
          <a href="javascript:;" @click="batchDelete(false)">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDelete(true)">清空失效商品</a>
        </div>
        <div class="right">
          共{{ $store.getters['cart/validCount'] }}件商品，已选择{{
            $store.getters['cart/selectedCount']
          }}件，商品合计：<span class="total">{{
            $store.getters['cart/selectedAmount']
          }}</span>
          <xtx-button type="primary" @click="goCheckout">下单结算</xtx-button>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <goods-relevant>猜你喜欢</goods-relevant>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import GoodsRelevant from '../goods/components/goods-relevant.vue'
import CartNone from './components/cart-none.vue'
import Confirm from '@/components/library/Confirm'
import CartSku from './components/cart-sku.vue'
import Message from '@/components/library/Message'
import router from '@/router'

export default {
  name: 'CartPage',

  components: {
    GoodsRelevant,
    CartNone,
    CartSku
  },

  setup () {
    const store = useStore()

    // 单选
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/changeGoods', { skuId, selected })
    }

    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllGoods', selected)
    }

    // 删除商品
    const deleteOne = (skuId) => {
      Confirm({ text: '您确认从购物车删除该商品吗？' })
        .then(() => {
          store.dispatch('cart/deleteGoods', skuId)
        }
        )
        .catch(e => {})
    }

    // 批量删除
    const batchDelete = (isClear) => {
      Confirm({ text: `您确定从购物车删除${isClear ? '失效' : '选中'}的商品吗？` })
        .then(() => {
          store.dispatch('cart/batchDeleteGoods', isClear)
        })
        .catch(e => {})
    }

    // 修改数量
    const changeNum = (skuId, count) => {
      store.dispatch('cart/changeGoods', { skuId, count })
    }

    // 修改规格
    const changeSku = (oldSkuId, newSku) => {
      store.dispatch('cart/changeGoodsSku', { oldSkuId, newSku })
        .then(() => { Message({ type: 'success', text: '修改规格成功' }) })
        .catch(e => { Message({ type: 'error', text: e.message }) })
    }

    // 下单结算
    const goCheckout = () => {
      // 1. 判断是否选择有效商品
      // 2. 判断是否已经登录，未登录 弹窗提示
      // 3. 进行跳转 （需要做访问权限控制）
      if (store.getters['cart/selectedCount'] === 0) {
        return Message({ type: 'error', text: '请选择要下单的商品' })
      }
      if (!store.state.user.profile.token) {
        Confirm({ text: '您尚未登录，请先登录！' })
          .then(() => {
            router.push('/member/checkout')
          })
          .catch(e => {})
      } else {
        router.push('/member/checkout')
      }
    }

    return { checkOne, checkAll, deleteOne, batchDelete, changeNum, changeSku, goCheckout }
  }
}
</script>

<style lang='less' scoped>
.cart {
  background-color: #fff;
  color: #666;
  table {
    border-spacing: 0;
    border-collapse: collapse;
    line-height: 24px;
    th,
    td {
      padding: 10px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        padding-left: 30px;
        text-align: left;
        color: #999;
      }
      ~ th,
      ~ td {
        text-align: center;
      }
    }
    .xtx-numbox {
      margin: 0 auto;
      width: 120px;
      .label {
        padding-left: 0;
        width: 0;
      }
    }
    .red {
      color: @priceColor;
    }
    .orange {
      color: @helpColor;
    }
    .f16 {
      font-size: 16px;
    }
    .invalid {
      padding-top: 30px;
      font-size: 16px;
      line-height: 40px;
      color: #666 !important;
    }
    th {
      font-size: 16px;
      font-weight: normal;
      line-height: 50px;
    }
    .goods {
      display: flex;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
      }
      .info {
        padding-left: 10px;
        text-align: left;
        width: 280px;
        color: #666;
        font-size: 16px;
        .attr {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}
.action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 30px;
  height: 80px;
  font-size: 16px;
  background-color: #fff;
  .left {
    .xtx-checkbox {
      color: #999;
    }
    a {
      margin-left: 20px;
    }
  }
  .right {
    .total {
      margin-right: 30px;
      color: @priceColor;
    }
  }
}
</style>
