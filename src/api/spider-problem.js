import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/spider/problem/list',
    method: 'get',
    params: params
  })
}
