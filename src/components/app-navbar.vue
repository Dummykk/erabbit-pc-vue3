<template>
  <nav class="app-navbar">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/member">
              <i class="iconfont icon-user" />
              {{ profile.account }}
            </router-link>
          </li>
          <li>
            <router-link to="" @click="logout">退出登录</router-link>
          </li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><router-link to="/register">免费注册</router-link></li>
        </template>
        <li><router-link to="/member/order">我的订单</router-link></li>
        <li><router-link to="/member">个人中心</router-link></li>
        <li>
          <a href="javascript:;">帮助中心</a>
        </li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone" />手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Confirm from './library/Confirm'
import { useRouter } from 'vue-router'

export default {
  name: 'AppNavbar',
  setup () {
    const router = useRouter()
    const store = useStore()
    // 使用vuex中的state，设置为计算属性，使其成为响应式
    const profile = computed(() => {
      return store.state.user.profile
    })

    // 退出登录
    const logout = () => {
      Confirm({ text: '您确定要退出登录吗？' })
        .then(() => {
          store.commit('user/setUser', {})
          // 清空本地购物车
          store.commit('cart/setCartList', [])
          router.push('/login')
        })
        .catch(e => {})
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
