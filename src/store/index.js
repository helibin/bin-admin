import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import env from './modules/env'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 对应于vue下的state的模块
  modules: {
    app,
    env,
    errorLog,
    permission,
    tagsView,
    user,
  },
  getters,
})

export default store
