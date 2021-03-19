import Auth from '@/utils/auth'

export default {
  state: {
    token: Auth.getToken(),
    info: {},
    privileges: '',
  },

  getters: {
    user: state => state.info,
    privileges: state => state.privileges,
  },

  mutations: {
    user_setToken: (state, token) => {
      state.token = token
      Auth.setToken(token)
    },
    user_setUser: (state, user) => {
      state.info = user
    },
    user_setPrivileges: (state, privileges) => {
      state.privileges = privileges
    },
  },

  actions: {
    user_setToken({ commit }, token = '') {
      commit('user_setToken', token)
    },

    user_setUser({ commit }, data = {}) {
      commit('user_setUser', data)
    },
    user_setPrivileges({ commit }, privileges) {
      commit('user_setPrivileges', privileges)
    },

    user_signOut({ commit }) {
      commit('user_setUser', '')
      commit('user_setToken', '')
      Auth.removeToken()
    },
  },
}
