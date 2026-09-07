import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidEmail, isValidPassword } from '../authUtils';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((previous) => ({ ...previous, [name]: '' }));
    }

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const response = await authService.login({
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      const userRole = response.user?.role ?? 'user';
      const targetRoute = userRole === 'owner' ? '/owner/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(targetRoute);
      return;
    }

    setError(response.message || 'Login failed. Please try again.');
    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Welcome back</h2>
                <p className="text-muted mb-0">Sign in to your account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.email}
                    disabled={loading}
                    placeholder="you@example.com"
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.password}
                      disabled={loading}
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="position-absolute top-0 end-0 text-decoration-none"
                      style={{ transform: 'translateY(-5%)' }}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    label="Remember me"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                </div>

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center mt-3">
                  <span className="text-muted">New here? </span>
                  <Link to="/register" className="fw-semibold text-decoration-none">Create account</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
