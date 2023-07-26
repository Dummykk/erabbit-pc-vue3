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
      checked.value = !checked.value
      emit('changeCheck', !checked.value)
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
