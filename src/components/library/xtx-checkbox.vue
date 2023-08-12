<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked" />
    <i v-else class="iconfont icon-unchecked" />
    <span><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XtxCheckbox',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)

    const changeChecked = () => {
      const newVal = !checked.value
      checked.value = newVal
      emit('changeCheck', newVal)
    }

    return { checked, changeChecked }
  }
}
</script>

<style lang='less' scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
