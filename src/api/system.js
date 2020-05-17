import request from '@/utils/request'

export function createMessage(data) {
  return request({
    url: '/admin/system/message/create',
    method: 'post',
    params: data
  })
}

export function fetchBugReportList(query) {
  return request({
    url: '/admin/system/bugReport/list',
    method: 'get',
    params: query
  })
}

export function updateBugFixed(id) {
  return request({
    url: '/admin/system/bugReport/update',
    method: 'put',
    params: { id }
  })
}
