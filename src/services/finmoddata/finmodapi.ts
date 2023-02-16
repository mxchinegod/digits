// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * `options` is a function that takes an object of type `{ [key: string]: any }` and returns a promise
 * that resolves to an object of type `{}`
 * @param [options] - The options object is a key-value pair object. The key is the name of the
 * parameter, and the value is the value of the parameter.
 */
export async function historicalPrices(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/historicalPrices', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function secFiling(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/secFiling', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function financialGrowth(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/financialGrowth', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function financialRatios(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/financialRatios', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function dcf(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/dcf', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function erTranscript(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/erTranscript', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function senateDisclosure(options?: { [key: string]: any }) {
  return request<{}>('/api/finmoddata/senateDisclosure', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}
