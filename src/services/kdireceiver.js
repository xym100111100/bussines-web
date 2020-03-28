import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/receiver?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/receiver/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/receiver', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/receiver', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/receiver?${stringify(params)}`, {
    method: 'DELETE',
  });
}
