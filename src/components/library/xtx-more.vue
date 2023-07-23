<template>
  <div class="xtx-more">
    <router-link :to="to">
      <span>查看更多</span>
      <i class="iconfont icon-angle-right" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'XtxMore',

  props: {
    to: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style lang='less' scoped>
.xtx-more {
  margin-bottom: 2px;
  span {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
    color: #999;
  }
  i {
    position: relative;
    top: 2px;
    font-size: 14px;
    vertical-align: middle;
    color: #ccc;
  }
  &:hover {
    span,
    i {
      color: @xtxColor;
    }
  }
}
</style>
