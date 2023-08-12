<template>
  <div v-if="order" class="member-order-detail">
    <detail-action :order="order" />
    <!-- 进度条 -->
    <detail-steps :order="order" />
    <!-- 商品信息 -->
    <detail-info :order="order" />
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action.vue'
import { ref } from 'vue'
import DetailSteps from './components/detail-steps.vue'
import DetailInfo from './components/detail-info.vue'
export default {
  name: 'MemberOrderDetail',

  components: { DetailAction, DetailSteps, DetailInfo },

  setup () {
    const route = useRoute()
    const order = ref(null)
    getOrderDetail(route.params.id).then(data => {
      order.value = data.result
      console.log(order.value)
    })

    return { order }
  }
}
</script>

<style lang='less' scoped>
.member-order-detail {
  background-color: #fff;
}
</style>
