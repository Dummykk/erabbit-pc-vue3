<template>
  <div ref="target" class="xtx-city">
    <div class="select" :class="{ active: visible }" @click="toggleDialog">
      <span v-if="!fullLocation" class="placeholder">
        {{ placeholder }}
      </span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down" />
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currentList"
          :key="item.code"
          @click="selectAddress(item)"
        >
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'XtxCity',

  props: {
    fullLocation: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },

  setup (props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)
    const cityData = ref([])

    const open = () => {
      visible.value = true
      loading.value = true
      // 获取数据
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
      // 清空之前的选择
      for (const key in address) {
        address[key] = ''
      }
    }

    const close = () => {
      visible.value = false
    }

    const target = ref(null)
    onClickOutside(target, () => {
      visible.value = false
    })

    // 城市面板开或关
    const toggleDialog = () => {
      if (visible.value) {
        close()
      } else {
        open()
      }
    }

    // 选择地址
    const address = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    const selectAddress = (item) => {
      // 省份
      if (item.level === 0) {
        address.provinceCode = item.code
        address.provinceName = item.name
      }
      // 城市
      if (item.level === 1) {
        address.cityCode = item.code
        address.cityName = item.name
      }
      // 区县
      if (item.level === 2) {
        address.countyCode = item.code
        address.countyName = item.name
        address.fullLocation = `${address.provinceName} ${address.cityName} ${address.countyName}`
        visible.value = false
        emit('completeAddr', address)
      }
    }

    const currentList = computed(() => {
      // 省份
      let currentList = cityData.value
      // 城市
      if (address.provinceCode) {
        currentList = currentList.find(p => p.code === address.provinceCode).areaList
      }
      // 区县
      if (address.cityCode) {
        currentList = currentList.find(c => c.code === address.cityCode).areaList
      }
      return currentList
    })

    return { visible, loading, currentList, toggleDialog, selectAddress, target }
  }
}

const getCityData = () => {
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData)
    } else {
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>

<style lang='less' scoped>
.xtx-city {
  position: relative;
  margin-left: 5px;
  .select {
    padding: 0 5px;
    height: 30px;
    line-height: 28px;
    border: 1px solid #e4e4e4;
    cursor: pointer;
    &.active {
      background-color: #fff;
    }
    .placeholder {
      margin-right: 2px;
      color: #999;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      vertical-align: middle;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
  }
  .option {
    position: absolute;
    top: 29px;
    left: 0;
    z-index: 400;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    width: 542px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    min-height: 30px;
    line-height: 30px;
    > span {
      padding: 0 3px;
      width: 130px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(~@/assets/images/loading.gif) no-repeat center / 100px
        178px;
    }
  }
}
</style>
