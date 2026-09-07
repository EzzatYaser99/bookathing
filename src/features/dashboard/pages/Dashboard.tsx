// Dashboard Page - Similar to Angular Component
// Protected page for authenticated users

import { useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../auth/authUtils';

const Dashboard = () => {
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

          {/* Main Dashboard Content */}
          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">Welcome back, {user?.firstName}!</h2>
              <p className="text-muted">
                Here's what's happening with your account today.
              </p>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Bookings</h6>
                    <h3 className="mb-0">12</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Upcoming Shows</h6>
                    <h3 className="mb-0">3</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <h6 className="text-muted mb-2">Favorite Movies</h6>
                    <h3 className="mb-0">8</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Card>
              <Card.Body>
                <h5 className="mb-3">Recent Activity</h5>
                <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="me-3">
                    <span className="fs-4">🎬</span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Booked: Inception</h6>
                    <p className="text-muted mb-0">Today at 2:30 PM</p>
                  </div>
                  <Link to="/dashboard/bookings">
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
                <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="me-3">
                    <span className="fs-4">❤️</span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Added to Favorites: The Dark Knight</h6>
                    <p className="text-muted mb-0">Yesterday at 5:15 PM</p>
                  </div>
                  <Link to="/movie/2">
                    <Button variant="outline-primary" size="sm">
                      View Movie
                    </Button>
                  </Link>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <span className="fs-4">🎫</span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Booking Confirmed: Interstellar</h6>
                    <p className="text-muted mb-0">2 days ago</p>
                  </div>
                  <Link to="/dashboard/bookings">
                    <Button variant="outline-primary" size="sm">
                      View Ticket
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
