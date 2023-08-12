import request from '@/utils/request'

// 获取订单信息
export const getOrderInfo = () => {
  return request('/member/order/pre', 'GET')
}

// 添加收货地址
export const addAddress = (addressObj) => {
  return request('/member/address', 'POST', addressObj)
}

// 修改收货地址
export const editAddress = (addressObj) => {
  return request(`/member/address/${addressObj.id}`, 'PUT', addressObj)
}

// 删除收货地址
export const delAddress = (id) => {
  return request(`/member/address/${id}`, 'DELETE')
}

// 提交订单
export const submitOrder = (order) => {
  return request('/member/order', 'POST', order)
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request(`/member/order/${id}`, 'GET')
}

// 获取订单列表
export const getOrderList = ({ orderState, page, pageSize }) => {
  return request('/member/order', 'GET', { orderState, page, pageSize })
}

// 取消订单
export const cancelOrder = (orderId, cancelReason) => {
  return request(`/member/order/${orderId}/cancel`, 'PUT', { cancelReason })
}

// 删除订单
export const deleteOrder = (ids) => {
  return request('/member/order', 'DELETE', { ids })
}

// 确认收货
export const confirmReceipt = (id) => {
  return request(`/member/order/${id}/receipt`, 'PUT')
}

// 再次购买
export const repurchaseGoods = (id) => {
  return request(`/member/order/repurchase/${id}`, 'GET')
}
