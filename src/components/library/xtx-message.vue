<template>
  <transition name="down">
    <div class="xtx-message" :style="style[type]" v-show="visible">
      <i class="iconfont" :class="[style[type].icon]" />
      <span class="text">{{ text }}</span>
    </div>
  </transition>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
  name: 'XtxMessage',

  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'warn',
      validator: (val) => {
        return ['success', 'error', 'warn'].includes(val)
      }
    }
  },

  setup () {
    // 消息框样式
    const style = {
      warn: {
        icon: 'icon-warning',
        color: '#E6A23C',
        backgroundColor: 'rgb(253, 246, 236)',
        borderColor: 'rgb(250, 236, 216)'
      },
      error: {
        icon: 'icon-shanchu',
        color: '#F56C6C',
        backgroundColor: 'rgb(254, 240, 240)',
        borderColor: 'rgb(253, 226, 226)'
      },
      success: {
        icon: 'icon-queren2',
        color: '#67C23A',
        backgroundColor: 'rgb(240, 249, 235)',
        borderColor: 'rgb(225, 243, 216)'
      }
    }

    // 控制消息框显示隐藏 动画
    const visible = ref(false)
    onMounted(() => {
      visible.value = true
    })

    return { style, visible }
  }
}
</script>

<style lang='less' scoped>
.down {
  &-enter {
    &-from {
      transform: translateY(-75px);
      opacity: 1;
    }
    &-active {
      transition: all 0.5s;
    }
    &-to {
      transform: none;
      opacity: 1;
    }
  }
}

.xtx-message {
  position: fixed;
  left: 50%;
  top: 100px;
  margin-left: -150px;
  width: 300px;
  height: 50px;
  z-index: 9999;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background-color: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 4px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
}
</style>
