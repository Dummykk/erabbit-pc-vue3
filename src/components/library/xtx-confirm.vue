<template>
  <div class="xtx-confirm" :class="{ fade }">
    <div ref="target" class="wrapper" :class="{ fade }">
      <div class="header">
        <h3>{{ title }}</h3>
        <a
          href="javascript:;"
          class="iconfont icon-close-new"
          @click="cancelCallback"
        ></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning" />
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <xtx-button type="gray" size="mini" @click="cancelCallback">
          取消
        </xtx-button>
        <xtx-button type="primary" size="mini" @click="submitCallback">
          确认
        </xtx-button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import XtxButton from './xtx-button.vue'
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'XtxConfirm',

  components: {
    XtxButton
  },

  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: ''
    },
    submitCallback: {
      type: Function
    },
    cancelCallback: {
      type: Function
    }
  },

  setup (props) {
    const fade = ref(false)
    onMounted(() => {
      setTimeout(() => {
        fade.value = true
      }, 0)
    })

    // 点击对话框外部：关闭
    const target = ref(null)
    onClickOutside(target, () => {
      props.cancelCallback()
    })

    return { fade, target }
  }
}
</script>

<style lang='less' scoped>
.xtx-confirm {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 400px;
    background-color: #fff;
    border-radius: 8px;
    opacity: 0;
    &.fade {
      transform: translate(-50%, -50%);
      opacity: 1;
      transition: all 0.4s;
    }
    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
  }
  .body {
    padding: 20px 40px;
    font-size: 16px;
    .icon-warning {
      color: @priceColor;
      margin-right: 3px;
      font-size: 16px;
    }
  }
  .footer {
    text-align: right;
    .xtx-button {
      margin-left: 20px;
    }
  }
  .header {
    position: relative;
    h3 {
      font-weight: normal;
      font-size: 18px;
    }
    a {
      position: absolute;
      right: 15px;
      top: 15px;
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #999;
      &:hover {
        color: #666;
      }
    }
  }
}
</style>
