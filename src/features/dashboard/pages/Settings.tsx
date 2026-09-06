// Settings page - Similar to Angular Component
// Displays and allows editing of user account settings

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../auth/authUtils';

const Settings = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const user = getCurrentUser();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
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

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save settings
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      logout();
      navigate('/login');
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

          {/* Main Settings Content */}
          <Col lg={9}>
            <div className="mb-4">
              <h2 className="mb-2">Settings</h2>
              <p className="text-muted">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Success Alert */}
            {showSuccess && (
              <Alert variant="success" className="mb-4">
                Settings saved successfully!
              </Alert>
            )}

            {/* Notification Settings */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Notification Preferences</h5>
                <Form onSubmit={handleSaveSettings}>
                  <Form.Check
                    type="switch"
                    id="email"
                    name="email"
                    label="Email Notifications"
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />
                  <Form.Text className="text-muted d-block mb-3">
                    Receive booking confirmations and updates via email
                  </Form.Text>

                  <Form.Check
                    type="switch"
                    id="sms"
                    name="sms"
                    label="SMS Notifications"
                    checked={notifications.sms}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />
                  <Form.Text className="text-muted d-block mb-3">
                    Receive booking reminders via SMS
                  </Form.Text>

                  <Form.Check
                    type="switch"
                    id="push"
                    name="push"
                    label="Push Notifications"
                    checked={notifications.push}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />
                  <Form.Text className="text-muted d-block mb-3">
                    Receive push notifications on your device
                  </Form.Text>

                  <Form.Check
                    type="switch"
                    id="marketing"
                    name="marketing"
                    label="Marketing Emails"
                    checked={notifications.marketing}
                    onChange={handleNotificationChange}
                    className="mb-4"
                  />
                  <Form.Text className="text-muted d-block mb-4">
                    Receive promotional offers and movie recommendations
                  </Form.Text>

                  <Button variant="primary" type="submit">
                    Save Settings
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Account Security */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Account Security</h5>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%' }}>
                        <strong>Password</strong>
                      </td>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Last changed 30 days ago</span>
                          <Button variant="outline-primary" size="sm">
                            Change Password
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Two-Factor Authentication</strong>
                      </td>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Not enabled</span>
                          <Button variant="outline-primary" size="sm">
                            Enable
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Login Sessions</strong>
                      </td>
                      <td>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">2 active sessions</span>
                          <Button variant="outline-danger" size="sm">
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Danger Zone */}
            <Card className="border-danger">
              <Card.Body>
                <h5 className="mb-3 text-danger">Danger Zone</h5>
                <p className="text-muted mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;
