import {
  createAssignment,
  getAssignmentsByProject,
  getMyAssignments,
  getAssignmentById,
  acceptAssignment,
} from './assignmentApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

import { get, post, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('assignmentApi', () => {
  it('createAssignment llama a POST /assignments con application_id', () => {
    createAssignment('app-1');
    expect(post).toHaveBeenCalledWith('/assignments', { application_id: 'app-1' });
  });

  it('getAssignmentsByProject llama a GET /assignments con project_id como query param', () => {
    getAssignmentsByProject('proj-1');
    expect(get).toHaveBeenCalledWith('/assignments', { params: { project_id: 'proj-1' } });
  });

  it('getMyAssignments llama a GET /assignments/me', () => {
    getMyAssignments();
    expect(get).toHaveBeenCalledWith('/assignments/me');
  });

  it('getAssignmentById llama a GET /assignments/:id', () => {
    getAssignmentById('assign-1');
    expect(get).toHaveBeenCalledWith('/assignments/assign-1');
  });

  it('acceptAssignment llama a PUT /assignments/:id/accept', () => {
    acceptAssignment('assign-1');
    expect(put).toHaveBeenCalledWith('/assignments/assign-1/accept', {});
  });
});
