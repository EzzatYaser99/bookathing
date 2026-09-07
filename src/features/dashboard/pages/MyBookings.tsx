import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Nav, Navbar, Offcanvas, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../auth/authUtils';
import { bookingService } from '../../booking/services/bookingService';

const MyBookings = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Home', path: '/dashboard', icon: '🏠' },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: '🎫' },
    { name: 'Favorites', path: '/dashboard/favorites', icon: '❤️' },
    { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const response = await bookingService.getMyBookings();
        setBookings(Array.isArray(response) ? response : []);
        setError('');
      } catch {
        setError('Unable to load your bookings right now.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    void loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking));
    } catch {
      setError('Unable to cancel this booking.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'upcoming':
        return <Badge bg="primary">Upcoming</Badge>;
      case 'completed':
        return <Badge bg="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="warning">{status}</Badge>;
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard">BookAThing</Navbar.Brand>
          <Button variant="outline-light" onClick={() => setShowSidebar(true)} className="d-lg-none">☰</Button>
          <Nav className="ms-auto d-none d-lg-flex">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {sidebarItems.map((item) => (
              <Nav.Link key={item.path} as={Link} to={item.path} onClick={() => setShowSidebar(false)} className="mb-2">
                {item.icon} {item.name}
              </Nav.Link>
            ))}
            <Nav.Link onClick={handleLogout} className="mt-3">🚪 Logout</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid>
        <Row>
          <Col lg={3} className="d-none d-lg-block">
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Menu</h5>
                <Nav className="flex-column">
                  {sidebarItems.map((item) => (
                    <Nav.Link key={item.path} as={Link} to={item.path} className="mb-2">
                      {item.icon} {item.name}
                    </Nav.Link>
                  ))}
                  <Nav.Link onClick={handleLogout} className="mt-3 text-danger">🚪 Logout</Nav.Link>
                </Nav>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h5 className="mb-3">User Info</h5>
                <p className="mb-1"><strong>Name:</strong> {user?.firstName ?? user?.name} {user?.lastName}</p>
                <p className="mb-0"><strong>Email:</strong> {user?.email}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">My Bookings</h2>
              <p className="text-muted">View and manage your movie bookings</p>
            </div>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4"><Spinner animation="border" /></div>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Movie</th>
                          <th>Theater</th>
                          <th>Date & Time</th>
                          <th>Seats</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? bookings.map((booking) => (
                          <tr key={booking.id || booking._id || booking.bookingId}>
                            <td><strong>{booking.id || booking._id || booking.bookingId}</strong></td>
                            <td>{booking.movieName || booking.movie?.title || 'Movie'}</td>
                            <td>{booking.theaterName || booking.theater?.name || 'Theater'}</td>
                            <td>
                              <div>{booking.showDate || booking.date || 'N/A'}</div>
                              <small className="text-muted">{booking.showTime || booking.time || 'N/A'}</small>
                            </td>
                            <td>{Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats || 'N/A'}</td>
                            <td>${Number(booking.amount ?? booking.total ?? 0).toFixed(2)}</td>
                            <td>{getStatusBadge(booking.status || 'confirmed')}</td>
                            <td>
                              <div className="btn-group">
                                <Button variant="outline-primary" size="sm">View</Button>
                                {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                                  <Button variant="outline-danger" size="sm" onClick={() => handleCancelBooking(booking.id || booking._id || booking.bookingId)}>
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={8} className="text-center text-muted py-4">No bookings found.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Row className="mt-4">
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Bookings</h6>
                    <h3 className="mb-0">{bookings.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Upcoming Shows</h6>
                    <h3 className="mb-0">{bookings.filter((booking) => booking.status === 'upcoming' || booking.status === 'confirmed').length}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <h6 className="text-muted mb-2">Cancelled</h6>
                    <h3 className="mb-0">{bookings.filter((booking) => booking.status === 'cancelled').length}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyBookings;
