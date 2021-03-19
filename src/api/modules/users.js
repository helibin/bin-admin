import request from '@/utils/request'
import { getMd5 } from '@/utils/md5'

export default {
  add(data) {
    data = { ...data }
    data.password = getMd5(data.password)
    return request({
      url: '/users/do/add',
      method: 'post',
      data,
    })
  },

  listMyUsers(query) {
    return request({
      url: '/my-users/do/list',
      method: 'get',
      params: query,
    })
  },

  bindWristband(targetId, data) {
    return request({
      url: `/my-users/${targetId}/do/bind-wristband`,
      method: 'post',
      data,
    })
  },

  unbindWristband(targetId, data) {
    return request({
      url: `/my-users/${targetId}/do/unbind-wristband`,
      method: 'post',
      data,
    })
  },
}
