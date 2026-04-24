import { request, METHOD } from "@/utils/request";
// import Cookie from 'js-cookie'

// eslint-disable-next-line no-undef
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

// 资讯

// 资讯：列表
export async function infomationListQuery(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/news/getList`,
    METHOD.POST,
    param,
  );
}

// 资讯：详情
export function infomationDetail(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/news/detail`,
    METHOD.POST,
    param,
  );
}

// 资讯： 提交新增
export function infomationAdd(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(`${API_BASE_URL}/webApi/admin/news/add`, METHOD.POST, param);
}
// 资讯： 提交修改
export function infomationUpdate(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/news/updateNews`,
    METHOD.POST,
    param,
  );
}

// 栏目设置： 进入修改
export function infomationDel(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/news/deleteNews`,
    METHOD.POST,
    param,
  );
}

// 产品

// 产品：列表
export async function productListQuery(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/product/getList`,
    METHOD.POST,
    param,
  );
}

// 产品：详情
export function productDetail(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/product/detail`,
    METHOD.POST,
    param,
  );
}

// 产品： 提交新增
export function productAdd(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/product/add`,
    METHOD.POST,
    param,
  );
}
// 产品： 提交修改
export function productUpdate(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/product/updateProduct`,
    METHOD.POST,
    param,
  );
}

// 产品: 删除
export function productDel(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/product/deleteProduct`,
    METHOD.POST,
    param,
  );
}

// 文件、视频 1：视频 2：文件

// 文件、视频：列表
export async function linkListQuery(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/link/getList`,
    METHOD.POST,
    param,
  );
}

// 文件、视频：列表
export async function linkDetail(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/link/detail`,
    METHOD.POST,
    param,
  );
}

// 文件、视频： 提交新增
export function linkAdd(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(`${API_BASE_URL}/webApi/admin/link/add`, METHOD.POST, param);
}
// 文件、视频： 提交修改
export function linkUpdate(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/link/updateLink`,
    METHOD.POST,
    param,
  );
}

// 文件、视频: 删除
export function linkDel(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/link/deleteLink`,
    METHOD.POST,
    param,
  );
}

// 留言板

// 留言板：列表
export async function suggestListQuery(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/suggest/getList`,
    METHOD.POST,
    param,
  );
}

// 留言板：已读
export async function suggestReaded(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/suggest/readed`,
    METHOD.POST,
    param,
  );
}

// 订单

// 订单
export async function shoppingListQuery(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/shopping/getList`,
    METHOD.POST,
    param,
  );
}

// 订单：详情
export async function shoppingDetail(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/shopping/detail`,
    METHOD.POST,
    param,
  );
}

// 关于我们
export async function webConfigAbout(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/webConfig/aboutUs`,
    METHOD.POST,
    param,
  );
}

// 关于我们 get
export async function getWebConfigAbout() {
  return request(
    `${API_BASE_URL}/webApi/admin/webConfig/getAboutUs`,
    METHOD.POST,
  );
}

// 公共配置
export async function webConfig(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/webConfig/setConfig`,
    METHOD.POST,
    param,
  );
}

// 公共配置 get
export async function getWebConfig(data) {
  let param = new FormData();
  Object.keys(data).forEach((item) => {
    param.append(item, data[item]);
  });
  return request(
    `${API_BASE_URL}/webApi/admin/webConfig/getConfig`,
    METHOD.POST,
    param,
  );
}
