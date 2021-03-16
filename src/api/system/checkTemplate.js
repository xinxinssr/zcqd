import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/checkTemplate',
    header:'application/json',
    dataType:'json',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/checkTemplate/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/checkTemplate',
    header:'application/json',
    dataType:'json',
    method: 'put',
    data
  })
}

export default { add, edit, del }
