export default {
  state: {},

  getters: {
    env: state => state,
  },

  mutations: {
    app_setEnv: (state, data) => {
      state = Object.assign(state, data)
    },
  },

  actions: {
    app_setEnv({ commit }, data) {
      commit('app_setEnv', data)
    },
  },
}
