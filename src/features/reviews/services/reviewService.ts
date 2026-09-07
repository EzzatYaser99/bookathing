import { apiRequest } from '../../../services/api';

export interface ReviewPayload {
  movieId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  async getMovieReviews(movieId: string) {
    try {
      return await apiRequest<any>(`/reviews/movie/${movieId}`);
    } catch {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }
  },

  async createReview(payload: ReviewPayload) {
    return apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateReview(reviewId: string, payload: { rating: number; comment: string }) {
    return apiRequest<any>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteReview(reviewId: string) {
    return apiRequest<any>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};
