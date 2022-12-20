// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * It makes a POST request to the /api/altdata/news endpoint.
 * @param [options] - This is an object that contains the parameters that you want to pass to the API.
 */
export async function everything(options?: { [key: string]: any }) {
  return request<{}>('/api/altdata/news', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    ...(options || {}),
  });
}
