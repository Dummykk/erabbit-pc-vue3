<template>
  <xtx-bread>
    <xtx-bread-item to="/">首页</xtx-bread-item>
    <xtx-bread-item v-if="category.top" :to="`/category/${category.top.id}`">
      {{ category.top.name }}
    </xtx-bread-item>
    <transition name="fade-bread-item" mode="out-in">
      <xtx-bread-item v-if="category.sub" :key="category.sub.id">
        {{ category.sub.name }}
      </xtx-bread-item>
    </transition>
  </xtx-bread>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',

  setup () {
    const route = useRoute()
    const store = useStore()

    const category = computed(() => {
      const currentCate = {}
      store.state.category.list.forEach(top => {
        top.children && top.children.forEach(sub => {
          if (sub.id === route.params.id) {
            currentCate.sub = { id: sub.id, name: sub.name }
            currentCate.top = { id: top.id, name: top.name }
          }
        })
      })
      return currentCate
    })

    return { category }
  }
}
</script>

<style lang='less' scoped>
</style>
