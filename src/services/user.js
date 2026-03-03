import { LOGIN, ROUTES } from '@/services/api'
import Cookie from 'js-cookie'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(LOGIN, METHOD.POST,param)
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  // localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  // localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  // localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
  Cookie.remove('token');
}
export default {
  login,
  logout,
  getRoutesConfig
}
