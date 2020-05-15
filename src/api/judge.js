import request from '@/utils/request'

export function fetchJudgeList(query) {
  return request({
    url: '/admin/judge/list',
    method: 'get',
    params: query
  })
}

export function fetchJudgeInfo(id) {
  return request({
    url: '/admin/judge/info',
    method: 'get',
    params: { id }
  })
}

export function getAcAndSubmit() {
  return request({
    url: '/admin/judge/acAndSubmit',
    method: 'get'
  })
}

export function getLanguageCount() {
  return request({
    url: '/admin/judge/languageCount',
    method: 'get'
  })
}

