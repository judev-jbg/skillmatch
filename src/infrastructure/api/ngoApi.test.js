import { getNgoMe, updateNgoMe } from './ngoApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

import { get, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ngoApi', () => {
  it('getNgoMe llama a GET /ngos/me', () => {
    getNgoMe();
    expect(get).toHaveBeenCalledWith('/ngos/me');
  });

  it('updateNgoMe llama a PUT /ngos/me con los datos', () => {
    const data = { organization_name: 'ONG Test', area: 'educación' };
    updateNgoMe(data);
    expect(put).toHaveBeenCalledWith('/ngos/me', data);
  });
});
