// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * `options` is a function that takes an object of type `{ [key: string]: any }` and returns a promise
 * that resolves to an object of type `{}`
 * @param [options] - The options object is a key-value pair object. The key is the name of the
 * parameter, and the value is the value of the parameter.
 */
export async function options(options?: { [key: string]: any }) {
  return request<{}>('/api/tdadata/options', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function historicalPrices(options?: { [key: string]: any }) {
  return request<{}>('/api/tdadata/historicalPrices', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function volatility(options?: { [key: string]: any }) {
  return request<{}>('/api/tdadata/volatility', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}
