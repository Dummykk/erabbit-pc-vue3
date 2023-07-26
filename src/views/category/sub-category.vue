<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread />
      <!-- 筛选区 -->
      <sub-filter @filter-change="changeFilter" />
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <sub-sort @sort-change="changeSort" />
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <goods-item :good="item" />
          </li>
        </ul>
        <xtx-infinite-loading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import GoodsItem from './components/goods-item.vue'
import subBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import { useRoute } from 'vue-router'
import { getSubCategoryGoods } from '@/api/category'

export default {
  name: 'SubCategory',

  components: { subBread, SubFilter, SubSort, GoodsItem },

  setup () {
    const route = useRoute()

    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = { page: 1, pageSize: 20 }

    // 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      getSubCategoryGoods(reqParams).then(data => {
        if (data.result.items.length) {
          goodsList.value.push(...data.result.items)
          if (reqParams.page === 1) { goodsList.value.shift() }
          reqParams.page++
        } else {
          // 加载完毕
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 筛选区改变
    const changeFilter = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }

    // 排序改变
    const changeSort = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }

    return { loading, finished, goodsList, getData, changeFilter, changeSort }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  padding: 0 25px;
  margin-top: 25px;
  background-color: #fff;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
