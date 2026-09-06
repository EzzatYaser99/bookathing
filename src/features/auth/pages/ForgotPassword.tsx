// Forgot Password Page - Similar to Angular Component
// Handles password reset request

import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidEmail } from '../authUtils';

const ForgotPassword = () => {
  // Form state - Similar to Angular Reactive Forms
  const [email, setEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle input changes - Similar to Angular form control updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }

    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    return true;
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
    setSuccess(false);

    try {
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to send reset link. Please try again.');
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
                <h2 className="fw-bold">Forgot Password?</h2>
                <p className="text-muted">
                  {success
                    ? 'Reset link sent successfully'
                    : 'Enter your email to receive a password reset link'}
                </p>
              </div>

              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-3">
                  Password reset link has been sent to your email. Please check your inbox.
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {!success ? (
                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email Address</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleInputChange}
                      isInvalid={!!validationError}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationError}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Submit Button */}
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link to="/login" className="text-decoration-none">
                      Back to Login
                    </Link>
                  </div>
                </Form>
              ) : (
                <div className="text-center">
                  <Button
                    variant="primary"
                    className="w-100 mb-3"
                    onClick={() => (window.location.href = '/login')}
                  >
                    Back to Login
                  </Button>
                  <div className="text-center">
                    <Link to="/register" className="text-decoration-none">
                      Create a new account
                    </Link>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
