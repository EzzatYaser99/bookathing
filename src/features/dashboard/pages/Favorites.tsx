// Favorites page - Similar to Angular Component
// Displays user's favorite movies

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout, getCurrentUser } from '../../auth/authUtils';
import { mockMovies } from '../../browsing/data/mockMovies';

const Favorites = () => {
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

  // Mock favorite movies (using some from mockMovies)
  const favoriteMovies = mockMovies.slice(0, 4);

  const handleRemoveFavorite = (movieId: string) => {
    // In a real app, this would call an API to remove from favorites
    console.log('Remove favorite:', movieId);
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

          {/* Main Favorites Content */}
          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">My Favorites</h2>
              <p className="text-muted">
                Your favorite movies saved for quick access
              </p>
            </div>

            {/* Favorites Grid */}
            <Row>
              {favoriteMovies.map((movie) => (
                <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                      <Card.Img
                        variant="top"
                        src={movie.poster}
                        alt={movie.title}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title className="mb-2 text-truncate" title={movie.title}>
                        <Link to={`/movie/${movie.id}`} className="text-decoration-none text-dark">
                          {movie.title}
                        </Link>
                      </Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        {movie.genre.slice(0, 2).join(', ')}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">⭐ {movie.rating.toFixed(1)}</small>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFavorite(movie.id)}
                        >
                          ❤️ Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Empty State */}
            {favoriteMovies.length === 0 && (
              <Card className="text-center py-5">
                <Card.Body>
                  <h3 className="mb-3">No Favorites Yet</h3>
                  <p className="text-muted mb-4">
                    Start adding movies to your favorites to see them here.
                  </p>
                  <Link to="/">
                    <Button variant="primary">Browse Movies</Button>
                  </Link>
                </Card.Body>
              </Card>
            )}

            {/* Favorites Summary */}
            <Card className="mt-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5 className="mb-2">Total Favorites</h5>
                    <h3 className="mb-0">{favoriteMovies.length}</h3>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-2">Recently Added</h5>
                    <p className="mb-0 text-muted">
                      {favoriteMovies.length > 0 ? favoriteMovies[0].title : 'None'}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Favorites;
