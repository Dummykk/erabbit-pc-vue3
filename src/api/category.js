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

export const getTopCategory = (id) => {
  return request('/category', 'GET', { id })
}

export const getSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'GET', { id })
}

export const getSubCategoryGoods = (data) => {
  return request('/category/goods/temporary', 'POST', data)
}
