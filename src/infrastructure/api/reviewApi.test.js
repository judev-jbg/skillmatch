import { createReview, getReviewsByUser } from './reviewApi.js';

vi.mock('./client.js', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

import { get, post } from './client.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('reviewApi', () => {
  it('createReview llama a POST /reviews con los datos', () => {
    const data = { assignment_id: 'assign-1', score: 9, comment: 'Excelente' };
    createReview(data);
    expect(post).toHaveBeenCalledWith('/reviews', data);
  });

  it('getReviewsByUser llama a GET /reviews con user_id como query param', () => {
    getReviewsByUser('user-1');
    expect(get).toHaveBeenCalledWith('/reviews', { params: { user_id: 'user-1' } });
  });
});
