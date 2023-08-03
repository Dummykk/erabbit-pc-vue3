<template>
  <p class="g-name">{{ goods.name }}</p>
  <p class="g-desc">{{ goods.desc }}</p>
  <p class="g-price">
    <span>{{ goods.price }}</span>
    <span>{{ goods.oldPrice }}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <dd>至</dd>
      <xtx-city :fullLocation="fullLocation" @completeAddr="showAddr" />
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'GoodsName',

  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },

  setup (props) {
    const provinceCode = ref('')
    const cityCode = ref('')
    const countyCode = ref('')
    const fullLocation = ref('')

    // 有默认地址
    if (props.goods.userAddress) {
      const defaultAddr = props.goods.userAddress.find(addr => addr.isDefault === 1)
      if (defaultAddr) {
        provinceCode.value = defaultAddr.provinceCode
        cityCode.value = defaultAddr.cityCode
        countyCode.value = defaultAddr.countyCode
        fullLocation.value = defaultAddr.fullLocation
      }
    }

    const showAddr = (addr) => {
      provinceCode.value = addr.provinceCode
      cityCode.value = addr.cityCode
      countyCode.value = addr.countyCode
      fullLocation.value = addr.fullLocation
    }

    return { fullLocation, showAddr }
  }
}
</script>

<style lang='less' scoped>
.g-name {
  font-size: 22px;
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: '¥';
      font-size: 14px;
    }
    &:first-child {
      margin-right: 10px;
      font-size: 22px;
      color: @priceColor;
    }
    &:last-child {
      color: #999;
      font-size: 16px;
      text-decoration: line-through;
    }
  }
}
.g-service {
  margin-top: 10px;
  padding: 20px 10px 0 10px;
  background-color: #f5f5f5;
  width: 500px;
  dl {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
    }
    &:last-child {
      span {
        margin-right: 10px;
        &::before {
          content: '•';
          margin-right: 2px;
          color: @xtxColor;
        }
      }
      a {
        color: @xtxColor;
      }
    }
  }
}
</style>
