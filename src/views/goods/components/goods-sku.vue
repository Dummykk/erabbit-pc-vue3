<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            @click="clickSpecs(item, val)"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-else
            @click="clickSpecs(item, val)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import getPowerSet from '@/vender/power-set'

export default {
  name: 'GoodsSku',

  props: {
    goods: {
      type: Object,
      default: () => {}
    },

    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    // 根据传入的skuId初始化规格的选中状态
    initSelectedStatus(props.goods, props.skuId)

    // 初始化时更新规格的禁用状态
    updateDisableStatus(props.goods.specs, pathMap)

    // 选择规格
    const clickSpecs = (item, val) => {
      if (val.disabled) {
        return
      }
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(bv => { bv.selected = false })
        val.selected = true
      }

      // 点击的时候更新规格禁用状态
      updateDisableStatus(props.goods.specs, pathMap)

      // 触发change事件，将sku数据传递出去
      const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
      // 规格选择完整后才传递数据
      if (selectedArr.length === props.goods.specs.length) {
        const skuId = pathMap[selectedArr.join(separator)][0]
        const sku = props.goods.skus.find(sku => sku.id === skuId)
        emit('change', {
          skuId,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '')
        })
      } else {
        // 规格选择不完整，传递{}
        emit('change', {})
      }
    }

    return { clickSpecs }
  }
}

const separator = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存（有效）的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组
      const specs = sku.specs.map(spec => spec.valueName)
      // 3. 得到sku属性值数组的子集
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象
      powerSet.forEach(set => {
        const key = set.join(separator)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 获得当前选中的集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 更新规格的可点击状态
const updateDisableStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach(val => {
      // 已经选中的规格不用判断
      if (val.selected) {
        return
      }
      // 将未选择的规格依次替换到selectedArr对应位置
      selectedArr[i] = val.name
      // 过滤无效值得到key
      const key = selectedArr.filter(v => v).join(separator)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}

// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}

</script>

<style lang='less' scoped>
.sku-state-mixin() {
  border: 1px solid #e4e4e4;
  margin: 5px 10px 5px 0;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin();
      }
      > span {
        display: inline-block;
        padding: 0 20px;
        height: 30px;
        line-height: 28px;
        .sku-state-mixin();
      }
    }
  }
}
</style>
