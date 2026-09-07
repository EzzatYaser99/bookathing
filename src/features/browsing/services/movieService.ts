import { apiRequest } from '../../../services/api';
import { mockMovies } from '../data/mockMovies';
import type { Movie } from '../types/movie.types';

const normalizeMovie = (input: any): Movie | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const id = String(input.id ?? input._id ?? input.movieId ?? input.slug ?? '');
  if (!id) {
    return null;
  }

  const genres = Array.isArray(input.genre)
    ? input.genre
    : Array.isArray(input.genres)
      ? input.genres
      : typeof input.genre === 'string'
        ? input.genre.split(',')
        : typeof input.genres === 'string'
          ? input.genres.split(',')
          : [];

  const cast = Array.isArray(input.cast)
    ? input.cast.map((person: any, index: number) => ({
        id: String(person.id ?? person._id ?? `${id}-cast-${index}`),
        name: person.name ?? 'Cast Member',
        character: person.character ?? person.role ?? 'Actor',
        photo: person.photo ?? person.image ?? person.avatar ?? mockMovies[0]?.cast?.[0]?.photo ?? '',
      }))
    : [];

  const reviews = Array.isArray(input.reviews)
    ? input.reviews.map((review: any, index: number) => ({
        id: String(review.id ?? review._id ?? `${id}-review-${index}`),
        user: review.user ?? review.author ?? 'Guest User',
        rating: Number(review.rating ?? review.score ?? 0),
        comment: review.comment ?? review.text ?? '',
        date: review.date ?? review.createdAt ?? new Date().toISOString(),
      }))
    : [];

  return {
    id,
    title: input.title ?? input.name ?? 'Untitled Movie',
    poster: input.poster ?? input.posterUrl ?? input.image ?? mockMovies[0]?.poster ?? '',
    backdrop: input.backdrop ?? input.backdropUrl ?? input.banner ?? input.poster ?? mockMovies[0]?.backdrop ?? '',
    rating: Number(input.rating ?? input.averageRating ?? input.voteAverage ?? 0),
    duration: Number(input.duration ?? input.runtime ?? 120),
    releaseDate:
      input.releaseDate ?? input.release_date ?? input.releaseDateStr ?? new Date().toISOString(),
    genre: genres.map((item: any) => (typeof item === 'string' ? item : item?.name ?? '')).filter(Boolean),
    language: input.language ?? input.languages?.[0] ?? 'English',
    description: input.description ?? input.overview ?? 'No description available.',
    cast,
    trailerUrl: input.trailerUrl ?? input.trailer_url ?? input.trailer ?? '',
    reviews,
    status: input.status === 'coming-soon' ? 'coming-soon' : 'now-showing',
    cities: Array.isArray(input.cities)
      ? input.cities
      : Array.isArray(input.locations)
        ? input.locations
        : ['New York'],
  };
};

const normalizeMovieList = (result: any): Movie[] => {
  if (Array.isArray(result)) {
    return result.map(normalizeMovie).filter(Boolean) as Movie[];
  }

  if (Array.isArray(result?.movies)) {
    return result.movies.map(normalizeMovie).filter(Boolean) as Movie[];
  }

  if (result && typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
    return result.data.map(normalizeMovie).filter(Boolean) as Movie[];
  }

  return [];
};

export const movieService = {
  async getAllMovies() {
    try {
      const movies = await apiRequest<any>('/movies');
      const normalized = normalizeMovieList(movies);
      return normalized.length > 0 ? normalized : mockMovies;
    } catch {
      return mockMovies;
    }
  },

  async getMovieById(movieId: string) {
    try {
      const payload = await apiRequest<any>(`/movies/${movieId}`);
      const direct = normalizeMovie(payload?.movie ?? payload?.data ?? payload);
      if (direct) {
        return direct;
      }

      if (Array.isArray(payload)) {
        return normalizeMovieList(payload).find((movie) => movie.id === movieId) ?? null;
      }

      return mockMovies.find((movie) => movie.id === movieId) ?? null;
    } catch {
      return mockMovies.find((movie) => movie.id === movieId) ?? null;
    }
  },
};
