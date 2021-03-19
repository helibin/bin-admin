import request from '@/utils/request'

export default {
  list(cate, query) {
    return request({
      url: `/${cate}/do/list`,
      method: 'get',
      params: query,
    })
  },
  get(cate, targetId) {
    return request({
      url: `/${cate}/${targetId}/do/get`,
      method: 'get',
    })
  },
  add(cate, data) {
    return request({
      url: `/${cate}/do/add`,
      method: 'post',
      data,
    })
  },
  modify(cate, targetId, data) {
    return request({
      url: `/${cate}/${targetId}/do/modify`,
      method: 'post',
      data,
    })
  },
  setDisable(cate, targetId, data) {
    return request({
      url: `/${cate}/${targetId}/do/set-disable`,
      method: 'post',
      data,
    })
  },
  delete(cate, targetId) {
    return request({
      url: `/${cate}/${targetId}/do/delete`,
      method: 'get',
    })
  },
  upload(cate, targetId, data) {
    return request({
      url: `/${cate}/${targetId}/do/upload`,
      method: 'post',
      data,
    })
  },

  post(url, data) {
    return request({
      method: 'post',
      url,
      data,
    })
  },
  fetch(url, query) {
    return request({
      method: 'get',
      url,
      params: query,
    })
  },
}
