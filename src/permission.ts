// 路由鉴权：项目中能不能被访问的权限设置（某一个路由什么条件下可以访问，什么条件下不可以访问）
import router from '@/router'
import setting from '@/setting'
// import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// @ts-ignore
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
let useStore = useUserStore(pinia)
// 全局守卫：项目中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  // to：你将要访问哪个路由
  // from：你从哪个路由而来
  // next：路由的放行函数
  // 进度条开始
  nprogress.start()
  // 获取token，去判断用户登录，还是未登录
  let token = useStore.token
  // 获取用户名字
  let username = useStore.username
  // 用户登录判断
  if (token) {
    // 登录成功，不能访问login，指向home
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问其余六个路由（登录排除）
      // 有用户信息
      if (username) {
        // 放行
        next()
      } else {
        // 如果没有用户信息，在守卫这里发请求获取到了用户信息再放行
        try {
          // 获取用户信息
          await useStore.userInfo()
          // 放行
          // 万一刷新的时候是异步路由，有可能获取到用户信息、异步路由还没有加载完毕，出现空白的效果
          next({...to})
        } catch (error) {
          // token过期：获取不到用户信息了
          // 用户手动修改本地存储token
          // 退出登录->用户相关的数据清空
          await useStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫
router.afterEach((to: any, _from: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  // 进度条结束
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条业务 ---nprogress
// 第二个问题：路由鉴权（路由组件访问权限的设置）
// 全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）

// 用户未登录：可以访问login，其余六个路由不能访问（指向login）
// 用户登录成功：不可以访问login（指向首页）
