import request from '@/utils/request'

export function getStatus() {
  return request({
    url: '/admin/spider/status',
    method: 'post'
  })
}
