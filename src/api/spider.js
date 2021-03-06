import request from '@/utils/request'

export function getStatus() {
  return request({
    url: '/admin/spider/status',
    method: 'post'
  })
}

export function getSites(data) {
  return request({
    url: '/admin/spider/sites',
    method: 'post',
    params: data
  })
}

export function getItems(data) {
  return request({
    url: '/admin/spider/items',
    method: 'post',
    params: data
  })
}

export function startFullSpider(data) {
  return request({
    url: '/admin/spider/start/full',
    method: 'post',
    data: data
  })
}

export function startSpecSpider(data) {
  return request({
    url: '/admin/spider/start/spec',
    method: 'post',
    data: data
  })
}

export function rangeCheck(data) {
  return request({
    url: '/admin/spider/range/check',
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

export function getSpiderJobCountDay(data) {
  return request({
    url: '/admin/spider/count/days',
    method: 'post',
    params: data
  })
}
