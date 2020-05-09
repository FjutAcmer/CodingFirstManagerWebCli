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

export function startSpider(data) {
  return request({
    url: '/admin/spider/start',
    method: 'post',
    data: data
  })
}

export function getSpiderLogRealtime(data) {
  return request({
    url: '/admin/spider/log/realtime',
    method: 'post',
    data: data
  })
}

export function getSpiderJobInfo(data) {
  return request({
    url: '/admin/spider/job/info',
    method: 'post',
    params: data
  })
}

export function getSpiderJobList(data) {
  return request({
    url: '/admin/spider/job/list',
    method: 'get',
    params: data
  })
}
