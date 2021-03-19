import Cookies from 'js-cookie'

const TokenKey = 'x_auth_token'

export default {
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },
}
