<template>
  <div class="pay-checkout-page">
    <div class="container">
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <xtx-bread-item to="/cart">购物车</xtx-bread-item>
        <xtx-bread-item>填写订单</xtx-bread-item>
      </xtx-bread>
      <div class="wrapper" v-if="orderInfo">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <checkout-address
            :addressList="orderInfo.userAddresses"
            @on-success="changeAddress"
            @del-success="deleteAddress"
          />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderInfo.goods" :key="item.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.payPrice }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a
            class="my-btn"
            :class="{ active: requestParams.deliveryTimeType === 1 }"
            href="javascript:;"
            @click="requestParams.deliveryTimeType = 1"
          >
            不限送货时间：周一至周日
          </a>

          <a
            class="my-btn"
            :class="{ active: requestParams.deliveryTimeType === 2 }"
            href="javascript:;"
            @click="requestParams.deliveryTimeType = 2"
          >
            工作日送货：周一至周五
          </a>
          <a
            class="my-btn"
            :class="{ active: requestParams.deliveryTimeType === 3 }"
            href="javascript:;"
            @click="requestParams.deliveryTimeType = 3"
          >
            双休日、假日送货：周六至周日
          </a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a
            class="my-btn"
            :class="{ active: requestParams.payType === 1 }"
            href="javascript:;"
            @click="requestParams.payType = 1"
          >
            在线支付
          </a>
          <a
            class="my-btn"
            :class="{ active: requestParams.payType === 2 }"
            href="javascript:;"
            @click="requestParams.payType = 2"
          >
            货到付款
          </a>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ orderInfo.summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>&yen;{{ orderInfo.summary.totalPrice }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>&yen;{{ orderInfo.summary.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">&yen;{{ orderInfo.summary.totalPayPrice }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <xtx-button type="primary" @click="submit">提交订单</xtx-button>
        </div>
      </div>
      <div v-else class="loading"></div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import checkoutAddress from './components/checkout-address.vue'
import { getOrderInfo, repurchaseGoods, submitOrder } from '@/api/order'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
import { useStore } from 'vuex'

export default {
  name: 'PayCheckoutPage',

  components: { checkoutAddress },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // 提交订单所需的字段
    const requestParams = reactive({
      addressId: null, // 所选地址Id
      deliveryTimeType: 1, // 配送时间类型，1为不限，2为工作日，3为双休或假日
      payType: 1, // 支付方式，1为在线支付，2为货到付款
      buyerMessage: '', // 买家留言
      goods: [] // 商品集合
    })

    // 获取订单信息
    const orderInfo = ref(null)
    if (route.query.orderId) {
      // 再次购买结算
      repurchaseGoods(route.query.orderId).then(data => {
        orderInfo.value = data.result
        requestParams.goods = orderInfo.value.goods.map(item => {
          return { skuId: item.skuId, count: item.count }
        })
      })
    } else {
      getOrderInfo()
        .then(data => {
          orderInfo.value = data.result
          requestParams.goods = orderInfo.value.goods.map(item => {
            return { skuId: item.skuId, count: item.count }
          })
        })
    }

    // .catch(e => {
    //   // router.push('/cart')
    // })

    // 添加/切换地址成功
    const changeAddress = (id) => {
      requestParams.addressId = id
    }

    // 删除地址成功
    const deleteAddress = (id) => {
      const index = orderInfo.value.userAddresses.findIndex(item => item.id === id)
      orderInfo.value.userAddresses.splice(index, 1)
    }

    // 提交订单
    const submit = () => {
      if (!requestParams.addressId) {
        return Message({ type: 'warn', text: '请选择收货地址' })
      }
      submitOrder(requestParams).then(data => {
        if (data.result.payType === 1) {
          router.push({
            path: '/member/pay',
            query: { id: data.result.id }
          })
        } else {
          Confirm({ text: '您选择的是货到付款，请确认收货后再付款哦' })
            .then(() => {
              router.push('/cart')
            })
            .catch(e => { router.push('/cart') })
        }
        store.dispatch('cart/updateCart')
      })
    }
    return { orderInfo, changeAddress, requestParams, deleteAddress, submit }
  }
}
</script>

<style lang='less' scoped>
.pay-checkout-page {
  .wrapper {
    background-color: #fff;
    padding: 0 20px;
    .box-title {
      padding-left: 10px;
      font-size: 16px;
      font-weight: normal;
      line-height: 70px;
      border-bottom: 1px solid #ddd;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align-last: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background-color: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  display: inline-block;
  margin-right: 25px;
  width: 228px;
  height: 50px;
  line-height: 48px;
  text-align: center;
  border: 1px solid #e4e4e4;
  color: #666;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2rem;
      }
    }
    dd {
      padding-right: 70px;
      width: 240px;
      text-align: right;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  padding: 60px;
  text-align: right;
  border-top: 1px solid #ddd;
}
.loading {
  width: 100%;
  height: 500px;
  background: #fff url(~@/assets/images/loading.gif) no-repeat center / 100px
    100px;
}
</style>
