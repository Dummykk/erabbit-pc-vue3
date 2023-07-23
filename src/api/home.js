import request from '@/utils/request'

export const getBanner = (distributionSite) => {
  return request('/home/banner', 'GET', { distributionSite })
}

export const getNew = (limit) => {
  return request('/home/new', 'GET', { limit })
}

export const getHot = () => {
  return request('/home/hot', 'GET')
}

export const getBrand = (limit) => {
  return request('/home/brand', 'GET', { limit })
}

export const getGoods = () => {
  return request('/home/goods', 'GET')
}

export const getSpecial = () => {
  return request('/home/special', 'GET')
}
