// Profile page - Similar to Angular Component
// Displays and allows editing of user profile information

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../auth/authUtils';

const Profile = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 234 567 8900',
    dateOfBirth: '1990-01-01',
    address: '123 Main St, New York, NY 10001',
  });

  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the profile
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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

          {/* Main Profile Content */}
          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">My Profile</h2>
              <p className="text-muted">
                Manage your personal information
              </p>
            </div>

            {/* Success Alert */}
            {showSuccess && (
              <Alert variant="success" className="mb-4">
                Profile updated successfully!
              </Alert>
            )}

            {/* Profile Form */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Personal Information</h5>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="firstName">First Name</Form.Label>
                        <Form.Control
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="lastName">Last Name</Form.Label>
                        <Form.Control
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email Address</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="phone">Phone Number</Form.Label>
                    <Form.Control
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="dateOfBirth">Date of Birth</Form.Label>
                    <Form.Control
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="address">Address</Form.Label>
                    <Form.Control
                      id="address"
                      name="address"
                      as="textarea"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="me-2">
                    Save Changes
                  </Button>
                  <Button variant="outline-secondary" type="button">
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Account Statistics */}
            <Row>
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Member Since</h6>
                    <h5 className="mb-0">January 2024</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3 mb-md-0">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Bookings</h6>
                    <h5 className="mb-0">12</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <h6 className="text-muted mb-2">Account Status</h6>
                    <h5 className="mb-0 text-success">Active</h5>
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

export default Profile;
