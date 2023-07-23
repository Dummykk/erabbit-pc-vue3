<template>
  <nav class="app-navbar">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <a href="#"
              ><i class="iconfont icon-user" />{{ profile.account }}</a
            >
          </li>
          <li><a href="#">退出登录</a></li>
        </template>
        <template v-else>
          <li><a href="#">请先登录</a></li>
          <li><a href="#">免费注册</a></li>
        </template>
        <li><a href="#">我的订单</a></li>
        <li><a href="#">会员中心</a></li>
        <li><a href="#">帮助中心</a></li>
        <li><a href="#">关于我们</a></li>
        <li>
          <a href="#"><i class="iconfont icon-phone" />手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AppNavbar',
  setup () {
    const store = useStore()
    // 使用vuex中的state，设置为计算属性，使其成为响应式
    const profile = computed(() => {
      return store.state.user.profile
    })

    return { profile }
  }

}
</script>

<style lang='less' scoped>
.app-navbar {
  background-color: #333;
  ul {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 54px;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        i {
          font-size: 14px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        border-left: 2px solid #666;
      }
    }
  }
}
</style>
