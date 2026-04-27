import {
  createDeliverable,
  getDeliverablesByAssignment,
  getDeliverableById,
  startDeliverable,
  submitDeliverable,
  reviewDeliverable,
} from './deliverableApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

import { get, post, put } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('deliverableApi', () => {
  it('createDeliverable llama a POST /deliverables con los datos', () => {
    const data = { assignment_id: 'assign-1', title: 'Entregable 1' };
    createDeliverable(data);
    expect(post).toHaveBeenCalledWith('/deliverables', data);
  });

  it('getDeliverablesByAssignment llama a GET /deliverables con assignment_id como query param', () => {
    getDeliverablesByAssignment('assign-1');
    expect(get).toHaveBeenCalledWith('/deliverables', { params: { assignment_id: 'assign-1' } });
  });

  it('getDeliverableById llama a GET /deliverables/:id', () => {
    getDeliverableById('del-1');
    expect(get).toHaveBeenCalledWith('/deliverables/del-1');
  });

  it('startDeliverable llama a PUT /deliverables/:id/start', () => {
    startDeliverable('del-1');
    expect(put).toHaveBeenCalledWith('/deliverables/del-1/start', {});
  });

  it('submitDeliverable llama a PUT /deliverables/:id/submit con el archivo', () => {
    const file = new File(['content'], 'report.pdf');
    submitDeliverable('del-1', file);
    expect(put).toHaveBeenCalledWith('/deliverables/del-1/submit', { file });
  });

  it('reviewDeliverable llama a PUT /deliverables/:id/review con los datos', () => {
    const data = { score: 8, feedback: 'Buen trabajo' };
    reviewDeliverable('del-1', data);
    expect(put).toHaveBeenCalledWith('/deliverables/del-1/review', data);
  });
});
