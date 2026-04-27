import { get } from './client.js';

export function downloadCertificate(id) {
  return get(`/certificates/${id}`, { responseType: 'blob' });
}
