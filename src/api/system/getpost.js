import qs from "qs";
import request from '@/utils/request'


export const urls= 'http://localhost:8013/api/'
export function requestGet(url, params) {
  return request({
    url: url  + qs.stringify(params),
    method: 'get',
  })
}
export function requestPost(url,param) {
  // const Data=qs.stringify(param)
  return request({
    header:'multipart/form-data',
    url: url ,
    method: 'post',
    data:param

  })
}
export function requestFile(url,param) {

  return request({
    header: 'multipart/form-data',
    url: url,
    method: 'post',
    data: param

  })
}
  export function requestJSon(url,param) {
    return request({
      header:'application/json',
      url: url ,
      method: 'post',
      dataType:'json',
      data:param

    })
}

