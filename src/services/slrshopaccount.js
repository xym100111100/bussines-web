import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询已添加和未添加的店铺账号
 * @param {*} params 
 */
export async function getShopAccountList(params) {
  return request(`/slr-svr/slr/shopaccount/listaddedAndunaddedusers?${stringify(params)}`);
}

/**
 * 查询未添加的店铺账号
 * @param {*} params 
 */
export async function listUnaddedAccounts(params) {
  return request(`/slr-svr/slr/shopaccount/listunaddedusers?${stringify(params)}`);
}

/**
 * 查询已添加的店铺账号
 * @param {*} params 
 */
export async function listAddedAccounts(params) {
  return request(`/slr-svr/slr/shopaccount/listaddedusers?${stringify(params)}`);
}

/**
 * 删除店铺账号
 */
export async function delAccounts(params) {
  return request('/slr-svr/slr/shopaccount', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

/**
 * 添加店铺账号
 * @param {*} params 
 */
export async function addAccounts(params) {
  return request(`/slr-svr/slr/shopaccount`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * 获取单个店铺帐号信息
 * @param {*} params 
 */
export async function getone(params) {
  return request(`/slr-svr/slr/shopaccount/getOneShopAccount?${stringify(params)}`);
}
