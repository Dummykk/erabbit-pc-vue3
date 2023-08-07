import { addToCart, checkAllGoods, deleteGoods, getCartList, getNewestGoodsInfo, mergeLocalCart, updateGoodsSelectedAndCount } from '@/api/cart'

export default {
  namespaced: true,

  state: () => {
    return {
      list: []
    }
  },

  mutations: {
    addToCart (state, goods) {
      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      if (sameIndex > -1) {
        // 添加的商品已经存在本地：数量相加
        state.list[sameIndex].count += goods.count
      } else {
        // 添加新商品
        state.list.unshift(goods)
      }
    },
    updateCart (state, goods) {
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    deleteGoods (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置本地购物车列表，也用于清空本地购物车
    setCartList (state, list) {
      state.list = list
    }
  },

  actions: {
    addToCart (context, goods) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          addToCart(goods)
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('addToCart', goods)
          resolve()
        }
      })
    },
    // 获取最新购物车列表信息
    updateCart (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          getCartList().then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          // Promise.all()：可以并列发送多个请求，等所有请求成功后，调用then
          // Promise.race()：可以并列发送多个请求，等最快的请求成功后，调用then
          // 传递的参数是promise数组
          const promiseArr = context.state.list.map(item => {
            return getNewestGoodsInfo(item.skuId)
          })
          Promise.all(promiseArr)
            .then(dataArr => {
              dataArr.forEach((data, i) => {
                context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
              })
              resolve()
            })
            .catch(e => {
              reject(e)
            })
        }
      })
    },

    // 删除商品
    deleteGoods (context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          deleteGoods([skuId])
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('deleteGoods', skuId)
          resolve()
        }
      })
    },

    // 修改选择状态和数量
    changeGoods (context, goods) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          updateGoodsSelectedAndCount(goods)
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('updateCart', goods)
          resolve()
        }
      })
    },

    // 有效商品的全选/反选
    checkAllGoods (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllGoods({ selected, ids })
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
          context.getters.validList.forEach(item => {
            context.commit('updateCart', { skuId: item.skuId, selected })
          })
        }
      })
    },

    // 批量删除，isClear用于清空无效商品
    batchDeleteGoods (context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
        // 已登录
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteGoods(ids)
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
        } else {
        // 未登录
          context.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteGoods', item.skuId)
          })
        }
      })
    },

    // 修改规格
    changeGoodsSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
        // 已登录
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteGoods([oldSkuId])
            .then(() => {
              return addToCart({ skuId: newSku, count: oldGoods.count })
            })
            .then(() => {
              return getCartList()
            })
            .then(data => {
              context.commit('setCartList', data.result)
              resolve()
            })
            .catch(e => {
              reject(new Error('修改规格失败'))
            })
        } else {
        // 未登录
          // 1. 获取旧商品信息
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧商品信息
          context.commit('deleteGoods', oldSkuId)
          // 3. 合并成一条新的商品信息
          const { skuId, price: nowPrice, oldPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, oldPrice, stock, attrsText }
          context.commit('addToCart', newGoods)
        }
      })
    },

    // 合并本地购物车
    async mergeLocalCart (context) {
      const cartList = context.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功后删除本地购物车
      context.commit('setCartList', [])
    }
  },

  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validCount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return (getters.validList.reduce((p, c) => p + (c.count * c.nowPrice * 100), 0) / 100).toFixed(2)
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedCount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return (getters.selectedList.reduce((p, c) => p + (c.count * c.nowPrice * 100), 0) / 100).toFixed(2)
    },
    // 是否全选
    isSelectAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }
}
