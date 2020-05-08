import request from '@/utils/request'

export function createMessage(data) {
  return request({
    url: '/admin/system/message/create',
    method: 'post',
    params: data
  })
}
