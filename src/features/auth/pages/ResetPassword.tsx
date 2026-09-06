// Reset Password Page - Similar to Angular Component
// Handles password reset with token

import { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidPassword, doPasswordsMatch } from '../authUtils';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  // Form state - Similar to Angular Reactive Forms
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Handle input changes - Similar to Angular form control updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
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

    if (!token) {
      setError('Invalid or expired reset token. Please request a new password reset.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
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
                <h2 className="fw-bold">Reset Password</h2>
                <p className="text-muted">
                  {success
                    ? 'Password reset successfully'
                    : 'Create a new password for your account'}
                </p>
              </div>

              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-3">
                  Your password has been reset successfully. You can now log in with your new password.
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
                  {/* Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password">New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
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
                    <Form.Text className="text-muted">
                      Must be at least 8 characters
                    </Form.Text>
                  </Form.Group>

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="confirmPassword">Confirm New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.confirmPassword}
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-0 end-0"
                        style={{ transform: 'translateY(-50%)' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.confirmPassword}
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
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
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
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
