// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * It makes a GET request to the /api/user/currentUser endpoint, and returns the response data as a
 * JSON object
 * @param [options] - { [key: string]: any }
 * @returns An object with a data property that is an API.CurrentUser
 */
export function currentUser(options?: { [key: string]: any }) {
  let token = localStorage.getItem('token');

  const inputData = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  };

  return request<{
    data: API.CurrentUser;
  }>('/api/user/currentUser', inputData);
}

/**
 * It removes the token from localStorage
 * @param [options] - The parameters passed in by the user.
 * @returns The token is being removed from local storage.
 */
export async function outLogin(options?: { [key: string]: any }) {
  return localStorage.removeItem('token');
}

/**
 * `login` is a function that takes a `body` and an `options` object, and returns a `Promise` that
 * resolves to an `API.LoginResult` object
 * @param body - API.LoginParams
 * @param [options] - The options object is used to pass in any additional options to the request.
 * @returns A promise that resolves to an object with the following shape:
 * {
 *   data: API.LoginResult,
 *   status: number,
 *   statusText: string,
 *   headers: { [key: string]: string },
 *   config: { [key: string]: any },
 * }
 */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * `register` is a function that takes a `body` parameter of type `API.RegisterParams` and an optional
 * `options` parameter of type `{ [key: string]: any }` and returns a `Promise<API.LoginResult>`
 * @param body - API.RegisterParams
 * @param [options] - { [key: string]: any }
 * @returns A promise that resolves to an object of type API.LoginResult
 */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function checkout(body: {}, options?: { [key: string]: any }) {
  return request('/api/user/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * `getNotices` is a function that returns a `Promise` of type `API.NoticeIconList` and takes an
 * optional parameter of type `{ [key: string]: any }`
 * @param [options] - The parameters that will be passed to the request.
 * @returns A promise that resolves to an object with the following shape:
 */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/user/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * `rule` is a function that returns a promise that resolves to an object of type `API.RuleList`
 * @param params - The parameters that will be sent to the server.
 * @param [options] - The options object is used to pass additional options to the request.
 * @returns A promise that resolves to an object with the following shape:
 */
export async function rule(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/user/account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * `updateRule` updates a rule
 * @param [options] - The parameters that will be sent to the server.
 * @returns A promise that resolves to an object with the following shape:
 * {
 *   data: API.RuleListItem;
 *   headers: { [key: string]: string };
 *   request: XMLHttpRequest;
 *   status: number;
 *   statusText: string;
 * }
 */
export async function updateRule(params: { [key: string]: any }) {
  return request<API.RuleListItem>(`/api/user/account?email=${params.email}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * `addRule` is an async function that returns a `Promise<API.RuleListItem>` and takes an optional
 * `options` object
 * @param [options] - The request parameters.
 * @returns A promise that resolves to an object with the following shape:
 * {
 *   data: API.RuleListItem;
 *   headers: { [key: string]: string };
 *   request: XMLHttpRequest;
 *   status: number;
 *   statusText: string;
 * }
 */
export async function addRule(params: { [key: string]: any }) {
  return request<API.RuleListItem>(`/api/user/account?email=${params.email}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * It makes a DELETE request to the /api/user/account endpoint
 * @param [options] - The request parameters.
 * @returns A promise that resolves to a response object.
 */
export async function removeRule(params: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/user/account?email=${params.email}`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
