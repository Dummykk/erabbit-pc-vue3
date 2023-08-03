import { createRouter, createWebHashHistory } from 'vue-router'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
