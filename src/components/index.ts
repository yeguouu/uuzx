// 引入项目中的全部全局组件
import SvgIcon from './SvgIcon/index.vue'
// 引入elemnet-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Category from './Category/index.vue'

// 定义全局组件对象：用于存放所有要引入的全局组件
const allGlobalComponents: any = {
  SvgIcon,
  Category,
}
// 对外暴露一个插件对象
export default {
  install(app: any) {
    // 遍历注册全局组件对象中的所有组件
    Object.keys(allGlobalComponents).forEach((keys) => {
      app.component(keys, allGlobalComponents[keys])
    });
    // 将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
