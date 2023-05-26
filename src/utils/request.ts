import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
// import { localStorage } from '@/utils/local-storage'
// import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Access-Token'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: 'http://140.249.206.14:8182/', // 不需要走代理,走代理报错"正式
  // baseURL: 'http://124.129.136.5:18182', // 测试地址
  // baseURL: 'http://192.168.3.73:8182/', // 不需要走代理192.168.3.226
  timeout: 60000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
const errorHandler = (error: RequestError): Promise<any> => {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 如果需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器 不需要
// const requestHandler = (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
//   const savedToken = localStorage.get(STORAGE_TOKEN_KEY)
//   // 如果 token 存在
//   // 让每个请求携带自定义 token, 请根据实际情况修改
//   if (savedToken)
//     config.headers[REQUEST_TOKEN_KEY] = savedToken

//   return config
// }

// Add a request interceptor
// request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
const responseHandler = (response: { data: any }) => {
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
