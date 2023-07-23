import request from '@/utils/request'

/**
 * 获取首页头部分类数据
 */
export const getAllCategory = () => {
  return request('/home/category/head', 'GET')
}

export const getBrand = (limit) => {
  return request('/home/brand', 'GET', { limit })
}
