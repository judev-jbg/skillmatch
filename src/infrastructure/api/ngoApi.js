import { get, put } from './client.js';

export function getNgoMe() {
  return get('/ngos/me');
}

export function updateNgoMe(data) {
  return put('/ngos/me', data);
}
