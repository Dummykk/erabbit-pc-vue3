<template>
  <!-- 添加地址 对话框 -->
  <xtx-dialog
    :title="`${formData.id ? '修改' : '添加'}收货地址`"
    v-model:visible="dialogVisible"
  >
    <template #body>
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="formData.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="formData.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <xtx-city
              placeholder="请选择所在地区"
              :fullLocation="formData.fullLocation"
              @completeAddr="selectAddress"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="formData.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="formData.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="formData.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
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
      <xtx-button type="primary" size="small" @click="submit">
        确认
      </xtx-button>
    </template>
  </xtx-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',

  setup (props, { emit }) {
    const dialogVisible = ref(false)

    const open = (initData) => {
      for (const key in formData) {
        if (key === 'isDefault') {
          formData[key] = 1
        } else {
          formData[key] = initData[key]
        }
      }
      dialogVisible.value = true
    }

    // 表单数据
    const formData = reactive({
      id: '',
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1,
      fullLocation: ''
    })
    // 选择地区
    const selectAddress = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    // 提交操作
    const submit = () => {
      if (formData.id) {
        // 修改地址
        editAddress(formData).then(data => {
          Message({ type: 'success', text: '修改收货地址成功' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else {
        addAddress(formData).then(data => {
          Message({ type: 'success', text: '添加收货地址成功' })
          formData.id = data.result.id
          dialogVisible.value = false
          emit('on-success', formData)
        })
      }
    }

    return { dialogVisible, open, formData, selectAddress, submit }
  }
}
</script>

<style lang='less' scoped>
.xtx-dialog {
  :deep .wrapper {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    color: #666;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  margin-left: 0;
  width: 320px;
  :deep .select {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    height: 50px;
    line-height: 48px;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep .option {
    top: 49px;
  }
}
</style>
