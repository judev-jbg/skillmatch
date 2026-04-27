import { get, post, put } from './client.js';

export function getAllProjects(filters = {}) {
  return get('/projects', { params: filters });
}

export function getOwnProjects(filters = {}) {
  return get('/projects/me', { params: filters });
}

export function getProjectById(id) {
  return get(`/projects/${id}`);
}

export function createProject(data) {
  return post('/projects', data);
}

export function updateProject(id, data) {
  return put(`/projects/${id}`, data);
}

export function updateProjectSkills(id, skills) {
  return put(`/projects/${id}/skills`, { skills });
}

export function updateProjectStatus(id, status) {
  return put(`/projects/${id}/status`, { status });
}

export function cancelProject(id) {
  return put(`/projects/${id}/cancel`, {});
}
