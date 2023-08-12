<template>
  <div class="xtx-dialog" v-show="visible">
    <div class="wrapper">
      <div class="header">
        <h3>{{ title }}</h3>
        <a
          href="javascript:;"
          class="iconfont icon-close-new"
          @click="close"
        ></a>
      </div>
      <div class="body"><slot name="body" /></div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtxDialog',

  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    // 关闭的时候通知父组件
    const close = () => {
      emit('update:visible', false)
    }

    return { close }
  }
}
</script>

<style lang='less' scoped>
.xtx-dialog {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  animation: fade 0.4s linear forwards;
  @keyframes fade {
    0% {
      background-color: rgba(0, 0, 0, 0);
    }
    100% {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    background-color: #fff;
    border-radius: 4px;
    animation: fade-wrapper 0.4s linear forwards;
    @keyframes fade-wrapper {
      0% {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    .header {
      position: relative;
      padding: 0 20px;
      height: 70px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
      h3 {
        font-size: 18px;
        font-weight: normal;
      }
      a {
        position: absolute;
        right: 25px;
        top: 25px;
        font-size: 24px;
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
    .body {
      padding: 20px 40px;
      font-size: 16px;
    }
    .footer {
      padding: 10px 0 30px 0;
      text-align: center;
    }
  }
}
</style>
