import { get, post } from './client.js';

export function createReview(data) {
  return post('/reviews', data);
}

export function getReviewsByUser(userId) {
  return get('/reviews', { params: { user_id: userId } });
}
