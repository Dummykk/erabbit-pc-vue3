import request from '@/utils/request'

/**
 * 获取收藏分页数据
 * @param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns
 */
export const getCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}

// 获取足迹
export const getHistory = ({ page = 1, pageSize = 10 }) => {
  return request('/member/browseHistory', 'GET', { page, pageSize })
}
