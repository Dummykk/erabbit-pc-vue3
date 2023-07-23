import { topCategory } from '@/api/constants'
import { getAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state: () => {
    return {
      list: topCategory.map((item) => {
        return { name: item }
      })
    }
  },
  mutations: {
    setList (state, payload) {
      state.list = payload
    },
    /**
     * 修改category分类的显示状态isShow为true
     */
    show (state, category) {
      // 找到该category在store里对应的数据
      const target = state.list.find(item => item.id === category.id)
      target.isShow = true
    },
    /**
     * 修改category分类的显示状态isShow为false
     */
    hide (state, category) {
      // 找到该category在store里对应的数据
      const target = state.list.find(item => item.id === category.id)
      target.isShow = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await getAllCategory()
      // 给每个一级分类添加一个控制其二级分类显示状态的变量isShow
      result.forEach(item => { item.isShow = false })
      commit('setList', result)
    }
  }
}
