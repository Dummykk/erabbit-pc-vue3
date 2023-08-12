<template>
  <!-- 切换收货地址 对话框 -->
  <xtx-dialog title="切换收货地址" v-model:visible="dialogVisible">
    <template #body>
      <div
        class="item"
        v-for="item in addressList"
        :key="item.id"
        @click="selectAddress(item)"
        :class="{
          active:
            (!selectedAddress && showAddress.id === item.id) ||
            (selectedAddress && selectedAddress.id === item.id)
        }"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li>
            <span>收货地址：</span>
            {{ item.fullLocation.replace(/ /g, '') + item.address }}
          </li>
        </ul>
        <a class="delete" @click.stop="deleteAddress(item.id)">删除地址</a>
      </div>
    </template>
    <template #footer>
      <xtx-button
        type="gray"
        size="small"
        style="margin-right: 30px"
        @click="dialogVisible = false"
      >
        取消
      </xtx-button>
      <xtx-button type="primary" size="small" @click="confirmAddress">
        确认
      </xtx-button>
    </template>
  </xtx-dialog>
</template>

<script>
import { ref } from 'vue'
import { delAddress } from '@/api/order'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'

export default {
  name: 'AddressChange',

  props: {
    addressList: {
      type: Array,
      default: () => []
    },
    showAddress: {
      type: Object,
      default: () => {}
    }
  },

  setup (props, { emit }) {
    const dialogVisible = ref(false)

    const open = () => {
      selectedAddress.value = props.showAddress
      dialogVisible.value = true
    }

    // 选择地址
    const selectedAddress = ref(null)
    const selectAddress = (addr) => {
      selectedAddress.value = addr
    }

    // 确认地址
    const confirmAddress = () => {
      dialogVisible.value = false
      emit('on-success', selectedAddress.value)
    }

    // 删除地址
    const deleteAddress = (id) => {
      Confirm({ text: '确认删除该地址吗？' })
        .then(() => {
          delAddress(id).then(data => {
            Message({ type: 'success', text: '删除收货地址成功' })
            emit('del-success', id)
            if (selectedAddress.value.id === id) {
              selectedAddress.value = props.addressList[0]
            }
            if (!props.addressList.length) {
              dialogVisible.value = false
            }
          })
        })
        .catch(e => {})
    }

    return { dialogVisible, open, selectedAddress, selectAddress, confirmAddress, deleteAddress }
  }
}
</script>

<style lang='less' scoped>
.xtx-dialog {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;
    &.active,
    &:hover {
      border-color: @xtxColor;
      background-color: lighten(@xtxColor, 50%);
    }
    > ul {
      padding: 10px;
      line-height: 30px;
      font-size: 14px;
    }
    .delete {
      padding-right: 10px;
      color: @warnColor;
      font-size: 14px;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
