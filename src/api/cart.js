import request from '@/utils/request'

// 获取最新商品信息
export const getNewestGoodsInfo = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'GET')
}

// 合并本地购物车
export const mergeLocalCart = (cartList) => {
  return request('/member/cart/merge', 'POST', cartList)
}

// 登录后获取购物车列表
export const getCartList = () => {
  return request('/member/cart', 'GET')
}

// 加入购物车
export const addToCart = ({ skuId, count }) => {
  return request('/member/cart', 'POST', { skuId, count })
}

// 删除商品
export const deleteGoods = (ids) => {
  return request('/member/cart', 'DELETE', { ids })
}

// 修改购物车商品的选中状态和数量
export const updateGoodsSelectedAndCount = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'PUT', { selected, count })
}

// 全选/反选
export const checkAllGoods = ({ selected, ids }) => {
  return request('/member/cart/selected', 'PUT', { selected, ids })
}
