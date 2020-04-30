import request from '@/utils/request'

export function fetchAdminList(query) {
  return request({
    url: '/admin/permission/get_admin',
    method: 'get',
    params: query
  })
}

export function fetchAdminPermission(username) {
  return request({
    url: '/admin/permission/list',
    method: 'get',
    params: { username }
  })
}

export function fetchPermissionType() {
  return request({
    url: '/admin/permission/type',
    method: 'get'
  })
}

export function updatePermission(data) {
  return request({
    url: '/admin/permission/update_permission',
    method: 'post',
    data
  })
}

export function revokeAdmin(username) {
  return request({
    url: '/admin/permission/revoke_admin',
    method: 'delete',
    params: { username }
  })
}

export function grantAdmin(data) {
  return request({
    url: '/admin/permission/grant_admin',
    method: 'post',
    params: data
  })
}
