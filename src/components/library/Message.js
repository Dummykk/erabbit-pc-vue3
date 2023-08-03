// 提供一个能显示xtx-message组件的函数
/* 这个函数
    1. 可以被导入直接使用
    import Message from 'Message.js'
    Message({type: 'error', text: '提示文字'})
    2. 也可以挂载到vue实例原型上
    this.$message({type: 'error', text: '提示文字'})
 */
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 根据xtx-message.vue渲染消息提示
  // 1. 导入组件
  // 2. 根据组件创建虚拟节点
  const vnode = createVNode(XtxMessage, { type, text })
  // 3. 准备一个DOM容器
  // 4. 把虚拟节点渲染到DOM容器中
  render(vnode, div)
  // 5. 开启定时，移除DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
