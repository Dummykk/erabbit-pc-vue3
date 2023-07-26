// 自定义插件、自定义指令：扩展vue原有的功能
// vue3插件：导出一个对象，有install函数u，默认传入了app应用实例，在app基础之上扩展

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'

// 批量注册组件
/*
require.context 是 webpack 中的一个函数，用于创建一个上下文环境，用于在指定目录下获取模块文件，它返回一个函数，该函数用于导入指定的模块
  参数1：要搜索的目录
  参数2：是否搜索子目录
  参数3：匹配文件的正则表达式
*/
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 返回的函数有一个keys()属性，其值是一个匹配到的文件路径数组
    importFn.keys().forEach(key => {
      // 如果模块使用ES6的export default导出，那么通过importFn(key)获取到的模块对象是一个包含default属性的对象，该属性就是导出的组件对象。
      const component = importFn(key).default
      app.component(component.name, component)
    })
    defineDirective(app)
  }
}

/*
  自定义图片懒加载指令v-lazy，获取到图片src数据后，先存储在本地，而不是立即赋给img的src属性进行请求并渲染，只有当图片进入可视区的时候，再赋给src属性进行图片的请求和渲染。

  为何不使用@vueuse/core中的useIntersectionObserver？
  useIntersectionObserver需要传入目标DOM作为参数，而图片数据过多，给每张图片设置ref属性不现实。
*/
const defineDirective = (app) => {
  app.directive('lazy', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          // 如果监听到src错误导致图片渲染失败，则传入默认图片
          el.addEventListener('error', () => {
            el.src = defaultImg
          })
          el.src = binding.value
        }
      })

      observer.observe(el)
    }
  })
}
