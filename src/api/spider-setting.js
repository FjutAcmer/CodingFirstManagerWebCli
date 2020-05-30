import request from '@/utils/request'

export function getList() {
  return request({
    url: '/admin/spider/setting/list',
    method: 'post'
  })
}

export function saveSetting(data) {
  return request({
    url: '/admin/spider/setting/save',
    method: 'post',
    data: data
  })
}
