import store from '@/store'

import * as t from '@/utils'
import Auth from '@/utils/auth'

import { ManageUsers } from '../api'
import { requireSignedRouter, noSignedRouter } from '../router'

import 'nprogress/nprogress.css' // progress bar style
import NProgress from 'nprogress' // progress bar
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import router from '@/router'

// 判断访问权限
function hasPermission(privileges, to) {
  if (t.isEmpty(privileges)) return false
  if (privileges === '*') return true
  if (requireSignedRouter.some(r => (r.redirect ? r.path + r.redirect : r.path === to.path))) return true

  return _hasPermission(store.getters.permission_routers, to)
}

function _hasPermission(routers, to) {
  return routers.some(router => {
    if (router.children && router.children.length) {
      return _hasPermission(router.children, to)
    }

    return store.getters.privileges.split(',').includes(to.meta.privilege)
  })
}

// 访问页面前处理
store.dispatch('app_setEnv', {
  baseURL: process.env.BASE_API,
  wwwBaseURL: process.env.WWW_BASE_API,
  H5HOST: process.env.H5_HOST,
  oss: process.env.OSS,
})
router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar

  if (noSignedRouter.some(r => r.path === to.path)) return next()

  if (t.isEmpty(Auth.getToken())) {
    next('/sign-in')
    NProgress.done()
  } else {
    if (to.path === '/sign-in') return next('/')

    if (t.isEmpty(store.getters.user)) {
      // 准备用户信息
      const { data } = await ManageUsers.getMyInfo()
      store.dispatch('user_setUser', data)
    }

    // 准备用户权限
    if (t.isEmpty(store.getters.privileges)) {
      store.dispatch('user_setPrivileges', store.getters.user.privileges)

      // 根据权限生成可访问的路由表
      store.dispatch('permission_setRouter', store.getters.privileges)

      // 动态添加可访问路由表
      router.addRoutes(store.getters.addRouters)
      next({ ...to, replace: true })
    }

    // 访问权限控制
    if (!hasPermission(store.getters.privileges, to)) {
      NProgress.done()
      return next({
        path: '/401',
        replace: true,
        query: { noGoBack: true },
      })
    }

    next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
