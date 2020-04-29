import request from '@/utils/request'

export function getStatus() {
  return request({
    url: '/admin/spider/status',
    method: 'post'
  })
}

export function getItems(data) {
  return request({
    url: '/admin/spider/items',
    method: 'post',
    params: data
  })
}
