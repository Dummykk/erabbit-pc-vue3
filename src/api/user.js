import request from '@/utils/request'

// 用户名登录
export const loginByAccount = ({ account, password }) => {
  return request('/login', 'POST', { account, password })
}

// 短信验证码登录
export const loginByMsgCode = ({ mobile, code }) => {
  return request('/login/code', 'POST', { mobile, code })
}

// 获取短信验证码-登录
export const getMsgCode = (mobile) => {
  return request('/login/code', 'GET', { mobile })
}

// QQ登录
export const loginByQQ = (unionId, source = 6) => {
  return request('/login/social', 'POST', { unionId, source })
}

// 发送绑定手机号所需验证码
export const getBindMsgCode = (mobile) => {
  return request('/login/social/code', 'GET', { mobile })
}

// 立即绑定
export const bindWithMobile = (unionId, mobile, code) => {
  return request('/login/social/code', 'POST', { unionId, mobile, code })
}

// 判断用户名是否已存在
export const accountUniqueCheck = (account) => {
  return request('/register/check', 'GET', { account })
}

// 获得完善资料所需验证码
export const getQQPatchCode = (mobile) => {
  return request('/register/code', 'GET', { mobile })
}

// 完善资料
export const complementProfile = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'POST', { unionId, mobile, code, account, password })
}

// 手机号+密码注册
export const registerByMobile = (params) => {
  return request('/register', 'POST', params)
}

// 获取短信验证码-注册
export const getMsgCodeForRegister = (mobile) => {
  return request('/register/code', 'GET', { mobile })
}
