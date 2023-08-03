<template>
  <div class="goods-comment-image">
    <div class="list">
      <a
        v-for="url in pictures"
        :key="url"
        href="javascript:;"
        :class="{ active: currentPicture === url }"
        @click="selectPicture(url)"
      >
        <img :src="url" />
      </a>
    </div>
    <div class="preview" v-if="currentPicture">
      <img :src="currentPicture" />
      <i class="iconfont icon-close-new" @click="currentPicture = ''"></i>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'GoodsCommentImage',

  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },

  setup () {
    const currentPicture = ref('')
    const selectPicture = (url) => {
      if (currentPicture.value === url) {
        currentPicture.value = ''
      } else currentPicture.value = url
    }

    return { selectPicture, currentPicture }
  }
}
</script>

<style lang='less' scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  a {
    margin-right: 20px;
    margin-bottom: 10px;
    width: 120px;
    height: 120px;
    border: 1px solid #e4e4e4;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &.active {
      border-color: @xtxColor;
    }
  }
}
.preview {
  position: relative;
  margin-bottom: 20px;
  width: 480px;
  height: 480px;
  background-color: #f8f8f8;
  border: 1px solid #e4e4e4;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  i {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    line-height: 30px;
    color: #fff;
  }
}
</style>
