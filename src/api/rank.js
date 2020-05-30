import request from '@/utils/request'

export function fetchHonorRank(query) {
  return request({
    url: '/border/honor_rank',
    method: 'get',
    params: query
  })
}

export function fetchHonor(id) {
  return request({
    url: '/admin/border/info',
    method: 'get',
    params: { id }
  })
}

export function createHonor(data) {
  return request({
    url: '/admin/border/create',
    method: 'post',
    data
  })
}

export function updateHonor(data) {
  return request({
    url: '/admin/border/update',
    method: 'post',
    data
  })
}

export function deleteHonor(id) {
  return request({
    url: '/admin/border/delete',
    method: 'delete',
    params: { id }
  })
}
