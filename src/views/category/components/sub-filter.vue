<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌</div>
      <div class="body">
        <a
          :class="{ active: filterData.selectedBrand === brand.id }"
          href="javascript:;"
          v-for="brand in filterData.brands"
          :key="brand.id"
          @click="selectBrand(brand.id)"
        >
          {{ brand.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="prop in filterData.saleProperties" :key="prop.id">
      <div class="head">{{ prop.name }}</div>
      <div class="body">
        <a
          :class="{ active: prop.selectedProp === attr.id }"
          href="javascript:;"
          v-for="attr in prop.properties"
          :key="attr.id"
          @click="selectAttr(prop, attr.id)"
        >
          {{ attr.name }}
        </a>
      </div>
    </div>
  </div>
  <div class="sub-filter" v-else>
    <xtx-skeleton
      v-for="i in 5"
      :key="i"
      class="item"
      width="800px"
      height="40px"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',

  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref({})
    const filterLoading = ref(false)

    watch(() => route.params.id, (newVal, oldVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        filterLoading.value = true
        getSubCategoryFilter(route.params.id).then(({ result }) => {
          result.selectedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          result.saleProperties.forEach(p => {
            p.selectedProp = null
            p.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    const getFilterParams = () => {
      const filterParams = {}
      const attrs = []
      filterParams.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(p => {
        const attr = p.properties.find(attr => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) {
        filterParams.attrs = attrs
      }
      return filterParams
    }

    const selectBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) {
        return
      }
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }

    const selectAttr = (saleProp, attrId) => {
      if (saleProp.selectedProp === attrId) {
        return
      }
      saleProp.selectedProp = attrId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, selectBrand, selectAttr }
  }
}
</script>

<style lang='less' scoped>
.sub-filter {
  background-color: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        display: inline-block;
        margin-right: 36px;
        transition: all 0.3s;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
