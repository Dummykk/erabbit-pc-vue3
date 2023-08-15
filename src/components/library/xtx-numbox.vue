<template>
  <div class="xtx-numbox">
    <div class="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="num" />
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

export default {
  name: 'XtxNumbox',

  props: {
    label: {
      type: String
    },
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    }
  },

  setup (props, { emit }) {
    const num = useVModel(props, 'modelValue', emit)

    const changeNum = (val) => {
      const newValue = num.value + val
      if (newValue < props.min || newValue > props.max) {
        return
      }
      num.value = newValue
      emit('changeNum', newValue)
    }

    return { num, changeNum }
  }

}
</script>

<style lang='less' scoped>
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    padding-left: 10px;
    width: 60px;
    color: #999;
  }
  .numbox {
    display: flex;
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background-color: #f8f8f8;
      font-size: 18px;
      color: #666;
      &:first-child {
        border-right: 1px solid #e4e4e4;
      }
      &:last-child {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      padding: 0 5px;
      width: 60px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
