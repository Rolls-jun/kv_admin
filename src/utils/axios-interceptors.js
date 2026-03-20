import Cookie from 'js-cookie'
import { removeAuthorization } from '@/utils/request';
import { Modal } from 'ant-design-vue';

const respError = {
  onFulfilled(response, options) {
    const { code } = response.data;
    if (code === 400 || code === 401 ||code === 500 || code === 100 || code === 201 || code === 901 || code === 25 || code === 26 || code === 81 || code === 82 || code === 99 || code === 904 || code === 903 || code === 902) {
      Modal.confirm({
        title: `提示`,
        content: `${response.data.message}`,
        centered: true,
        okText: '确认',
        cancelText: '关闭所有提示',
        onCancel() {
          Modal.destroyAll();
        },
      });
    } else if (code === 11 || code === 12 || code === 13 || code === 14 || code === 21 || code === 22 || code === 23 || code === 24 || code === 900) {
      Modal.confirm({
        title: `提示`,
        content: `${response.data.message}`,
        centered: true,
        okText: '确认',
        onOk() {
          options.router.push({
            path: '/login',
          });
          removeAuthorization();
          Cookie.remove('token');
        },
        cancelText: '关闭所有提示',
        onCancel() {
          Modal.destroyAll();
          options.router.push({
            path: '/login',
          });
          removeAuthorization();
          Cookie.remove('token');
        },
      });
    }
    return response;
  },
};
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 401) {
      message.error('无此权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    console.log('resp401===',error)

    const {message} = options
    const {response} = error
    if (response.status === 401) {
      message.error('无此权限')
    }
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 403) {
      message.error('请求被拒绝')
    }
    return response
  },
  onRejected(error, options) {
    console.log('resp403===',error)

    const {message} = options
    const {response} = error
    if (response.status === 403) {
      message.error('请求被拒绝')
    }
    return Promise.reject(error)
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    if (!config.data) {
      config.data = new FormData()
     }
    config.data.append('user_id', Cookie.get('token'))
    const {message} = options
    const {url, xsrfCookieName} = config
    if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('认证 token 已过期，请重新登录')
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403,respError] // 响应拦截
}
