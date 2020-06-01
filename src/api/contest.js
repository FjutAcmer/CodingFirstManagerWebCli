import request from '@/utils/request'

export function fetchContestList(query) {
  return request({
    url: '/contest/list',
    method: 'get',
    params: query
  })
}

export function fetchContest(id) {
  return request({
    url: '/admin/contest/info',
    method: 'get',
    params: { id }
  })
}

export function fetchContestProblems(contestId) {
  return request({
    url: '/contest/problem/list',
    method: 'get',
    params: { contestId }
  })
}

export function createContest(data) {
  return request({
    url: '/admin/contest/create',
    method: 'post',
    data
  })
}

export function updateContest(data) {
  return request({
    url: '/admin/contest/update',
    method: 'post',
    data
  })
}

export function fetchContestReviews(query) {
  return request({
    url: '/admin/contest/review/list',
    method: 'get',
    params: query
  })
}

export function updateReview(data) {
  return request({
    url: '/admin/contest/review/update',
    method: 'put',
    params: data
  })
}

export function getContestInProgress() {
  return request({
    url: '/admin/contest/countInProgress',
    method: 'get'
  })
}

export function getContestTypeCount() {
  return request({
    url: '/admin/contest/contestTypeCount',
    method: 'get'
  })
}
