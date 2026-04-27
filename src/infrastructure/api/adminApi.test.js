import { createSkill, updateSkill, deleteSkill, verifyNgo } from './adminApi.js';

vi.mock('./client.js', () => ({
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

import { post, put, del } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('adminApi', () => {
  it('createSkill llama a POST /admin/skills con los datos', () => {
    const data = { name: 'React', category: 'frontend' };
    createSkill(data);
    expect(post).toHaveBeenCalledWith('/admin/skills', data);
  });

  it('updateSkill llama a PUT /admin/skills/:id con los datos', () => {
    const data = { name: 'React Updated' };
    updateSkill('skill-1', data);
    expect(put).toHaveBeenCalledWith('/admin/skills/skill-1', data);
  });

  it('deleteSkill llama a DELETE /admin/skills/:id', () => {
    deleteSkill('skill-1');
    expect(del).toHaveBeenCalledWith('/admin/skills/skill-1');
  });

  it('verifyNgo llama a PUT /admin/ngos/:userId/verify', () => {
    verifyNgo('user-1');
    expect(put).toHaveBeenCalledWith('/admin/ngos/user-1/verify', {});
  });
});
