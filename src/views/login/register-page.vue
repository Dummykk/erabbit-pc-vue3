<template>
  <div class="register-page">
    <login-header>欢迎注册</login-header>
    <section class="register-section">
      <div class="wrapper-register">
        <nav class="title">
          <a href="javascript:;" class="active"> 账号注册 </a>
        </nav>
        <div class="account-box">
          <Form
            class="form"
            ref="formCom"
            :validation-schema="schema"
            v-slot="{ errors }"
            autocomplete="off"
          >
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
              <div class="input" :class="{ error: errors.mobile }">
                <i class="iconfont icon-user" />
                <Field
                  v-model="form.mobile"
                  name="mobile"
                  type="text"
                  placeholder="请输入手机号"
                />
              </div>
              <div class="error-text" v-if="errors.mobile">
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
            <div class="form-item">
              <div class="input" :class="{ error: errors.password }">
                <i class="iconfont icon-lock" />
                <Field
                  v-model="form.password"
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                />
              </div>
              <div v-if="errors.password" class="error-text">
                <i class="iconfont icon-warning" />
                {{ errors.password }}
              </div>
            </div>
            <div class="form-item">
              <div class="input" :class="{ error: errors.rePassword }">
                <i class="iconfont icon-lock" />
                <Field
                  v-model="form.rePassword"
                  name="rePassword"
                  type="password"
                  placeholder="请确认密码"
                  @keydown.enter="register"
                />
              </div>
              <div v-if="errors.rePassword" class="error-text">
                <i class="iconfont icon-warning" />
                {{ errors.rePassword }}
              </div>
            </div>
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
            <a
              ref="registerBtn"
              href="javascript:;"
              class="btn"
              @click="register"
            >
              注 册
            </a>
            <div class="action">
              <div class="url">
                <a href="javascript:;" @click="$router.push('/login')">
                  已有账号，直接登录
                </a>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
    <login-footer />
  </div>
</template>

<script>
import LoginFooter from './components/login-footer.vue'
import loginHeader from './components/login-header.vue'
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { registerByMobile, getMsgCodeForRegister } from '@/api/user'
import Message from '@/components/library/Message'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'

export default {
  name: 'RegisterPage',

  components: { loginHeader, LoginFooter, Form, Field },

  setup () {
    const router = useRouter()

    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null,
      isAgree: true
    })

    // 校验规则对象
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword,
      isAgree: schema.isAgree
    }

    const registerBtn = ref(null)

    // 点击注册按钮
    const register = async (e) => {
      // 动态创建按钮波纹特效
      // 1. 计算波纹按钮所需的坐标 -> 找出光标相对于按钮的位置
      const boundingBox = registerBtn.value.getBoundingClientRect()
      const x = e.clientX - boundingBox.left
      const y = e.clientY - boundingBox.top
      // 2. 动态创建波纹按钮，添加到盒子中
      const ripple = document.createElement('span')
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('ripple')
      registerBtn.value.appendChild(ripple)
      // 3. 动画结束后移除波纹
      ripple.addEventListener('animationend', () => { ripple.remove() })

      // 注册时，对表单进行整体校验，Form组件提供了validate()函数做整体校验，返回一个promise
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          registerByMobile(form).then(data => {
            Message({ type: 'success', text: '注册成功！' })
            router.push('/login')
          })
        } catch (e) {
          // 失败
          Message({ type: 'error', text: e.response.data.message || '注册失败！' })
        }
      }
    }

    const formCom = ref(null)

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
            await getMsgCodeForRegister(form.mobile)
            Message({ type: 'success', text: '发送成功！' })
          }
        } catch (e) {
          Message({ type: 'error', text: e.response.data.message || '验证码发送失败！' })
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }

    return { form, schema: mySchema, formCom, registerBtn, register, sendCode, time }
  }
}
</script>

<style lang='less'>
.register-section {
  position: relative;
  height: 488px;
  background: url(~@/assets/images/login-bg.png) no-repeat center / cover;
}
.wrapper-register {
  position: absolute;
  left: 50%;
  top: 10px;
  transform: translateX(100px);
  width: 380px;
  min-height: 400px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  .title > .active {
    display: block;
    padding: 0 40px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    border-bottom: 1px solid #f5f5f5;
    color: @xtxColor;
    font-weight: bold;
    font-size: 18px;
  }
  .form {
    padding: 20px 40px 20px;
    &-item {
      margin-bottom: 20px;
      .input {
        display: flex;
        height: 36px;
        border: 1px solid #cfcdcd;
        > i {
          width: 34px;
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
        line-height: 18px;
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
      .ripple {
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
    padding: 14px 0;
    .url {
      a {
        float: right;
        color: #999;
      }
    }
  }
}
</style>
