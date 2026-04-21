/**
 * Tests para el módulo de API de estudiantes.
 */

import { getStudentMe, updateStudentMe, updateStudentSkills } from './studentApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

import { get, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('studentApi', () => {
  it('getStudentMe llama a GET /students/me', () => {
    getStudentMe();
    expect(get).toHaveBeenCalledWith('/students/me');
  });

  it('updateStudentMe llama a PUT /students/me con los datos del perfil', () => {
    const data = { availability: true, portfolio: 'https://portfolio.dev' };
    updateStudentMe(data);
    expect(put).toHaveBeenCalledWith('/students/me', data);
  });

  it('updateStudentSkills llama a PUT /students/me/skills con el array de skills envuelto', () => {
    const skills = [{ skill_id: 'abc', level: 'intermediate' }];
    updateStudentSkills(skills);
    expect(put).toHaveBeenCalledWith('/students/me/skills', { skills });
  });
});
