import request from '@/utils/request'
// 获取列表数据
export async function getList(params: any): Promise<any> {
  return request({
    url: '/smartroad/forpublic/selectpermission',
    method: 'get',
    params,
  })
}

// 获取单个数据详情
export async function getInfo(params: String): Promise<any> {
  return request(`/smartroad/forpublic/selectone?rscid=${params}`)
}

// 空驶取消按钮处理，状态变更处理
export async function updataStatus(data: any): Promise<any> {
  return request({
    url: '/smartroad/forpublic/updateStatus',
    method: 'POST',
    data,
  })
}

// 图片上传接口
export async function upDataImg(data: any): Promise<any> {
  return request({
    method: 'POST',
    url: '/smartroad/forpublic/uploadImg',
    data,
  })
}
/**
 *
 * @param query
 * @returns // 获取班组列表
 */
export async function getTeam(query: any): Promise<any> {
  return request({
    method: 'GET',
    url: `/smartroad/forpublic/selectmove?userid=${query}`,
  })
}
// 根据用户id获取方案组列表
export async function getGroup(query: any): Promise<any> {
  return request({
    method: 'GET',
    url: `/smartroad/forpublic/getRescueTeam?createdBy=${query}`,
  })
}
/**
 *
 * @param query
 * @returns 根据数据id获取方案组列表
 */
export async function getGroupID(query: any): Promise<any> {
  return request({
    method: 'GET',
    url: `/smartroad/forpublic/getOneRescueTeam?id=${query}`,
  })
}
/**
 *
 * @param data
 * @returns  修改救援方案组
 */
export async function editGroup(query: any): Promise<any> {
  return request({
    method: 'POST',
    url: '/smartroad/forpublic/updateRescueTeam',
    data: query,
  })
}
/**
 *
 * @param data
 * @returns  新增救援方案组
 */
export async function addGroup(query: any): Promise<any> {
  return request({
    method: 'POST',
    url: '/smartroad/forpublic/insertRescueTeam',
    data: query,
  })
}

// 定时上传位置信息
export async function timeposition(query: any): Promise<any> {
  return request({
    method: 'POST',
    url: '/smartroad/forpublic/timeposition',
    data: query,
  })
}

// 调度员查询派发
export async function getCarList(query: any): Promise<any> {
  return request({
    method: 'GET',
    url: '/smartroad/forpublic/selectdistribution',
    data: query,
  })
}
