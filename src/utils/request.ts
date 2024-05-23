// 进行axios二次封装：使用请求与响应拦截器
import axios from 'axios'
// 引入element-plus的消息提示组件
import { ElMessage } from 'element-plus'
// 第一步：利用axios对象的create方法，去创建axios实例（其他的配置：基础路径、超时的时间）
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user';

let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
// 第二步：request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // config配置对象，包括hearders属性请求头，经常给服务端携带公共参数
    let useStore = useUserStore()
    if(useStore.token){
        config.headers.token = useStore.token
    }
  // config配置对象，包括hearders属性请求头，经常给服务端携带公共参数
  // 返回配置对象
  return config
})

// 第三步：响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    // 简化数据
    return response.data
  },
  (error) => {
    let message = ''
    let status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    // 提示错误信息
    ElMessage({
      type: error,
      message,
    })
    return Promise.reject(error)
  },
)

// 对外暴露
export default request
