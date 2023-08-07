<template>
  <div class="login-page">
    <login-header>欢迎登录</login-header>
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a
            href="javascript:;"
            :class="{ active: activeName === 'account' }"
            @click="activeName = 'account'"
          >
            账户登录
          </a>
          <a
            href="javascript:;"
            :class="{ active: activeName === 'qrcode' }"
            @click="activeName = 'qrcode'"
          >
            扫码登录
          </a>
        </nav>
        <div v-if="activeName === 'account'" class="account-box">
          <login-form />
        </div>
        <div v-else class="qrcode-box">
          <img src="@/assets/images/qrcode.jpg" alt="" />
          <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
        </div>
      </div>
    </section>
    <login-footer />
  </div>
</template>

<script>
import { ref } from 'vue'
import LoginFooter from './components/login-footer.vue'
import loginHeader from './components/login-header.vue'
import LoginForm from './components/login-form.vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'LoginPage',

  components: { loginHeader, LoginFooter, LoginForm },

  setup () {
    const activeName = ref('account')

    // 记录跳转登录地址栏通过redirectUrl传递的参数
    const store = useStore()
    const route = useRoute()
    store.commit('user/setRedirectUrl', route.query.redirectUrl || '/')

    return { activeName }
  }
}
</script>

<style lang='less' scoped>
.login-section {
  position: relative;
  height: 488px;
  background: url(~@/assets/images/login-bg.png) no-repeat center / cover;
  .wrapper {
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translateX(100px);
    width: 380px;
    min-height: 400px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    nav {
      display: flex;
      align-items: center;
      padding: 0 40px;
      height: 55px;
      text-align: right;
      border-bottom: 1px solid #f5f5f5;
      a {
        flex: 1;
        display: inline-block;
        position: relative;
        line-height: 1;
        font-size: 18px;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
    .qrcode-box {
      padding-top: 40px;
      text-align: center;
      p {
        margin-top: 20px;
        a {
          color: @xtxColor;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
