<template>
  <div class="home-special">
    <home-panel ref="box" title="最新专题">
      <template v-slot:right>
        <xtx-more />
      </template>
      <ul class="special-list">
        <li class="special-item" v-for="item in specials" :key="item.id">
          <router-link class="cover" to="/">
            <img v-lazy="item.cover" />
            <div class="meta">
              <div class="title">
                <p class="name ellipsis">{{ item.title }}</p>
                <p class="desc ellipsis">{{ item.summary }}</p>
              </div>
              <span class="price">&yen;{{ item.lowestPrice }}起</span>
            </div>
          </router-link>
          <div class="info">
            <span><i class="iconfont icon-hart1" />{{ item.collectNum }}</span>
            <span><i class="iconfont icon-see" />{{ item.viewNum }}</span>
            <span><i class="iconfont icon-message" />{{ item.replyNum }}</span>
          </div>
        </li>
      </ul>
    </home-panel>
  </div>
</template>

<script>
import homePanel from './home-panel.vue'
import { ref } from 'vue'
import { useLazyData } from '@/hooks'
import { getSpecial } from '@/api/home'

export default {
  name: 'HomeSpecial',

  components: { homePanel },

  setup () {
    const box = ref(null)

    const specials = useLazyData(box, getSpecial)
    return { box, specials }
  }

}
</script>

<style lang='less' scoped>
.home-panel {
  background-color: #f5f5f5;
  .special-list {
    display: flex;
    justify-content: space-between;
    .special-item {
      width: 404px;
      height: 360px;
      margin-bottom: 20px;
      .hoverShadow();
      .cover {
        display: block;
        position: relative;
        width: 100%;
        height: 288px;
        img {
          width: 100%;
          height: 100%;
        }
        .meta {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 15px;
          width: 100%;
          height: 288px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8),
            transparent 50%
          );
          .title {
            width: 70%;
            height: 70px;
            .name {
              font-size: 22px;
              color: #fff;
            }
            .desc {
              font-size: 19px;
              color: #999;
            }
          }
          .price {
            position: absolute;
            right: 15px;
            bottom: 24px;
            padding: 4px;
            height: 25px;
            line-height: 1;
            font-size: 17px;
            color: @priceColor;
            background-color: #fff;
            border-radius: 3px;
          }
        }
      }
      .info {
        padding: 0 15px;
        height: 72px;
        line-height: 72px;
        background-color: #fff;
        span {
          font-size: 16px;
          vertical-align: middle;
          i {
            margin-right: 5px;
            vertical-align: middle;
            font-size: 15px;
            color: #999;
          }
          &:first-child {
            margin-right: 25px;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }
}
</style>
