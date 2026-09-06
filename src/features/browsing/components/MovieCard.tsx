// MovieCard component - Similar to Angular Component
// Reusable card component for displaying movies

import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie.types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="h-100 shadow-sm movie-card">
      <Link to={`/movie/${movie.id}`} className="text-decoration-none">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={movie.poster}
            alt={movie.title}
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Badge
            bg={movie.status === 'now-showing' ? 'success' : 'primary'}
            className="position-absolute top-0 end-0 m-2"
          >
            {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
          </Badge>
          <div className="position-absolute top-0 start-0 m-2">
            <Badge bg="warning" text="dark">
              ⭐ {movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
            </Badge>
          </div>
        </div>
      </Link>
      <Card.Body>
        <Card.Title className="mb-2 text-truncate" title={movie.title}>
          <Link to={`/movie/${movie.id}`} className="text-decoration-none text-dark">
            {movie.title}
          </Link>
        </Card.Title>
        <Card.Text className="text-muted small mb-2">
          {movie.genre.slice(0, 2).join(', ')}
          {movie.genre.length > 2 && '...'}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">
            <i className="bi bi-clock me-1">🕒</i>
            {formatDuration(movie.duration)}
          </small>
          <small className="text-muted">
            <i className="bi bi-translate me-1">🌐</i>
            {movie.language}
          </small>
        </div>
        {movie.status === 'coming-soon' && (
          <div className="mt-2">
            <small className="text-muted">
              <i className="bi bi-calendar me-1">📅</i>
              {formatDate(movie.releaseDate)}
            </small>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <Link to={`/movie/${movie.id}`} className="text-decoration-none">
          <Button variant="outline-primary" className="w-100">
            {movie.status === 'now-showing' ? 'Book Tickets' : 'View Details'}
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default MovieCard;
