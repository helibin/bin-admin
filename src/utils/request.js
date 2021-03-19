import axios from 'axios'
import { Message } from 'element-ui'
import Auth from '@/utils/auth'
import store from '@/store'
import * as t from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 20 * 1000,
  withCredentials: true,
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 自定义header
    config.headers['x-auth-token'] = Auth.getToken()

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// response interce`ptor
service.interceptors.response.use(
  response => response.data,
  error => {
    const res = error.response
    if (t.isEmpty(res)) {
      Message({
        showClose: true,
        message: '当前网络状况不好，请重试',
        type: 'error',
      })
      return Promise.reject(error)
    }

    if (res.status === 401) {
      Auth.removeToken()
      store.dispatch('user_signOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }

    return Promise.reject(res.data)
  },
)

export default service
