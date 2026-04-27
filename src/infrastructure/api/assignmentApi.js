import { get, post, put } from './client.js';

export function createAssignment(applicationId) {
  return post('/assignments', { application_id: applicationId });
}

export function getAssignmentsByProject(projectId) {
  return get('/assignments', { params: { project_id: projectId } });
}

export function getMyAssignments() {
  return get('/assignments/me');
}

export function getAssignmentById(id) {
  return get(`/assignments/${id}`);
}

export function acceptAssignment(id) {
  return put(`/assignments/${id}/accept`, {});
}
