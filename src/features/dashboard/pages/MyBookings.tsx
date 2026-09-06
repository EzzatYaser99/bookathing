// My Bookings page - Similar to Angular Component
// Displays user's movie booking history

import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout, getCurrentUser } from '../../auth/authUtils';

const MyBookings = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Home', path: '/dashboard', icon: '🏠' },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: '🎫' },
    { name: 'Favorites', path: '/dashboard/favorites', icon: '❤️' },
    { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  // Mock booking data
  const bookings = [
    {
      id: 'BK001',
      movie: 'Inception',
      theater: 'AMC Empire 25',
      date: '2024-01-20',
      time: '7:30 PM',
      seats: 'F12, F13',
      amount: 45.00,
      status: 'confirmed',
    },
    {
      id: 'BK002',
      movie: 'The Dark Knight',
      theater: 'Regal Times Square',
      date: '2024-01-25',
      time: '8:00 PM',
      seats: 'G8, G9, G10',
      amount: 67.50,
      status: 'confirmed',
    },
    {
      id: 'BK003',
      movie: 'Interstellar',
      theater: 'Cinemark XD',
      date: '2024-02-02',
      time: '6:00 PM',
      seats: 'H5, H6',
      amount: 50.00,
      status: 'upcoming',
    },
    {
      id: 'BK004',
      movie: 'Dune: Part Two',
      theater: 'IMAX Lincoln Center',
      date: '2024-02-15',
      time: '9:00 PM',
      seats: 'J1, J2',
      amount: 80.00,
      status: 'upcoming',
    },
    {
      id: 'BK005',
      movie: 'Oppenheimer',
      theater: 'AMC Lincoln Square',
      date: '2023-12-10',
      time: '3:00 PM',
      seats: 'E15, E16',
      amount: 55.00,
      status: 'completed',
    },
  ];

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
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard">
            BookAThing
          </Navbar.Brand>
          <Button
            variant="outline-light"
            onClick={() => setShowSidebar(true)}
            className="d-lg-none"
          >
            ☰
          </Button>
          <Nav className="ms-auto d-none d-lg-flex">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Mobile Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {sidebarItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={() => setShowSidebar(false)}
                className="mb-2"
              >
                {item.icon} {item.name}
              </Nav.Link>
            ))}
            <Nav.Link onClick={handleLogout} className="mt-3">
              🚪 Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid>
        <Row>
          {/* Desktop Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Menu</h5>
                <Nav className="flex-column">
                  {sidebarItems.map((item) => (
                    <Nav.Link
                      key={item.path}
                      as={Link}
                      to={item.path}
                      className="mb-2"
                    >
                      {item.icon} {item.name}
                    </Nav.Link>
                  ))}
                  <Nav.Link onClick={handleLogout} className="mt-3 text-danger">
                    🚪 Logout
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>

            {/* User Info Card */}
            <Card>
              <Card.Body>
                <h5 className="mb-3">User Info</h5>
                <p className="mb-1">
                  <strong>Name:</strong> {user?.firstName} {user?.lastName}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {user?.email}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Bookings Content */}
          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">My Bookings</h2>
              <p className="text-muted">
                View and manage your movie bookings
              </p>
            </div>

            {/* Bookings Table */}
            <Card>
              <Card.Body>
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
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <strong>{booking.id}</strong>
                          </td>
                          <td>{booking.movie}</td>
                          <td>{booking.theater}</td>
                          <td>
                            <div>{booking.date}</div>
                            <small className="text-muted">{booking.time}</small>
                          </td>
                          <td>{booking.seats}</td>
                          <td>${booking.amount.toFixed(2)}</td>
                          <td>{getStatusBadge(booking.status)}</td>
                          <td>
                            <div className="btn-group">
                              <Button variant="outline-primary" size="sm">
                                View
                              </Button>
                              {booking.status === 'upcoming' && (
                                <Button variant="outline-danger" size="sm">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Booking Summary */}
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
                    <h3 className="mb-0">
                      {bookings.filter(b => b.status === 'upcoming').length}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Spent</h6>
                    <h3 className="mb-0">
                      ${bookings.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                    </h3>
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
