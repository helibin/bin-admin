import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Router Modules */
import baseicRouter from './noSignedRouter'
import requireSignedRouter from './requireSignedRouter'

// 功能模块
import statisticsRouter from './modules/statisticsRouter'
import systemConfigsRouter from './modules/systemConfigsRouter'

// 组合功能模块
// import userCenterRouter from './userCenterRouter'
import clientDataRouter from './clientDataRouter'
import systemResourceRouter from './systemResourceRouter'
import userManageRouter from './userManageRouter'

// 侧边栏菜单排列顺序
const modulesRouter = [
  // ...userCenterRouter,
  ...clientDataRouter,
  ...systemResourceRouter,
  ...userManageRouter,
  ...statisticsRouter,
  ...systemConfigsRouter,
]

const mainRouter = [...modulesRouter]

const noSignedRouter = [...baseicRouter]

const router = new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...requireSignedRouter, ...noSignedRouter],
})

export default router
export { mainRouter, requireSignedRouter, noSignedRouter }
