// Movie Details page - Similar to Angular Component
// Displays detailed information about a specific movie

import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';
import { mockMovies } from '../data/mockMovies';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Find movie by ID
  const movie = mockMovies.find((m) => m.id === id);

  // Handle movie not found
  if (!movie) {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              BookAThing
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container className="py-5">
          <Alert variant="danger">
            <h4>Movie Not Found</h4>
            <p>The movie you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </Alert>
        </Container>
      </>
    );
  }

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

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            BookAThing
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        {/* Back Button */}
        <Link to="/" className="btn btn-outline-secondary mb-4">
          ← Back to Movies
        </Link>

        {/* Movie Header */}
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
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '400px' }}
                  />
                </Col>
                <Col md={8} className="text-white">
                  <Badge
                    bg={movie.status === 'now-showing' ? 'success' : 'primary'}
                    className="mb-2"
                  >
                    {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                  </Badge>
                  <h1 className="display-4 fw-bold mb-2">{movie.title}</h1>
                  <div className="mb-3">
                    <span className="me-3">
                      <strong>Rating:</strong> {renderStars(movie.rating)} ({movie.rating.toFixed(1)}/10)
                    </span>
                    <span className="me-3">
                      <strong>Duration:</strong> {formatDuration(movie.duration)}
                    </span>
                    <span className="me-3">
                      <strong>Language:</strong> {movie.language}
                    </span>
                  </div>
                  <div className="mb-3">
                    {movie.genre.map((g) => (
                      <Badge bg="secondary" className="me-2" key={g}>
                        {g}
                      </Badge>
                    ))}
                  </div>
                  {movie.status === 'coming-soon' && (
                    <p className="mb-0">
                      <strong>Release Date:</strong> {formatDate(movie.releaseDate)}
                    </p>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </div>

        {/* Movie Details */}
        <Row>
          {/* Left Column - Description and Cast */}
          <Col lg={8}>
            {/* Description */}
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">About the Movie</h4>
                <p className="lead">{movie.description}</p>
              </Card.Body>
            </Card>

            {/* Cast */}
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Cast</h4>
                <Row>
                  {movie.cast.map((actor) => (
                    <Col key={actor.id} xs={6} md={4} lg={3} className="mb-3">
                      <div className="text-center">
                        <img
                          src={actor.photo}
                          alt={actor.name}
                          className="rounded-circle mb-2"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <h6 className="mb-0">{actor.name}</h6>
                        <small className="text-muted">{actor.character}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Reviews */}
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Reviews</h4>
                {movie.reviews.length > 0 ? (
                  movie.reviews.map((review) => (
                    <div key={review.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{review.user}</h6>
                        <Badge bg="warning" text="dark">
                          ⭐ {review.rating}/10
                        </Badge>
                      </div>
                      <p className="mb-1">{review.comment}</p>
                      <small className="text-muted">{formatDate(review.date)}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Booking Info */}
          <Col lg={4}>
            {/* Available Cities */}
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-3">Available Cities</h4>
                <div className="d-flex flex-wrap gap-2">
                  {movie.cities.map((city) => (
                    <Badge bg="info" key={city} className="p-2">
                      {city}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Trailer */}
            {movie.trailerUrl && (
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-3">Trailer</h4>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={movie.trailerUrl}
                      title={`${movie.title} Trailer`}
                      allowFullScreen
                    />
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Book Tickets Button */}
            {movie.status === 'now-showing' && (
              <Card className="mb-4 bg-primary text-white">
                <Card.Body className="text-center">
                  <h4 className="mb-3">Ready to Watch?</h4>
                  <p className="mb-3">Book your tickets now and enjoy the show!</p>
                  <Button variant="light" size="lg" className="w-100">
                    Book Tickets
                  </Button>
                </Card.Body>
              </Card>
            )}

            {/* Coming Soon Button */}
            {movie.status === 'coming-soon' && (
              <Card className="mb-4 bg-secondary text-white">
                <Card.Body className="text-center">
                  <h4 className="mb-3">Coming Soon</h4>
                  <p className="mb-3">
                    This movie releases on {formatDate(movie.releaseDate)}
                  </p>
                  <Button variant="light" size="lg" className="w-100">
                    Set Reminder
                  </Button>
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
