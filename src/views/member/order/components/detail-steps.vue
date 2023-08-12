<template>
  <div class="detail-steps" style="padding: 20px">
    <xtx-steps
      :active="order.orderState === 6 ? 1 : order.orderState"
      :class="{ cancel: order.orderState === 6 }"
    >
      <xtx-steps-item
        :title="order.orderState === 6 ? '订单已取消' : '提交订单'"
        :desc="order.orderState === 6 ? order.closeTime : order.createTime"
      />
      <xtx-steps-item
        :title="order.payType === 1 ? '付款成功' : '货到付款'"
        :desc="order.payTime"
      />
      <xtx-steps-item title="商品发货" :desc="order.consignTime" />
      <xtx-steps-item title="确认收货" :desc="order.evaluationTime" />
      <xtx-steps-item title="订单完成" :desc="order.endTime" />
    </xtx-steps>
  </div>
</template>

<script>
export default {
  name: 'DetailSteps',

  props: {
    order: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.cancel {
  :deep .active {
    .step {
      > span {
        background-color: @helpColor;
        color: #fff;
        border-color: @helpColor;
      }
      &::before,
      &::after {
        background-color: @helpColor;
      }
    }
    .title {
      color: @helpColor;
    }
  }
}
</style>
