<template>
  <div class="member-order-page">
    <xtx-tabs v-model="activeName" @tab-click="clickTab">
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <!-- 订单列表 -->
        <div class="order-list">
          <div v-if="loading" class="loading"></div>
          <div v-if="!loading && orderList.length === 0" class="none">
            暂无数据
          </div>
          <order-item
            v-for="item in orderList"
            :key="item.id"
            :order="item"
            @on-cancel-order="handlerCancel"
            @on-delete-order="handlerDelete"
          />
        </div>
        <!-- 分页组件 -->
        <xtx-pagination
          v-if="total > requestParams.pageSize"
          :totalData="total"
          :pagesize="requestParams.pageSize"
          :currentPage="requestParams.page"
          @currentPage-change="requestParams.page = $event"
        />
      </xtx-tabs-panel>
    </xtx-tabs>
    <!-- 取消订单组件 -->
    <order-cancel ref="orderCancelCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { confirmReceipt, deleteOrder, getOrderList } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'

export default {
  name: 'MemberOrderPage',
  components: { OrderItem, OrderCancel },
  setup () {
    const activeName = ref('all')

    // 查询订单所需参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    const total = ref(0)
    // 加载状态
    const loading = ref(false)

    // tab切换
    const clickTab = (tab) => {
      requestParams.orderState = tab.index
      requestParams.page = 1
    }

    // 获取订单列表
    const getOrderListFn = () => {
      loading.value = true
      getOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        loading.value = false
        total.value = data.result.counts
      })
    }

    // 初始化时、切换tab时要获取订单
    watch(requestParams, () => {
      getOrderListFn()
    }, { immediate: true })

    // 删除订单
    const handlerDelete = (order) => {
      console.log(order)
      Confirm({ text: '您确定删除该订单吗？' })
        .then(() => {
          deleteOrder([order.id]).then(() => {
            Message({ type: 'success', text: '删除成功' })
            getOrderListFn()
          })
        })
        .catch(e => {})
    }

    return { activeName, orderStatus, orderList, clickTab, loading, requestParams, total, handlerDelete, ...useCancel(), ...useConfirmReceipt() }
  }
}

// 取消订单
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  // 点击取消
  const handlerCancel = order => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// 确认收货
export const useConfirmReceipt = () => {
  const onConfirmReceipt = item => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' })
      .then(() => {
        confirmReceipt(item.id).then(() => {
          Message({ type: 'success', text: '确认收货成功' })
          item.orderState = 4
        })
      })
      .catch(e => {})
  }
  return { onConfirmReceipt }
}
</script>

<style lang='less' scoped>
.order-list {
  position: relative;
  padding: 20px;
  min-height: 400px;
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9) url(~@/assets/images/loading.gif)
    no-repeat center / 200px 356px;
}
.none {
  height: 400px;
  line-height: 400px;
  text-align: center;
  color: #999;
}
</style>
