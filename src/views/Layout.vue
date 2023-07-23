<template>
  <app-navbar />
  <app-header />
  <app-header-sticky />
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <app-footer />
</template>

<script>
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'

export default {
  name: 'xtx-layout',

  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },

  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style>
</style>
