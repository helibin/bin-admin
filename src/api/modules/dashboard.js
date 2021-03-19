import request from '@/utils/request'
export default {
  getOverview(query) {
    return request({
      url: '/dashboard/do/overview',
      method: 'get',
      params: query,
    })
  },

  getOverviewLine(query) {
    return request({
      url: '/dashboard/do/overview-line',
      method: 'get',
      params: query,
    })
  },
}
