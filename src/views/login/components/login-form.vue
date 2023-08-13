<template>
  <div class="login-form">
    <div class="toggle">
      <a href="javascript:;" v-if="isMsgLogin" @click="isMsgLogin = false">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a href="javascript:;" v-else @click="isMsgLogin = true">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      class="form"
      ref="formCom"
      :validation-schema="schema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input" :class="{ error: errors.account }">
            <i class="iconfont icon-user" />
            <Field
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="error-text" v-if="errors.account">
            <i class="iconfont icon-warning" />
            {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input" :class="{ error: errors.password }">
            <i class="iconfont icon-lock" />
            <Field
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
              @keydown.enter="login"
            />
          </div>
          <div v-if="errors.password" class="error-text">
            <i class="iconfont icon-warning" />
            {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input" :class="{ error: errors.mobile }">
            <i class="iconfont icon-phone" />
            <Field
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div v-if="errors.mobile" class="error-text">
            <i class="iconfont icon-warning" />
            {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input" :class="{ error: errors.code }">
            <i class="iconfont icon-code" />
            <Field
              v-model="form.code"
              name="code"
              type="text"
              placeholder="请输入验证码"
              @keydown.enter="login"
            />
            <span class="send-code" @click="sendCode">
              {{ time === 0 ? '发送验证码' : `${time}s后重试` }}
            </span>
          </div>
          <div v-if="errors.code" class="error-text">
            <i class="iconfont icon-warning" />
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="xtx-checkbox" v-model="form.isAgree" name="isAgree">
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </Field>
        </div>
        <div v-if="errors.isAgree" class="error-text">
          <i class="iconfont icon-warning" />
          {{ errors.isAgree }}
        </div>
      </div>
      <a ref="loginBtn" href="javascript:;" class="btn" @click="login">
        登 录
      </a>
      <div class="action">
        <a
          href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
        >
          <img src="@/assets/images/connect_logo.png" />
        </a>
        <div class="url">
          <a href="javascript:;" @click="$router.push('/register')">免费注册</a>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getMsgCode, loginByAccount, loginByMsgCode } from '@/api/user'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'

export default {
  name: 'LoginForm',

  components: {
    Form, Field
  },

  setup () {
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: 'Gloria',
      password: '123456',
      mobile: null,
      code: null
    })

    // 校验规则对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 清除校验结果，Form组件提供resetForm()
      formCom.value.resetForm()
    })

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const loginBtn = ref(null)

    // 点击登录按钮
    const login = async (e) => {
      // 动态创建按钮波纹特效
      // 1. 计算波纹按钮所需的坐标 -> 找出光标相对于按钮的位置
      const boundingBox = loginBtn.value.getBoundingClientRect()
      const x = e.clientX - boundingBox.left
      const y = e.clientY - boundingBox.top
      // 2. 动态创建波纹按钮，添加到盒子中
      const ripple = document.createElement('span')
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      loginBtn.value.appendChild(ripple)
      // 3. 动画结束后移除波纹
      ripple.addEventListener('animationend', () => ripple.remove())

      // 登录时，对表单进行整体校验，Form组件提供了validate()函数做整体校验，返回一个promise
      const valid = await formCom.value.validate()
      if (valid) {
        let data = null
        try {
          if (!isMsgLogin.value) {
            // 账号密码登录
            data = await loginByAccount(form)
          } else {
            // 短信验证码登录
            data = await loginByMsgCode(form)
          }
          // 成功
          // 1. 存储用户信息
          const { id, account, nickname, avatar, token, mobile } = data.result
          store.commit('user/setUser', { id, avatar, nickname, account, mobile, token })
          // 2. 合并购物车
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 3. 消息提示
            Message({ type: 'success', text: '登录成功！' })
            // 4. 跳转
            router.push(route.query.redirectUrl || '/')
          })
        } catch (e) {
          // 失败
          Message({ type: 'error', text: e.response.data.message || '登录失败！' })
        }
      }
    }

    // 发送验证码倒计时
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value === 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 发送短信验证码
    const sendCode = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        try {
          if (time.value === 0) {
          // 没有倒计时才可以发送
            time.value = 60
            resume()
            await getMsgCode(form.mobile)
            Message({ type: 'success', text: '发送成功！' })
          }
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '验证码发送失败！' })
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }

    return { isMsgLogin, form, schema: mySchema, formCom, login, loginBtn, time, sendCode }
  }
}
</script>

<style lang='less'>
.login-form {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
        vertical-align: middle;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        display: flex;
        height: 36px;
        border: 1px solid #cfcdcd;
        > i {
          width: 34px;
          height: 34px;
          border: 1px solid #cfcdcd;
          background-color: #cfcdcd;
          text-align: center;
          line-height: 35px;
          font-size: 18px;
        }
        input {
          flex: 1;
          padding-left: 10px;
          height: 34px;
          border: none;
          line-height: 35px;
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .send-code {
          width: 90px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background-color: #f5f5f5;

          cursor: pointer;
          font-size: 14px;
          color: #666;
        }
        &.error {
          border-color: @priceColor;
        }
      }
      > .error-text {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          margin-right: 2px;
          font-size: 14px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
      .agree {
        a {
          color: #069;
        }
      }
    }
    .btn {
      position: relative;
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      background: linear-gradient(
        330deg,
        rgb(60, 118, 211),
        rgba(140, 170, 222, 0.827)
      );
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      overflow: hidden;
      -webkit-user-drag: none;
      &.disabled {
        background-color: #cfcdcd;
      }
      span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        opacity: 0.5;
        border-radius: 48%;
        background-color: #fff;
        pointer-events: none;
        animation: animate 0.7s linear 1;

        @keyframes animate {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
      }
    }
  }
  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
