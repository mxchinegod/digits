// @ts-ignore
/* eslint-disable */
// API 更新时间：
// API 唯一标识：
import * as api from './api';
import { request } from '@umijs/max';

export async function health(options?: { [key: string]: any }) {
  return request('/api/setup/status', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export default {
  api,
  parseJwt,
};
