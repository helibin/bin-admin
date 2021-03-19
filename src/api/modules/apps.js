import request from '@/utils/request'

export default {
  audit(targetId, data) {
    return request({
      url: `/apps/${targetId}/do/audit`,
      method: 'post',
      data,
    })
  },

  listAvalibleManageUsers() {
    return request({
      url: '/apps/manage-users/do/list',
      method: 'get',
    })
  },
}
