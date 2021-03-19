import { mainRouter, requireSignedRouter, noSignedRouter } from '@/router'

function filtermainRouter(mainRouter, privileges) {
  const accessedRouters = mainRouter.filter(router => {
    if (
      privileges.some(privilege => router.meta && router.meta.privilege && router.meta.privilege.includes(privilege))
    ) {
      if (router.children && router.children.length) {
        router.children = filtermainRouter(router.children, privileges)
      }

      return true
    }
  })

  return accessedRouters
}

const permission = {
  state: {
    routers: noSignedRouter,
    addRouters: [],
  },
  mutations: {
    permission_setRouter: (state, routers = []) => {
      state.addRouters = routers
      state.routers = [...requireSignedRouter, ...noSignedRouter, ...routers]
    },
  },
  actions: {
    permission_setRouter({ commit }, privileges = '*') {
      let accessedRouters = []

      if (privileges) {
        if (privileges === '*') {
          accessedRouters = mainRouter
        } else {
          privileges = privileges.split(',')
          accessedRouters = filtermainRouter(mainRouter, privileges)
        }
      }
      commit('permission_setRouter', accessedRouters)
    },
  },
}

export default permission
