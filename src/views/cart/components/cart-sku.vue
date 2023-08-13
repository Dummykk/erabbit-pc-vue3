<template>
  <div ref="target" class="cart-sku">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down" :class="{ active: visible }" />
    </div>
    <transition name="layer">
      <div class="layer" v-if="visible">
        <div v-if="loading" class="loading"></div>
        <goods-sku v-else :goods="goods" :skuId="skuId" @change="changeSku" />
        <div class="btn" v-if="!loading">
          <xtx-button type="primary" size="mini" @click="submit">
            确认
          </xtx-button>
          <xtx-button type="default" size="mini" @click="visible = false">
            取消
          </xtx-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import goodsSku from '@/views/goods/components/goods-sku.vue'
import { getSpecsBySkuId } from '@/api/product'
export default {
  name: 'CartSku',

  components: { goodsSku },

  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const goods = ref(null)
    const loading = ref(false)
    // 控制弹层的显示与关闭
    const visible = ref(false)
    const show = () => {
      visible.value = true
      loading.value = true
      getSpecsBySkuId(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
    }
    const close = () => {
      visible.value = false
      goods.value = null
    }
    const toggle = () => {
      visible.value ? close() : show()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      visible.value = false
    })

    // 选择规格
    const currentSku = ref(null)
    const changeSku = (sku) => {
      currentSku.value = sku
    }
    const submit = () => {
      if (currentSku.value && currentSku.value.skuId && currentSku.value.skuId !== props.skuId) {
        emit('change', currentSku.value)
      }
    }
    return { visible, toggle, target, goods, loading, changeSku, submit }
  }
}
</script>

<style lang='less' scoped>
.cart-sku {
  position: relative;
  margin-top: 10px;
  padding: 0 6px;
  height: 28px;
  border: 1px solid #ddd;
  .attrs {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    span {
      min-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      font-size: 14px;
      transition: all 0.2s;
      &.active {
        transform: rotate(180deg);
      }
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    padding: 20px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background-color: #fff;
    border-radius: 4px;
    font-size: 14px;
    &::before {
      position: absolute;
      top: -7px;
      left: 14px;
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      background-color: #fff;
      transform: rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(~@/assets/images/loading.gif) no-repeat center / 100px
        178px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      padding: 0 60px;
    }
  }
}
.layer-enter-from,
.layer-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.layer-enter-active,
.layer-leave-active {
  transition: all 0.2s linear;
}
.layer-enter-to,
.layer-leave-from {
  transform: none;
  opacity: 1;
}
</style>
