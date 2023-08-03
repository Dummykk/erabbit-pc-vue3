<template>
  <div class="goods-comments">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentsInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentsInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="(item, i) in commentsInfo.tags"
            :key="item.title"
            href="javascript:;"
            :class="{ active: currentTagIndex === i }"
            @click="selectTag(i)"
          >
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        @click="changeSort(null)"
      >
        默认
      </a>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        @click="changeSort('praiseCount')"
      >
        最热
      </a>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        @click="changeSort('createTime')"
      >
        最新
      </a>
    </div>
    <!-- 列表 -->
    <div class="list">
      <div v-for="item in commentsList" :key="item.id" class="item">
        <div class="user">
          <img
            src="http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/avatar_1.png"
            alt=""
          />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              v-for="i in item.score"
              :key="i + '1'"
              class="iconfont icon-wjx01"
            ></i>
            <i
              v-for="i in 5 - item.score"
              :key="i + '2'"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <!-- 图片 -->
          <goods-comment-image
            v-if="item.pictures.length"
            :pictures="item.pictures"
          />
          <div class="time">
            <span>{{ item.orderInfo.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <xtx-pagination
      v-if="totalCount"
      :totalData="totalCount"
      :currentPage="reqParams.page"
      @currentPage-change="changePage"
    />
  </div>
</template>

<script>
import { inject, reactive, ref, watch } from 'vue'
import { getCommentsByGoods, getCommentsListByGoods } from '@/api/product'
import goodsCommentImage from './goods-comment-image.vue'
export default {
  components: { goodsCommentImage },
  name: 'GoodsComments',

  setup () {
    const goodsInfo = inject('goodsInfo')

    // 获取评论信息
    const commentsInfo = getComments(goodsInfo.value.id)

    // 选择标签
    const currentTagIndex = ref(0)
    const selectTag = (i) => {
      currentTagIndex.value = i
      const currentTag = commentsInfo.value.tags[i]
      if (currentTag.type === 'all') {
        reqParams.hasPicture = false
        reqParams.tag = null
      } else if (currentTag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = false
        reqParams.tag = currentTag.title
      }
      reqParams.page = 1
    }

    // 筛选评论的条件
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: false,
      tag: null,
      sortField: null
    })

    // 改变排序方式
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      reqParams.page = 1
    }

    const commentsList = ref([])
    const totalCount = ref(0)
    watch(reqParams, () => {
      getCommentsListByGoods(goodsInfo.value.id, reqParams)
        .then(data => {
          commentsList.value = data.result.items
          totalCount.value = data.result.counts
        })
    }, { immediate: true })

    // 改变页码
    const changePage = (val) => {
      reqParams.page = val
    }

    // 产品信息
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }
    // 隐藏昵称
    const formatNickname = (nickName) => {
      return nickName.substring(0, 1) + '***' + nickName.substring(nickName.length - 1)
    }

    return { commentsInfo, currentTagIndex, selectTag, changeSort, commentsList, formatSpecs, formatNickname, reqParams, totalCount, changePage }
  }
}

const getComments = (id) => {
  const commentsInfo = ref({})
  getCommentsByGoods(id).then(data => {
    data.result.tags.unshift({
      type: 'img',
      title: '有图',
      tagCount: data.result.hasPictureCount
    })
    data.result.tags.unshift({
      type: 'all',
      title: '全部评价',
      tagCount: data.result.evaluateCount
    })
    commentsInfo.value = data.result
  })

  return commentsInfo
}
</script>

<style lang='less' scoped>
.head {
  display: flex;
  padding: 30px 0;
  .data {
    display: flex;
    padding: 20px;
    width: 340px;
    p {
      flex: 1;
      text-align: center;
    }
    span {
      display: block;
      &:first-child {
        font-size: 32px;
        color: @priceColor;
      }
      &:last-child {
        color: #999;
      }
    }
  }
  .tags {
    display: flex;
    flex: 1;
    border-left: 1px solid #f5f5f5;
    .dt {
      font-weight: bold;
      width: 100px;
      text-align: center;
      line-height: 42px;
    }
    .dd {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      > a {
        width: 132px;
        height: 42px;
        background-color: #f5f5f5;
        margin-left: 20px;
        margin-bottom: 20px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        color: #999;
        text-align: center;
        line-height: 40px;
        &:hover {
          border-color: @xtxColor;
          background-color: lighten(@xtxColor, 50%);
          color: @xtxColor;
        }
        &.active {
          background-color: @xtxColor;
          border-color: @xtxColor;
          color: #fff;
        }
      }
    }
  }
}
.sort {
  margin: 0 20px;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  color: #666;
  > span {
    margin-left: 20px;
  }
  > a {
    margin-left: 30px;
    &.active,
    &:hover {
      color: @xtxColor;
    }
  }
}
.list {
  padding: 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        color: #999;
      }
    }
  }
}
</style>
