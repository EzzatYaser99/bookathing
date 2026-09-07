import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Nav, Navbar, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { mockMovies } from '../data/mockMovies';
import { movieService } from '../services/movieService';
import { reviewService } from '../../reviews/services/reviewService';
import type { Movie, Review } from '../types/movie.types';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUserName = authService.getUser()?.name ?? authService.getUser()?.email ?? 'Guest User';

  const refreshReviews = async (movieId: string) => {
    const response = await reviewService.getMovieReviews(movieId);
    const reviewList = Array.isArray(response?.reviews) ? response.reviews : [];
    setReviews(reviewList.length > 0 ? reviewList : movie?.reviews ?? []);
  };

  useEffect(() => {
    let active = true;

    const loadMovie = async () => {
      if (!id) {
        if (active) {
          setLoading(false);
          setError('Movie not found.');
        }
        return;
      }

      try {
        setLoading(true);
        const [movieData, reviewData] = await Promise.all([
          movieService.getMovieById(id),
          reviewService.getMovieReviews(id),
        ]);

        if (!active) return;

        const resolvedMovie = movieData ?? mockMovies.find((item) => item.id === id) ?? null;
        setMovie(resolvedMovie);
        setReviews(Array.isArray(reviewData?.reviews) && reviewData.reviews.length > 0 ? reviewData.reviews : resolvedMovie?.reviews ?? []);
        setError('');
      } catch {
        if (active) {
          setMovie(mockMovies.find((item) => item.id === id) ?? null);
          setError('Unable to load the movie details right now. Showing the local catalog view.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMovie();

    return () => {
      active = false;
    };
  }, [id]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number): string => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return '⭐'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  };

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id || !reviewForm.comment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please add a review comment before submitting.' });
      return;
    }

    setSubmittingReview(true);
    setReviewMessage(null);

    try {
      if (editingReviewId) {
        await reviewService.updateReview(editingReviewId, {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });
        setReviewMessage({ type: 'success', text: 'Review updated successfully.' });
      } else {
        await reviewService.createReview({
          movieId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });
        setReviewMessage({ type: 'success', text: 'Review added successfully.' });
      }

      setReviewForm({ rating: 5, comment: '' });
      setEditingReviewId(null);
      await refreshReviews(id);
    } catch {
      setReviewMessage({ type: 'error', text: 'Unable to save the review right now.' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!id) return;

    try {
      await reviewService.deleteReview(reviewId);
      await refreshReviews(id);
      setReviewMessage({ type: 'success', text: 'Review deleted successfully.' });
    } catch {
      setReviewMessage({ type: 'error', text: 'Unable to delete the review.' });
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">BookAThing</Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container className="py-5">
          <Alert variant="danger">
            <h4>Movie Not Found</h4>
            <p>The movie you are looking for could not be found.</p>
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">BookAThing</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <Link to="/" className="btn btn-outline-secondary mb-4">← Back to movies</Link>

        {error && (
          <Alert variant="warning" className="mb-4">{error}</Alert>
        )}

        <div
          className="rounded mb-4 position-relative"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
          }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-end">
            <Container className="pb-4">
              <Row>
                <Col md={4}>
                  <img src={movie.poster} alt={movie.title} className="img-fluid rounded shadow" style={{ maxHeight: '400px' }} />
                </Col>
                <Col md={8} className="text-white">
                  <Badge bg={movie.status === 'now-showing' ? 'success' : 'primary'} className="mb-2">
                    {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                  </Badge>
                  <h1 className="display-4 fw-bold mb-2">{movie.title}</h1>
                  <div className="mb-3">
                    <span className="me-3"><strong>Rating:</strong> {renderStars(movie.rating)} ({movie.rating.toFixed(1)}/10)</span>
                    <span className="me-3"><strong>Duration:</strong> {formatDuration(movie.duration)}</span>
                    <span className="me-3"><strong>Language:</strong> {movie.language}</span>
                  </div>
                  <div className="mb-3">
                    {movie.genre.map((genre) => (
                      <Badge bg="secondary" key={genre} className="me-2">{genre}</Badge>
                    ))}
                  </div>
                  {movie.status === 'coming-soon' && (
                    <p className="mb-0"><strong>Release Date:</strong> {formatDate(movie.releaseDate)}</p>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">About the Movie</h4>
                <p className="lead mb-0">{movie.description}</p>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Cast</h4>
                <Row>
                  {movie.cast.map((actor) => (
                    <Col key={actor.id} xs={6} md={4} lg={3} className="mb-3">
                      <div className="text-center">
                        <img src={actor.photo} alt={actor.name} className="rounded-circle mb-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <h6 className="mb-0">{actor.name}</h6>
                        <small className="text-muted">{actor.character}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Reviews</h4>
                  <Badge bg="light" text="dark">{reviews.length} review{reviews.length === 1 ? '' : 's'}</Badge>
                </div>

                <Form onSubmit={handleReviewSubmit} className="mb-4">
                  <Row className="g-3 align-items-end">
                    <Col md={3}>
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        value={reviewForm.rating}
                        onChange={(event) => setReviewForm((previous) => ({ ...previous, rating: Number(event.target.value) }))}
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>{value} / 5</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={7}>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={reviewForm.comment}
                        onChange={(event) => setReviewForm((previous) => ({ ...previous, comment: event.target.value }))}
                        placeholder="Share your thoughts about the movie..."
                      />
                    </Col>
                    <Col md={2}>
                      <Button type="submit" variant="primary" className="w-100" disabled={submittingReview}>
                        {submittingReview ? <Spinner animation="border" size="sm" /> : editingReviewId ? 'Update' : 'Add'}
                      </Button>
                    </Col>
                  </Row>
                </Form>

                {reviewMessage && <Alert variant={reviewMessage.type}>{reviewMessage.text}</Alert>}

                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{review.user}</h6>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="warning" text="dark">⭐ {review.rating}/5</Badge>
                          {review.user === currentUserName && (
                            <>
                              <Button size="sm" variant="outline-primary" onClick={() => {
                                setEditingReviewId(review.id);
                                setReviewForm({ rating: review.rating, comment: review.comment });
                              }}>Edit</Button>
                              <Button size="sm" variant="outline-danger" onClick={() => handleDeleteReview(review.id)}>Delete</Button>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="mb-1">{review.comment}</p>
                      <small className="text-muted">{formatDate(review.date)}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">No reviews yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Available Cities</h4>
                <div className="d-flex flex-wrap gap-2">
                  {movie.cities.map((city) => (
                    <Badge bg="info" key={city} className="p-2">{city}</Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {movie.trailerUrl && (
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-3">Trailer</h4>
                  <div className="ratio ratio-16x9">
                    <iframe src={movie.trailerUrl} title={`${movie.title} Trailer`} allowFullScreen />
                  </div>
                </Card.Body>
              </Card>
            )}

            {movie.status === 'now-showing' && (
              <Card className="mb-4 bg-primary text-white">
                <Card.Body className="text-center">
                  <h4 className="mb-3">Ready to Watch?</h4>
                  <p className="mb-3">Book your tickets now and enjoy the show.</p>
                  <Button variant="light" size="lg" className="w-100" onClick={() => navigate(`/showtimes/${movie.id}`)}>
                    Book Tickets
                  </Button>
                </Card.Body>
              </Card>
            )}

            {movie.status === 'coming-soon' && (
              <Card className="mb-4 bg-secondary text-white">
                <Card.Body className="text-center">
                  <h4 className="mb-3">Coming Soon</h4>
                  <p className="mb-3">This movie releases on {formatDate(movie.releaseDate)}</p>
                  <Button variant="light" size="lg" className="w-100">Set Reminder</Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MovieDetails;
