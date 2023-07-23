<template>
  <ul class="app-header-nav">
    <li><router-link to="/">首页</router-link></li>
    <li
      v-for="item in list"
      :key="item.id"
      @mouseenter="show(item)"
      @mouseleave="hide(item)"
    >
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{
        item.name
      }}</router-link>
      <div class="layer" :class="{ show: item.isShow }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'AppHeaderNav',

  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    const show = (category) => {
      store.commit('category/show', category)
    }
    const hide = (category) => {
      store.commit('category/hide', category)
    }
    return { list, show, hide }
  }

}
</script>

<style lang='less' scoped>
.app-header-nav {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-left: 40px;
  > li {
    margin-right: 40px;
    width: 38px;
    font-size: 16px;
    > a {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      &:hover {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
    .layer {
      position: absolute;
      left: -250px;
      top: 56px;
      display: flex;
      align-items: center;
      width: 1240px;
      height: 0;
      overflow: hidden;
      z-index: 1;
      opacity: 0;
      background-color: #fff;
      box-shadow: 0 0 5px #ccc;
      transition: all 0.2s 0.1s;
      &.show {
        height: 132px;
        opacity: 1;
      }
      ul {
        display: flex;
        align-items: center;
        padding: 0 70px;
        li {
          width: 110px;
          text-align: center;
          img {
            width: 60px;
            height: 60px;
          }
          p {
            padding-top: 10px;
          }
          &:hover {
            p {
              color: @xtxColor;
            }
          }
        }
      }
    }
  }
}
</style>
