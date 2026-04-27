import { get } from './client.js';

export function getAllSkills(filters = {}) {
  return get('/skills', { params: filters });
}
