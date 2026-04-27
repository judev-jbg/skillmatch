import { get, post, put } from './client.js';

export function createDeliverable(data) {
  return post('/deliverables', data);
}

export function getDeliverablesByAssignment(assignmentId) {
  return get('/deliverables', { params: { assignment_id: assignmentId } });
}

export function getDeliverableById(id) {
  return get(`/deliverables/${id}`);
}

export function startDeliverable(id) {
  return put(`/deliverables/${id}/start`, {});
}

export function submitDeliverable(id, file) {
  return put(`/deliverables/${id}/submit`, { file });
}

export function reviewDeliverable(id, data) {
  return put(`/deliverables/${id}/review`, data);
}
