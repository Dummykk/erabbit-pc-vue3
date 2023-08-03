<template>
  <div class="xtx-pagination">
    <a
      href="javascript:;"
      :class="{ disabled: myCurrentPage === 1 }"
      @click="changePage(myCurrentPage - 1)"
      >上一页</a
    >
    <span v-if="pager.start > 1">…</span>
    <a
      v-for="i in pager.btnArr"
      :key="i"
      href="javascript:;"
      :class="{ active: myCurrentPage === i }"
      @click="changePage(i)"
    >
      {{ i }}
    </a>
    <span v-if="pager.end < pager.totalPages">…</span>
    <a
      href="javascript:;"
      :class="{ disabled: myCurrentPage === pager.totalPages }"
      @click="changePage(myCurrentPage + 1)"
    >
      下一页
    </a>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',

  props: {
    totalData: {
      type: Number,
      required: true
    },
    pagesize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    btnCount: {
      type: Number,
      default: 5
    }
  },

  setup (props, { emit }) {
    // 数据总条数
    const myTotalData = ref(0)
    // 每页显示的数据条数
    const myPagesize = ref(0)
    // 当前页码
    const myCurrentPage = ref(0)
    // 显示页码按钮的个数
    let myBtnCount = 5

    watch(props, () => {
      myTotalData.value = props.totalData
      myPagesize.value = props.pagesize
      myCurrentPage.value = props.currentPage
      myBtnCount = props.btnCount
    })

    // 根据上述数据计算得到：总页数、起始页码、结束页码、按钮数组
    const pager = computed(() => {
      // 总页数
      const totalPages = Math.ceil(myTotalData.value / myPagesize.value)
      // 起始页码、结束页码
      let start = myCurrentPage.value - Math.floor(myBtnCount / 2)
      let end = start + myBtnCount - 1
      if (start < 1) {
        start = 1
        end = totalPages > start + myBtnCount - 1 ? start + myBtnCount - 1 : totalPages
      }
      if (end > totalPages) {
        end = totalPages
        start = (end - myBtnCount + 1) < 1 ? 1 : (end - myBtnCount + 1)
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { totalPages, start, end, btnArr }
    })

    // 改变页码
    const changePage = (newPage) => {
      if (newPage > pager.value.totalPages || newPage < 1) {
        return
      }
      if (newPage !== myCurrentPage.value) {
        myCurrentPage.value = newPage
        emit('currentPage-change', newPage)
      }
    }

    return { pager, myCurrentPage, changePage }
  }
}
</script>

<style lang='less' scoped>
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
      border-color: lighten(@xtxColor, 25%);
    }
    &.active {
      background-color: @xtxColor;
      border-color: @xtxColor;
      color: #fff;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
        border-color: #e4e4e4;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
