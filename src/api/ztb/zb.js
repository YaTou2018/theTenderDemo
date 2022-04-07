import request from '@/utils/request'

// 查询-投标数据
export function getList(data) {
  return request({
    url: '/project/getZbFileList',
    method: 'post',
    data: data
  })
}

// 获取左侧数据列表
export function getLeft(data) {
  return request({
    url: '/project/getGroupByType',
    method: 'post',
    data: data
  })
}
// 查询【招标文件指标】
export function getZbIndex(data) {
  return request({
    url: '/ztb/zb/getZbIndex',
    method: 'get',
    data: data
  })
}
// 查询【投标文件指标】
export function getTbIndex(data) {
  return request({
    url: '/ztb/zb/getZbIndex',
    method: 'get',
    data: data
  })
}