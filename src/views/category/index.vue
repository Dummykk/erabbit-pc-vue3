<template>
  <div class="top-category">
    <div class="container">
      <!--面包屑， 不要在 xtx-bread 组件插槽写注释，也会被解析。 -->
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <transition name="fade-bread-item" mode="out-in">
          <xtx-bread-item :key="topCategory.id">
            {{ topCategory.name }}
          </xtx-bread-item>
        </transition>
      </xtx-bread>
      <!-- 轮播图 -->
      <xtx-carousel :sliders="sliders" autoPlay style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <router-link :to="`/category/sub/${item.id}`">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 分类商品 -->
      <div
        class="goods-list"
        v-for="subCategory in subList"
        :key="subCategory.id"
      >
        <div class="head">
          <h3>- {{ subCategory.name }} -</h3>
          <p>温暖柔软，品质只选</p>
          <xtx-more />
        </div>
        <ul class="body">
          <li v-for="item in subCategory.goods" :key="item">
            <goods-item :good="item" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import xtxCarousel from '@/components/library/xtx-carousel.vue'
import GoodsItem from './components/goods-item.vue'
import { computed, ref, watch } from 'vue'
import { getBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getTopCategory } from '@/api/category'

export default {
  name: 'TopCategory',

  components: { xtxCarousel, GoodsItem },

  setup () {
    // 轮播图
    const sliders = ref([])
    getBanner(2).then(data => {
      sliders.value = data.result
    })

    // 面包屑+所有二级分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      const cate = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      return cate || {}
    })

    // 二级分类推荐商品
    const subList = ref([])
    const getSubList = () => {
      getTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    // 动态路由规则未发生变化时，组件不会初始化，故不会发送请求。需要侦听路由中id的变化
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/${newVal}` === route.path) {
        getSubList()
      }
    }, { immediate: true })
    return { sliders, topCategory, subList }
  }
}
</script>

<style lang='less' scoped>
.top-category {
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    h3 {
      font-size: 28px;
      color: #666;
      font-weight: normal;
      text-align: center;
      line-height: 100px;
    }
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          display: block;
          text-align: center;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .goods-list {
    margin-top: 20px;
    background-color: #fff;
    .head {
      position: relative;
      h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
      }
      p {
        margin-top: -20px;
        font-size: 20px;
        color: #999;
        text-align: center;
      }
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
    .body {
      display: flex;
      padding: 30px 65px;
    }
  }
}
</style>
