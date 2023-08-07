import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'
// 准备div
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 该函数用于渲染xtx-confirm组件，传入标题和文本内容
// 函数返回promise对象
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }

    // 1. 渲染组件
    // 2. 点击“确认”：触发resolve()，同时销毁组件
    // 3. 点击“取消”：触发reject()，同事销毁组件
    const vnode = createVNode(XtxConfirm, { title, text, submitCallback, cancelCallback })
    render(vnode, div)
  })
}
