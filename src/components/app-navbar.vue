<template>
  <nav class="app-navbar">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/">
              <i class="iconfont icon-user" />
              {{ profile.account }}
            </router-link>
          </li>
          <li>
            <router-link to="/login" @click="logout">退出登录</router-link>
          </li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><router-link to="/">免费注册</router-link></li>
        </template>
        <li><router-link to="/">我的订单</router-link></li>
        <li><router-link to="/">会员中心</router-link></li>
        <li><router-link to="/">帮助中心</router-link></li>
        <li><router-link to="/">关于我们</router-link></li>
        <li>
          <router-link to="/"
            ><i class="iconfont icon-phone" />手机版</router-link
          >
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

    // 退出登录
    const logout = () => {
      store.commit('user/setUser', {})
      // 清空本地购物车
      store.commit('cart/setCartList', [])
    }

    return { profile, logout }
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
