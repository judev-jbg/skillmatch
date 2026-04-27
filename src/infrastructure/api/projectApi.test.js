import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectSkills,
  updateProjectStatus,
  cancelProject,
} from './projectApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

import { get, post, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('projectApi', () => {
  it('getAllProjects llama a GET /projects sin filtros', () => {
    getAllProjects();
    expect(get).toHaveBeenCalledWith('/projects', { params: {} });
  });

  it('getAllProjects llama a GET /projects con filtros', () => {
    getAllProjects({ status: 'open' });
    expect(get).toHaveBeenCalledWith('/projects', { params: { status: 'open' } });
  });

  it('getProjectById llama a GET /projects/:id', () => {
    getProjectById('proj-1');
    expect(get).toHaveBeenCalledWith('/projects/proj-1');
  });

  it('createProject llama a POST /projects con los datos', () => {
    const data = { title: 'Proyecto Test', description: 'Desc' };
    createProject(data);
    expect(post).toHaveBeenCalledWith('/projects', data);
  });

  it('updateProject llama a PUT /projects/:id con los datos', () => {
    const data = { title: 'Nuevo título' };
    updateProject('proj-1', data);
    expect(put).toHaveBeenCalledWith('/projects/proj-1', data);
  });

  it('updateProjectSkills llama a PUT /projects/:id/skills con el array de skills', () => {
    const skills = [{ skill_id: 'abc', level: 'advanced' }];
    updateProjectSkills('proj-1', skills);
    expect(put).toHaveBeenCalledWith('/projects/proj-1/skills', { skills });
  });

  it('updateProjectStatus llama a PUT /projects/:id/status con el estado', () => {
    updateProjectStatus('proj-1', 'active');
    expect(put).toHaveBeenCalledWith('/projects/proj-1/status', { status: 'active' });
  });

  it('cancelProject llama a PUT /projects/:id/cancel', () => {
    cancelProject('proj-1');
    expect(put).toHaveBeenCalledWith('/projects/proj-1/cancel', {});
  });
});
