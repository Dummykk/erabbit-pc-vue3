<template>
  <div ref="box" class="home-products">
    <home-panel v-for="cate in goods" :key="cate.id" :title="cate.name">
      <template v-slot:right>
        <div class="sub">
          <router-link
            v-for="sub in cate.children"
            :key="sub.id"
            :to="`/category/sub/${sub.id}`"
            >{{ sub.name }}</router-link
          >
        </div>
        <xtx-more :to="`/category/${cate.id}`" />
      </template>
      <div class="box">
        <router-link class="cover" :to="`/category/${cate.id}`">
          <img v-lazy="cate.picture" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </router-link>
        <ul class="goods-list">
          <li v-for="good in cate.goods" :key="good.id">
            <home-goods :good="good" />
          </li>
        </ul>
      </div>
    </home-panel>
  </div>
</template>

<script>
import HomeGoods from './home-goods.vue'
import homePanel from './home-panel.vue'
import { ref } from 'vue'
import { useLazyData } from '@/hooks'
import { getGoods } from '@/api/home'

export default {
  name: 'HomeProduct',

  components: { homePanel, HomeGoods },

  setup () {
    const box = ref(null)
    const goods = useLazyData(box, getGoods)

    return { box, goods }
  }

}
</script>

<style lang='less' scoped>
.home-products {
  height: 2900px;
  background-color: #fff;
  .sub {
    margin-bottom: 3px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background-color: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      position: relative;
      margin-right: 10px;
      width: 240px;
      height: 610px;
      img {
        width: 100%;
        height: 100%;
      }
      .label {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        width: 188px;
        height: 66px;
        line-height: 66px;
        font-size: 18px;
        font-weight: normal;
        color: #fff;
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .goods-list {
      display: flex;
      flex-wrap: wrap;
      width: 990px;
      li {
        margin-right: 10px;
        margin-bottom: 10px;
        width: 240px;
        height: 300px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
