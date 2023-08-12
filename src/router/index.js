import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: '',
        component: () => import('@/views/home')
      },
      {
        path: '/category/:id',
        component: () => import('@/views/category')
      },
      {
        path: '/category/sub/:id',
        component: () => import('@/views/category/sub-category')
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods')
      },
      {
        path: '/cart',
        component: () => import('@/views/cart')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/pay/pay-checkout-page')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      },
      {
        path: '/member',
        component: () => import('@/views/member/Layout'),
        children: [
          {
            path: '',
            component: () => import('@/views/member/home')
          },
          {
            path: '/member/order',
            component: { render: () => h(<router-view/>) },
            children: [
              {
                path: '',
                component: () => import('@/views/member/order')
              },
              {
                path: ':id',
                component: () => import('@/views/member/order/detail-page')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/login-callback')
  },
  {
    path: '/register',
    component: () => import('@/views/login/register-page')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 权限控制-跳转到/member开头的地址时检查是否登录
  if (to.path.startsWith('/member') && !token) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
