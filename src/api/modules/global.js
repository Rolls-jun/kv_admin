import {request, METHOD} from '@/utils/request'

// get的参数是parmas, post是 data

// 绑定微信openid和系统账户
/**
 * @param openId 微信openId
 * @param username username
 * @param password password
 */

// 上传图片
export function uploadPhoto(file,typeName = 'image') {
  const param = new FormData()
  param.append('file', file);
  param.append('type', typeName);
  return request('/webApi/admin/user/uploadFile',METHOD.POST,param).catch((err) => err);
}
