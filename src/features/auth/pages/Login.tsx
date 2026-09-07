// Login Page - Similar to Angular Component
// Handles user authentication with form validation

import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidEmail, isValidPassword } from '../authUtils';

const Login = () => {
  const navigate = useNavigate();

  // Form state - Similar to Angular Reactive Forms
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  // Handle input changes - Similar to Angular form control updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Navigate to dashboard on successful login
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email Address</Form.Label>
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.password}
                      disabled={loading}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-0 end-0"
                      style={{ transform: 'translateY(-50%)' }}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Remember Me & Forgot Password */}
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
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Sign Up
                  </Link>
                </div>
              </Form>

              {/* Demo Credentials Hint */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong><br />
                  Email: test@example.com<br />
                  Password: password123
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
