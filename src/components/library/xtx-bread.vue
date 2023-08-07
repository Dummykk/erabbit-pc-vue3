// 去除template标签
<script>
import { h } from 'vue'

export default {
  name: 'XtxBread',

  // setup () {
  //   // 获取所有的'默认'插槽
  //   const items = getCurrentInstance().slots.default()
  //   const dynamicItems = []
  //   items.forEach((item, index) => {
  //     dynamicItems.push(item)
  //     if (index < items.length - 1) {
  //       /*
  //       h()函数用来创建结构
  //         参数1：节点类型
  //         参数2：节点属性、数据
  //         参数3：子节点
  //       返回值就是该组件的内容
  //       */
  //       dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
  //     }
  //   })
  //   // 请确保返回的是一个函数而不是一个值！setup() 函数在每个组件中只会被调用一次，而返回的渲染函数将会被调用多次。
  //   return () => h('div', { class: 'xtx-bread' }, dynamicItems)
  // }

  render () {
    // 用法
    // 1. template 标签去除，单文件组件
    // 2. 返回值就是组件内容
    // 3. vue2.0 的h函数传参进来的，vue3.0 的h函数导入进来
    // 4. h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
    // 需求
    // 1. 创建xtx-bread父容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签，应该由render函数来组织
    // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
    // 5. 把动态创建的节点渲染再xtx-bread标签中
    const items = this.$slots.default()
    const dynamicItems = []
    items.forEach((item, i) => {
      dynamicItems.push(item)
      if (i < (items.length - 1)) {
        dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dynamicItems)
  }
}
</script>

<style lang='less' scoped>
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  ::v-deep &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  ::v-deep i {
    margin: 0 5px;
    line-height: 22px;
    font-size: 12px;
  }
}
</style>
