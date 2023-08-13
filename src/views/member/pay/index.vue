<template>
  <div class="pay-page">
    <div class="container">
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <xtx-bread-item to="/cart">购物车</xtx-bread-item>
        <xtx-bread-item>支付订单</xtx-bread-item>
      </xtx-bread>
      <template v-if="order">
        <!-- 付款信息 -->
        <div class="pay-info">
          <span class="icon iconfont icon-queren2"></span>
          <div class="tip">
            <p>订单提交成功！请尽快完成支付。</p>
            <p v-if="order.countdown > -1">
              支付还剩 <span>{{ timeText }}</span
              >, 超时后将取消订单
            </p>
            <p v-else>订单已超时</p>
          </div>
          <div class="amount">
            <span>应付总额：</span>
            <span>&yen;{{ order.payMoney }}</span>
          </div>
        </div>
        <div class="pay-type">
          <p class="head">请选择支付方式</p>
          <div class="item">
            <a class="btn wx" href="javascript:;"></a>
            <a class="btn alipay" href="javascript:;"></a>
          </div>
          <div class="item">
            <a class="btn" href="javascript:;">招商银行</a>
            <a class="btn" href="javascript:;">工商银行</a>
            <a class="btn" href="javascript:;">建设银行</a>
            <a class="btn" href="javascript:;">农业银行</a>
            <a class="btn" href="javascript:;">交通银行</a>
          </div>
        </div>
      </template>
      <div v-else class="loading"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetail } from '@/api/order'
import { useCountdown } from '@/hooks'
import { baseURL } from '@/utils/request'
export default {
  name: 'PayPage',

  setup () {
    const route = useRoute()

    const order = ref(null)
    const { start, timeText } = useCountdown()

    getOrderDetail(route.query.id).then(data => {
      order.value = data.result
      if (data.result.countdown > -1) {
        start(data.result.countdown)
      }
    })

    // 支付地址
    const redirect = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')
    const payUrl = `${baseURL}/pay/aliPay?orderId=${route.query.id}&redirect=${redirect}`

    return { order, timeText, payUrl }
  }
}
</script>

<style lang='less' scoped>
.pay-info {
  display: flex;
  align-items: center;
  padding: 0 80px;
  height: 240px;
  background-color: #fff;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    flex: 1;
    padding-left: 10px;
    p {
      &:first-child {
        margin-bottom: 5px;
        font-size: 20px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  padding-bottom: 70px;
  background-color: #fff;
  .head {
    padding-left: 30px;
    margin-bottom: 30px;
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    border-bottom: 1px solid #f5f5f5;
  }
  .item {
    margin-bottom: 10px;
    .btn {
      display: inline-block;
      margin-left: 30px;
      width: 150px;
      height: 50px;
      border: 1px solid #e4e4e4;
      text-align: center;
      line-height: 48px;
      color: #666;
      &.active,
      &:hover {
        border-color: @xtxColor;
      }
      &.alipay {
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
          no-repeat center / contain;
      }
      &.wx {
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
          no-repeat center / contain;
      }
    }
  }
}
.loading {
  width: 100%;
  height: 500px;
  background: #fff url(~@/assets/images/loading.gif) no-repeat center / 200px
    356px;
}
</style>
