import request from '@/utils/request'
import { getMd5 } from '@/utils/md5'
export default {
  signIn(data, captchaToken, captcha) {
    data = { ...data }
    data.password = getMd5(data.password)
    data = {
      ...data,
      captchaToken,
      captcha,
    }
    return request({
      url: '/auth/manage-user/do/sign-in',
      method: 'post',
      data,
    })
  },
  signOut() {
    return request({
      url: '/auth/manage-user/do/sign-out',
      method: 'get',
    })
  },
  applySTSToken(cate) {
    return request({
      url: '/auth/sts-token/do/apply',
      method: 'get',
      params: { cate },
    })
  },
}
