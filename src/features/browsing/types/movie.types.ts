// Movie types and interfaces - Similar to Angular interfaces

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  duration: number; // in minutes
  releaseDate: string;
  genre: string[];
  language: string;
  description: string;
  cast: Cast[];
  trailerUrl?: string;
  reviews: Review[];
  status: 'now-showing' | 'coming-soon';
  cities: string[];
}

export interface Cast {
  id: string;
  name: string;
  character: string;
  photo: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FilterOptions {
  genre?: string;
  language?: string;
  city?: string;
  searchQuery?: string;
}
