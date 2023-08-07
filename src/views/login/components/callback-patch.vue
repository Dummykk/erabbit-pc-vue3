<template>
  <Form
    ref="formCom"
    class="xtx-form"
    :validation-schema="schema"
    v-slot="{ errors }"
    autocomplete="off"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          class="input"
          :class="{ err: errors.account }"
          v-model="form.account"
          name="account"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          class="input"
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          class="input"
          :class="{ err: errors.code }"
          v-model="form.code"
          name="code"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="sendCode">
          {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          class="input"
          :class="{ err: errors.password }"
          v-model="form.password"
          name="password"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          class="input"
          :class="{ err: errors.rePassword }"
          v-model="form.rePassword"
          name="rePassword"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { reactive, ref, onUnmounted } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { complementProfile, getQQPatchCode } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackPatch',

  components: { Form, Field },

  props: {
    unionId: {
      type: String,
      default: ''
    }
  },

  setup (props) {
    const formCom = ref(null)
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // 验证码倒计时
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 发送验证码
    const sendCode = async () => {
      const valid = mySchema.mobile(form.mobile)
      try {
        if (valid === true) {
          if (time.value === 0) {
            time.value = 60
            resume()
            await getQQPatchCode(form.mobile)
            console.log(123)
            Message({ type: 'success', text: '发送成功！' })
          }
        } else {
          formCom.value.setFieldError('mobile', valid)
        }
      } catch (e) {
        Message({ type: 'error', text: e.response.data.message || '验证码发送失败！' })
      }
    }

    // 确认提交
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      console.log(Boolean(valid))
      if (valid) {
        complementProfile({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 合并购物车
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: '注册成功' })
          })
        }).catch(e => {
          Message({ type: 'error', text: '注册失败' })
        })
      }
    }
    return { form, formCom, schema: mySchema, time, sendCode, submit }
  }
}
</script>

<style lang='less' scoped>
.code {
  position: absolute;
  right: 1px;
  top: 1px;
  width: 90px;
  height: 48px;
  line-height: 50px;
  text-align: center;
  color: #999;
  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
}
</style>
