import { downloadCertificate } from './certificateApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
}));

import { get } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('certificateApi', () => {
  it('downloadCertificate llama a GET /certificates/:id con responseType blob', () => {
    downloadCertificate('cert-1');
    expect(get).toHaveBeenCalledWith('/certificates/cert-1', { responseType: 'blob' });
  });
});
