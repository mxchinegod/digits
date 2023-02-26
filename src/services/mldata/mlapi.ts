// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * It takes in an object of options, and returns a promise that resolves to an object
 * @param [options] - The parameters that will be passed to the API.
 */
export async function summarize(options?: { [key: string]: any }) {
  return request<{}>('/api/mldata/bart_cnn', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function autoDD(options?: { [key: string]: any }) {
  return request<{}>('/api/mldata/autodd', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function greeks(options?: { [key: string]: any }) {
  return request<{}>('/api/mldata/greeks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function agi(options?: { [key: string]: any }) {
  return request<{}>('/api/mldata/agi', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}

export async function pdfSentiment(options?: { [key: string]: any }) {
  return request<{}>('/api/mldata/pdfSentiment', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}
