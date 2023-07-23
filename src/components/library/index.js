// 自定义插件、自定义指令：扩展vue原有的功能
// vue3插件：导出一个对象，有install函数u，默认传入了app应用实例，在app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'

export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
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
