import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
// 下面这行注释是为了解决报错
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册全局组件
import globalComponent from '@/components'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入路由
import router from '@/router'
// 引入大仓库
import pinia from './store'
// 引入路由鉴权文件
import './permission'
// 引入暗黑模式所需的element组件
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App)
app.use(ElementPlus);
app.use(ElementPlus, {
  locale: zhCn, //element-plus国际化配置
})
console.log(import.meta.env) 
app.use(globalComponent)
// 注册模板路由
app.use(router)
// 安装仓库
app.use(pinia)
// 引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
// 将应用挂载到挂载点上
app.mount('#app')