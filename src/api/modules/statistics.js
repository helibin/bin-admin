import request from '@/utils/request'

export default {
  myWristbandUsage(query) {
    return request({
      url: '/my-statistics/do/list-wristband-usage',
      method: 'get',
      params: query,
    })
  },
  myUserPayment(query) {
    return request({
      url: '/my-statistics/do/list-user-payment',
      method: 'get',
      params: query,
    })
  },
  myOrderSettlement(query) {
    return request({
      url: '/my-statistics/do/list-order-settlement',
      method: 'get',
      params: query,
    })
  },

  wristbandUsage(query) {
    return request({
      url: '/statistics/do/list-wristband-usage',
      method: 'get',
      params: query,
    })
  },
  userPayment(query) {
    return request({
      url: '/statistics/do/list-user-payment',
      method: 'get',
      params: query,
    })
  },
  orderSettlement(query) {
    return request({
      url: '/statistics/do/list-order-settlement',
      method: 'get',
      params: query,
    })
  },
}
