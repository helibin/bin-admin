import App from './App'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import uploader from 'vue-simple-uploader'

import Vue from 'vue'

import axios from 'axios'
import i18n from './i18n' // Internationalization
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import './icons' // icon
import './errorLog' // error log
// import './mock' // simulation data
import './middleware/pageMid'

import permission from '@/directive/permission' // 权限判断指令
Vue.use(permission)

import * as api from './api'
import baseAPI from './api/base'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => {
    i18n.t(key, value)
  },
})
Vue.use(uploader)

// 通用组件
import CommonDoArea from '@/pages/components/CommonDoArea'
import PageInfo from '@/pages/components/PageInfo'
import TimeInfo from '@/pages/components/TimeInfo'
Vue.component('CommonDoArea', CommonDoArea)
Vue.component('PageInfo', PageInfo)
Vue.component('TimeInfo', TimeInfo)

// 添加实例属性
Vue.prototype.$axios = axios
Vue.prototype.$api = api
Vue.prototype.$baseAPI = baseAPI
Vue.prototype.$run = async (func, ...args) => {
  try {
    if (typeof baseAPI[func] === 'function') {
      return await api[func](...args)
    } else {
      return await func(...args)
    }
  } catch (ex) {
    console.log(ex, 'ex,,,')
  }
}

// 注册全局过滤器
import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.config.errorHandler = function(err, vm, info) {
  console.error(err, vm, info, 'errorHandler,,,')
  // let { message, name, script, line, column, stack } = err
}

Vue.config.errorCaptured = (err, vm, info) => {
  console.error(err, vm, info, 'errorCaptured,,,')
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
})
