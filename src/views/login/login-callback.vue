<template>
  <login-header>使用QQ登录</login-header>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        href="javascript:;"
        :class="{ active: hasAccount }"
        @click="hasAccount = true"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，绑定账号</span>
      </a>
      <a
        href="javascript:;"
        :class="{ active: !hasAccount }"
        @click="hasAccount = false"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，注册账号并绑定</span>
      </a>
    </nav>
    <div v-if="hasAccount" class="tab-content">
      <callback-bind :unionId="unionId" />
    </div>
    <div v-else class="tab-content">
      <callback-patch :unionId="unionId" />
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import loginHeader from './components/login-header.vue'
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { loginByQQ } from '@/api/user'
import Message from '@/components/library/Message'

export default {
  components: { loginHeader, CallbackBind, CallbackPatch },

  setup () {
    const hasAccount = ref(true)
    // 账号是否绑定手机号
    const isBind = ref(true)

    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 若QQ已经登录
    if (QC.Login.check()) {
      // 获取唯一标识
      QC.Login.getMe(openId => {
        unionId.value = openId
        loginByQQ(openId)
          .then(data => {
          // 登录成功
          // 1. 存储用户信息
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 合并购物车
            store.dispatch('cart/mergeLocalCart').then(() => {
              // 2. 跳转到来源页或首页
              router.push(store.state.user.redirectUrl)
              // 3. 成功提示
              Message({ type: 'success', text: 'QQ登录成功！' })
            })
          })
          .catch(e => {
            isBind.value = false
            console.log(e)
          })
      })
    }
    return { isBind, unionId, hasAccount }
  }

}
</script>

<style lang='less' scoped>
.container {
  position: relative;
  padding: 25px 0;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(~@/assets/images/load.gif) no-repeat center / 100px
        100px;
    }
  }
  .tab {
    padding-top: 40px;
    height: 80px;
    background-color: #fff;
    font-size: 18px;
    text-align: center;
    a {
      display: inline-block;
      width: 350px;
      line-height: 38px;
      color: #666;
      border-bottom: 2px solid #e4e4e4;
      i {
        font-size: 22px;
        vertical-align: middle;
      }
      span {
        margin-left: 4px;
        vertical-align: middle;
      }
      &.active {
        color: @xtxColor;
        border-color: @xtxColor;
      }
    }
  }
  .tab-content {
    min-height: 600px;
    background-color: #fff;
  }
}
</style>
