<template>
  <div
    class="xtx-skeleton"
    :style="{ width, height }"
    :class="{ flashing: animated }"
  >
    <div class="block" :style="{ backgroundColor: bg }"></div>
  </div>
</template>

<script>
export default {
  name: 'XtxSkeleton',
  props: {
    bg: {
      type: String,
      default: '#efefef'
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    },
    animated: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang='less' scoped>
.xtx-skeleton {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  overflow: hidden;
  .block {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
}
.flashing {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    animation: flash 1.5s ease 0s infinite;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-45deg);
  }
}
@keyframes flash {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}
</style>
