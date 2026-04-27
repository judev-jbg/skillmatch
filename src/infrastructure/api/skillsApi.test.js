import { getAllSkills } from './skillsApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
}));

import { get } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('skillsApi', () => {
  it('getAllSkills llama a GET /skills sin filtros', () => {
    getAllSkills();
    expect(get).toHaveBeenCalledWith('/skills', { params: {} });
  });

  it('getAllSkills llama a GET /skills con filtros', () => {
    getAllSkills({ category: 'tech' });
    expect(get).toHaveBeenCalledWith('/skills', { params: { category: 'tech' } });
  });
});
