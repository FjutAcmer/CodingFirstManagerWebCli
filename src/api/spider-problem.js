import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/spider/problem/list',
    method: 'get',
    params: params
  })
}

export function getInfo(params) {
  return request({
    url: '/admin/spider/problem/info',
    method: 'get',
    params: params
  })
}
