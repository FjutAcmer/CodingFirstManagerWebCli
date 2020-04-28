import request from '@/utils/request'

export function fetchAllTitle() {
  return request({
    url: '/admin/user/title/all',
    method: 'get'
  })
}

export function fetchTitleList(query) {
  return request({
    url: '/admin/user/title/list',
    method: 'get',
    params: query
  })
}

export function createTitle(data) {
  return request({
    url: '/admin/user/title/create',
    method: 'post',
    data
  })
}

export function updateTitle(data) {
  return request({
    url: '/admin/user/title/update',
    method: 'put',
    data
  })
}

export function deleteTitle(id) {
  return request({
    url: '/admin/user/title/delete',
    method: 'delete',
    params: { id }
  })
}
