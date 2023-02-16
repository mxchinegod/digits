// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * This function is used to get the dark pool data from the API
 * @param [options] - { [key: string]: any }
 */
export async function schedule(options?: { [key: string]: any }) {
  return request<{}>('/api/altdata/reserve/schedule', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}
