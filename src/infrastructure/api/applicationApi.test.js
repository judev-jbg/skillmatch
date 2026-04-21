/**
 * Tests para el módulo de API de aplicaciones.
 */

import { createApplication, getApplicationsByProject, updateApplicationStatus } from './applicationApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

import { get, post, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('applicationApi', () => {
  it('createApplication llama a POST /applications con project_id y student_id', () => {
    createApplication('proj-1', 'student-1');
    expect(post).toHaveBeenCalledWith('/applications', {
      project_id: 'proj-1',
      student_id: 'student-1',
    });
  });

  it('getApplicationsByProject llama a GET /applications con project_id como query param', () => {
    getApplicationsByProject('proj-1');
    expect(get).toHaveBeenCalledWith('/applications', { params: { project_id: 'proj-1' } });
  });

  it('updateApplicationStatus llama a PUT /applications/:id con el nuevo estado', () => {
    updateApplicationStatus('app-42', 'approved');
    expect(put).toHaveBeenCalledWith('/applications/app-42', { status: 'approved' });
  });
});
