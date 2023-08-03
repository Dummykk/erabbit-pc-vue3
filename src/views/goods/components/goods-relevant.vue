<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">同类商品推荐</span>
    </div>
    <!-- 使用改造后的xtx-carousel组件 -->
    <xtx-carousel :sliders="sliders" isRelevant autoPlay />
  </div>
</template>

<script>
import { ref } from 'vue'
import { getRelevantGoods } from '@/api/product'
export default {
  name: 'GoodsRelevant',

  props: {
    goodsId: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const sliders = getRelevant(props.goodsId)
    return { sliders }
  }
}

const getRelevant = (id) => {
  const sliders = ref([])
  getRelevantGoods(id).then(data => {
    const pageSize = 4
    const pages = Math.ceil(data.result.length / pageSize)
    for (let i = 0; i < pages; i++) {
      sliders.value.push(data.result.slice(pageSize * i, pageSize * (i + 1)))
    }
  })
  return sliders
}
</script>

<style lang='less' scoped>
.goods-relevant {
  margin-top: 20px;
  min-height: 460px;
  background-color: #fff;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      padding-left: 10px;
      font-size: 20px;
    }
    .icon {
      position: relative;
      display: inline-block;
      width: 16px;
      height: 16px;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      transform: translateY(1px) rotate(45deg);
      &::before {
        position: absolute;
        top: 2px;
        content: '';
        width: 10px;
        height: 10px;
        background-color: lighten(@xtxColor, 40%);
      }
    }
  }
}
</style>
