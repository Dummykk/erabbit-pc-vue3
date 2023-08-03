<template>
  <Form
    ref="formCom"
    class="xtx-form"
    :validation-schema="schema"
    v-slot="{ errors }"
    autocomplete="off"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          class="input"
          :class="{ err: errors.mobile }"
          name="mobile"
          v-model="form.mobile"
          type="text"
          placeholder="请输入要绑定的手机号"
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
          name="code"
          v-model="form.code"
          type="text"
          placeholder="请输入短信验证码"
        />
        <span class="code" @click="sendCode">
          {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="bind">立即绑定</a>
  </Form>
</template>

<script>
import { reactive, ref, onUnmounted } from 'vue'
import QC from 'qc'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { bindWithMobile, getBindMsgCode } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackBind',

  components: { Form, Field },

  props: {
    unionId: {
      type: String,
      default: ''
    }
  },

  setup (props) {
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }

    const formCom = ref(null)
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
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
            await getBindMsgCode(form.mobile)
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

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const bind = () => {
      const valid = formCom.value.validate()
      if (valid) {
        bindWithMobile(props.unionId, form.mobile, form.code)
          .then(data => {
            // 1. 存储用户信息
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ绑定成功' })
          })
          .catch(e => {
            Message({ type: 'error', text: '绑定失败' })
          })
      }
    }

    return { nickname, avatar, form, formCom, schema: mySchema, sendCode, time, bind }
  }
}
</script>

<style lang='less' scoped>
.user-info {
  display: flex;
  align-items: center;
  margin: 0 auto 25px;
  padding: 0 10px;
  width: 320px;
  height: 70px;
  background-color: #f2f2f2;
  img {
    width: 50px;
    height: 50px;
    background-color: #f2f2f2;
  }
  p {
    padding-left: 10px;
  }
}
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
