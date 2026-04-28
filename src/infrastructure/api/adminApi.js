import { get, post, put, del } from './client.js';

export function createSkill(data) {
  return post('/admin/skills', data);
}

export function updateSkill(id, data) {
  return put(`/admin/skills/${id}`, data);
}

export function deleteSkill(id) {
  return del(`/admin/skills/${id}`);
}

export function verifyNgo(userId) {
  return put(`/admin/verify-ngo/${userId}`, {});
}

export function getUnverifiedNgos() {
  return get('/admin/ngos');
}
