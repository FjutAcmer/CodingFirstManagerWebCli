import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    params
  })
}

export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'post',
    params
  })
}

export function logout(username) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: username
  })
}

export function fetchUserList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { id }
  })
}

export function fetchUserTitle(query) {
  return request({
    url: '/admin/user/title',
    method: 'get',
    params: query
  })
}

export function updateACB(data) {
  return request({
    url: '/admin/user/updateACB',
    method: 'put',
    data
  })
}

export function updatePsw(data) {
  return request({
    url: '/admin/user/updatePsw',
    method: 'put',
    data
  })
}

export function removeTitle(id) {
  return request({
    url: '/admin/user/removeTitle',
    method: 'delete',
    params: { id }
  })
}

export function addTitle(data) {
  return request({
    url: '/admin/user/addTitle',
    method: 'post',
    data
  })
}
