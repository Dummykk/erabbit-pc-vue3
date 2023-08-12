<template>
  <div class="container">
    <app-member-aside />
    <article class="article">
      <!-- 三级路由 -->
      <router-view></router-view>
    </article>
  </div>
</template>

<script>
import appMemberAside from '@/components/app-member-aside.vue'
export default {
  components: { appMemberAside }

}
</script>

<style lang='less' scoped>
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
    background-color: #fff;
  }
}
</style>
