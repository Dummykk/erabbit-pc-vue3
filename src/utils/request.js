import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    // 1. 获取用户信息对象
    const { profile } = store.state.user
    // 2. 判断是否有token
    if (profile.token) {
      // 3. 将token设置到请求头中
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 1. 清空无效用户信息
      store.commit('user/setUser', {})
      // 2. 跳转到登录页，需要携带当前路由地址及参数给登录页
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // js对象中，{['name']: 'Tom'} 等价于 {name: 'Tom}
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
