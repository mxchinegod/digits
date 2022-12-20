import { request } from 'umi';
import type { TableListParams } from './data';

export async function queryRule(params?: TableListParams) {
  return request('/api/user/account', {
    params,
  });
}

export async function removeRule(params: { _id: string|string[] }) {
  return request('/api/user/account', {
    method: 'DELETE',
    data: params
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/user/account', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request(`/api/user/account?_id=${params._id}`, {
    method: 'PUT',
    data: {
      ...params
    },
  });
}