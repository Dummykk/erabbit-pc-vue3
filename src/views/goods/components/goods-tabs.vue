<template>
  <div class="goods-tabs">
    <nav>
      <a
        href="javascript:;"
        :class="{ active: activeName === 'detail' }"
        @click="toggleTab('detail')"
      >
        商品详情
      </a>
      <a
        href="javascript:;"
        :class="{ active: activeName === 'comments' }"
        @click="toggleTab('comments')"
      >
        商品评价<span>({{ commentsCount }})</span>
      </a>
    </nav>
    <component
      :is="`goods-${activeName}`"
      @getCommentsCount="goodsInfo.commentCount = $event"
    />
  </div>
</template>

<script>
import GoodsDetail from './goods-detail.vue'
import GoodsComments from './goods-comments.vue'
import { inject, ref } from 'vue'
import { getCommentsByGoods } from '@/api/product'

export default {
  name: 'GoodsTabs',

  components: {
    GoodsDetail,
    GoodsComments
  },

  setup () {
    const activeName = ref('detail')
    const toggleTab = (name) => {
      activeName.value = name
    }

    const goodsInfo = inject('goodsInfo')

    const commentsCount = ref(0)
    getCommentsByGoods(goodsInfo.value.id).then(data => {
      commentsCount.value = data.result.evaluateCount
    })

    return { activeName, toggleTab, goodsInfo, commentsCount }
  }

}
</script>

<style lang='less' scoped>
.goods-tabs {
  nav {
    display: flex;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #f5f5f5;
    a {
      position: relative;
      padding: 0 40px;
      font-size: 18px;
      > span {
        margin-left: 10px;
        font-size: 16px;
        color: @priceColor;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::after {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background-color: @xtxColor;
        }
      }
    }
  }
}
</style>
