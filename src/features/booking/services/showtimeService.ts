import { apiRequest } from '../../../services/api';

export interface Showtime {
  id: string;
  screenId?: string;
  theaterId?: string;
  movieId?: string;
  startTime: string;
  language?: string;
  price?: number;
}

export const showtimeService = {
  async getMovieShowtimes(movieId: string, theaterId?: string, fromDate?: string) {
    const params = new URLSearchParams();
    if (theaterId) params.set('theaterId', theaterId);
    if (fromDate) params.set('fromDate', fromDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    try {
      return await apiRequest<Showtime[]>(`/showtimes/movie/${movieId}${query}`);
    } catch {
      return [] as Showtime[];
    }
  },
};
