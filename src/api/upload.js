import request from '@/utils/request'

export function uploadFile(avatar) {
  return request({
    url: '/upload/avatar',
    method: 'post',
    data: avatar
  })
}
