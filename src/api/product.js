import request from '@/utils/request'

export const getGoodsDetail = (id) => {
  return request('/goods', 'GET', { id })
}

export const getRelevantGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'GET', { id, limit })
}

export const getHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}

export const getCommentsByGoods = (id) => {
  // return request(`/goods/${id}/evaluate`, 'GET')
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'GET')
}

export const getCommentsListByGoods = (id, reqParams) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'GET', { reqParams })
}

export const getSpecsBySkuId = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'GET')
}
