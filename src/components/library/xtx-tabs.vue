<script lang='jsx'>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'

export default {
  name: 'XtxTabs',

  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    // 给xtx-tabs-panel传值
    provide('activeName', activeName)
    // 点击选项卡的点击事件
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }

    return { activeName, tabClick }
  },

  render () {
    const panels = this.$slots.default()
    const dynamicPanels = []
    panels.forEach(panel => {
      if (panel.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(panel)
      } else {
        panel.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a
              href="javascript:;"
              class={{ active: item.props.name === this.activeName }}
              onClick={() => this.tabClick(item.props.name, i)}
            >
              {item.props.label}
            </a>
          )
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, panels]}</div>
  }
}
</script>
<style scoped lang="less">
.xtx-tabs {
  background-color: #fff;
  > nav {
    display: flex;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        line-height: 56px;
      }
    }
  }
}
</style>
