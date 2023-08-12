<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span>
          {{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}
        </li>
      </ul>
      <a
        href="javascript:;"
        v-if="showAddress"
        @click="openAddressEdit(showAddress)"
      >
        修改地址
      </a>
    </div>
    <div class="action">
      <xtx-button size="small" class="btn" @click="openAddressChange">
        切换地址
      </xtx-button>
      <xtx-button size="small" class="btn" @click="openAddressEdit">
        添加地址
      </xtx-button>
    </div>
  </div>

  <address-change
    ref="addressChange"
    :addressList="addressList"
    :showAddress="showAddress"
    @on-success="successChange"
    @del-success="successDelete"
  />

  <address-edit ref="addressEdit" @on-success="successEdit" />
</template>

<script>
import { ref } from 'vue'
import addressEdit from './address-edit.vue'
import AddressChange from './address-change.vue'
import Message from '@/components/library/Message'
export default {
  components: { addressEdit, AddressChange },
  name: 'CheckoutAddress',

  props: {
    addressList: {
      type: Array,
      default: () => []
    }
  },

  emits: ['on-success'],

  setup (props, { emit }) {
    // 初始显示默认地址
    const showAddress = ref(null)
    if (props.addressList.length) {
      const defaultAddress = props.addressList.find(addr => addr.isDefault === 0)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.addressList[0]
      }
    }

    // 对话框显示隐藏
    const dialogVisible = ref(false)

    // 地址组件初始化时，向父组件传递地址id，用于提交订单
    emit('on-success', showAddress.value?.id)

    // 打开切换地址对话框
    const addressChange = ref(null)
    const openAddressChange = () => {
      if (props.addressList.length) {
        addressChange.value.open()
      } else {
        Message({ type: 'warn', text: '暂无收货地址，请先添加' })
      }
    }

    // 切换地址成功
    const successChange = (addr) => {
      showAddress.value = addr
      emit('on-success', addr.id)
    }

    // 打开添加地址对话框
    const addressEdit = ref(null)
    const openAddressEdit = (initData) => {
      addressEdit.value.open(initData)
    }

    // 添加/修改地址成功
    const successEdit = (formData) => {
      const editAddress = props.addressList.find(item => item.id === formData.id)
      if (editAddress) {
        // 说明是修改地址
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        // 说明是添加地址
        // 需要克隆，不然使用的是对象的引用
        const str = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.addressList.unshift(JSON.parse(str))
        showAddress.value = props.addressList[0]
        emit('on-success', formData.id)
      }
    }

    // 删除地址成功
    const successDelete = (id) => {
      emit('del-success', id)
      if (props.addressList.length && showAddress.value.id === id) {
        showAddress.value = props.addressList[0]
        emit('on-success', props.addressList[0].id)
      }
      if (!props.addressList.length) {
        showAddress.value = null
        emit('on-success', null)
      }
    }

    return { showAddress, dialogVisible, addressEdit, openAddressEdit, addressChange, openAddressChange, successChange, successEdit, successDelete }
  }
}
</script>

<style lang='less' scoped>
.checkout-address {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  .text {
    display: flex;
    align-items: center;
    flex: 1;
    min-height: 90px;
    .none {
      line-height: 90px;
      width: 100%;
      text-align: center;
      color: #999;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          margin-right: 5px;
          color: #999;
          > i {
            display: inline-block;
            width: 0.5rem;
          }
        }
      }
    }
    > a {
      width: 160px;
      height: 90px;
      text-align: center;
      line-height: 90px;
      color: @xtxColor;
      border-right: 1px solid #eee;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
