import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showtimeService, type Showtime } from '../services/showtimeService';

const ShowtimeSelectionPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movieId) return;

      setLoading(true);
      const payload = await showtimeService.getMovieShowtimes(movieId);
      setShowtimes(payload);
      setLoading(false);
    };

    void fetchShowtimes();
  }, [movieId]);

  const handleSelectShowtime = (showtime: Showtime) => {
    localStorage.setItem('bookathing_selected_showtime', JSON.stringify(showtime));
    navigate('/booking/seats');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Pick a showtime</h2>
          <p className="text-muted mb-0">Choose your preferred date and time.</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary">
          Back to home
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : showtimes.length === 0 ? (
        <Alert variant="info">No showtimes are available for this movie right now.</Alert>
      ) : (
        <Row>
          {showtimes.map((showtime) => (
            <Col key={showtime.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Badge bg="primary" className="mb-3">{showtime.language || 'English'}</Badge>
                  <h5 className="mb-2">
                    {new Date(showtime.startTime).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h5>
                  <p className="mb-3 fs-5 fw-semibold">
                    {new Date(showtime.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-muted mb-3">Theater: {showtime.theaterId || 'Main Hall'}</p>
                  <Button variant="primary" className="w-100" onClick={() => handleSelectShowtime(showtime)}>
                    Select seats
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ShowtimeSelectionPage;
