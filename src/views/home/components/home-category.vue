<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <li
        :class="{ active: categoryId && categoryId === item.id }"
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="categoryId = item.id"
      >
        <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
        <template v-if="item.children">
          <router-link
            :to="`/category/sub/${sub.id}`"
            v-for="sub in item.children"
            :key="sub.id"
            >{{ sub.name }}</router-link
          >
        </template>
        <template v-else>
          <xtx-skeleton
            :width="'60px'"
            :height="'18px'"
            style="margin-right: 5px"
            :bg="'rgba(255, 255, 255, 0.2)'"
          />
          <xtx-skeleton
            :width="'50px'"
            :height="'18px'"
            :bg="'rgba(255, 255, 255, 0.2)'"
          />
        </template>
      </li>
    </ul>
    <div class="layer" v-if="currentCategory">
      <h4>
        {{ currentCategory.id === 'brand' ? '品牌' : '分类' }}推荐<small
          >根据您的购买或浏览记录推荐</small
        >
      </h4>
      <ul
        v-if="
          currentCategory &&
          currentCategory.goods &&
          currentCategory.goods.length
        "
      >
        <li v-for="item in currentCategory.goods" :key="item.id">
          <router-link :to="`/product/${item.id}`">
            <img v-lazy="item.picture" />
            <div class="info">
              <p class="name ellipsis-2">
                {{ item.name }}
              </p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </router-link>
        </li>
      </ul>
      <ul
        v-if="
          currentCategory &&
          currentCategory.brands &&
          currentCategory.brands.length
        "
      >
        <li class="brand" v-for="item in currentCategory.brands" :key="item.id">
          <router-link to="/">
            <img v-lazy="item.picture" />
            <div class="info">
              <p class="place">
                {{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { getBrand } from '@/api/category'
import xtxSkeleton from '@/components/library/xtx-skeleton.vue'
export default {
  components: { xtxSkeleton },
  name: 'HomeCategory',

  setup () {
    const store = useStore()

    // 左侧分类菜单数据
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }],
      brands: []
    })

    getBrand(6).then(data => {
      brand.brands = data.result
    })

    const menuList = computed(() => {
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          // 弹出层数据
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })

    const categoryId = ref(null)
    const currentCategory = computed(() => {
      return menuList.value.find(item => {
        return item.id === categoryId.value
      })
    })

    return { menuList, categoryId, currentCategory }
  }
}
</script>

<style lang='less' scoped>
.home-category {
  position: relative;
  z-index: 99;
  height: 500px;
  width: 250px;
  background: rgba(0, 0, 0, 0.8);
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background-color: @xtxColor;
      }
      a {
        margin-right: 5px;
        vertical-align: middle;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    position: absolute;
    left: 250px;
    top: 0;
    padding-left: 15px;
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
        margin-left: 5px;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 15px;
        margin-bottom: 15px;
        width: 310px;
        height: 120px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 4px;
        a {
          display: flex;
          align-items: center;
          padding: 10px;
          width: 100%;
          height: 100%;
          &:hover {
            background-color: rgba(75, 129, 218, 0.18);
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
