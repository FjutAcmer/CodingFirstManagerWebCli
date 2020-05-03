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

export function simTwoProblem(params) {
  return request({
    url: '/admin/spider/problem/sim',
    method: 'post',
    params: params
  })
}

export function getProblemSimReport(params) {
  return request({
    url: '/admin/spider/problem/sim/report',
    method: 'post',
    params: params
  })
}

export function localizedProblem(data) {
  return request({
    url: '/admin/spider/problem/localized',
    method: 'post',
    data: data
  })
}
