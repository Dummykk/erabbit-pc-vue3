<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <div v-if="hotList">
      <goods-item v-for="item in hotList" :key="item.id" :good="item" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getHotGoods } from '@/api/product'
import goodsItem from '@/views/category/components/goods-item.vue'
export default {
  components: { goodsItem },
  name: 'GoodsHot',

  props: {
    type: {
      type: Number,
      default: 1
    },
    goodsId: {
      type: String
    }
  },

  setup (props) {
    // 热榜标题
    const titleObj = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = titleObj[props.type]

    // 获取热榜数据
    const hotList = ref([])
    getHotGoods({ id: props.goodsId, type: props.type }).then(data => {
      hotList.value = data.result.map(item => {
        item.tag = item.desc
        return item
      })
    })

    return { title, hotList }
  }
}
</script>

<style lang='less' scoped>
.goods-hot {
  h3 {
    padding-left: 25px;
    margin-bottom: 10px;
    height: 70px;
    line-height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    font-weight: normal;
  }
  :deep .goods-item {
    margin-bottom: 10px;
    width: 100%;
    height: 340px;
    background-color: #fff;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
