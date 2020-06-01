import request from '@/utils/request'

export function uploadFile(avatar) {
  return request({
    url: '/upload/picture',
    method: 'post',
    data: avatar
  })
}
