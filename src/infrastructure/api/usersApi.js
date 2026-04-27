import { get, put } from './client.js';

export function getUserMe() {
  return get('/users/me');
}

export function updateUserMe(data) {
  return put('/users/me', data);
}
