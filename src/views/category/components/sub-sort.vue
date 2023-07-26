<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === null }"
        @click="changeSort(null)"
        >默认排序</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
        >最新商品</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
        >最高人气</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i
          class="arrow up"
          :class="{ active: sortParams.sortMethod === 'asc' }"
        />
        <i
          class="arrow down"
          :class="{ active: sortParams.sortMethod === 'desc' }"
        />
      </a>
    </div>
    <div class="check">
      <xtx-checkbox @changeCheck="changeCheck" v-model="sortParams.inventory">
        仅显示有货商品
      </xtx-checkbox>
      <xtx-checkbox
        @changeCheck="changeCheck"
        v-model="sortParams.onlyDiscount"
      >
        仅显示特惠商品
      </xtx-checkbox>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',

  setup (props, { emit }) {
    const sortParams = reactive({
      inventory: false, // 库存
      onlyDiscount: false, // 特惠
      sortField: null, // publishTime,orderNum,price,evaluateNum
      sortMethod: null // asc为正序 desc为倒序
    })

    const changeSort = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          // 第一次点击，默认倒序
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortField) { return }
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      emit('sort-change', sortParams)
    }

    const changeCheck = (sortParams) => {
      emit('sort-change', sortParams)
    }
    return { sortParams, changeSort, changeCheck }
  }
}

</script>

<style lang='less' scoped>
.sub-sort {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  .sort {
    display: flex;
    a {
      position: relative;
      margin-right: 20px;
      padding: 0 20px;
      height: 30px;
      line-height: 28px;
      color: #999;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      transition: all 0.3s;
      &.active {
        background-color: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        right: 8px;
        border: 5px solid transparent;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
