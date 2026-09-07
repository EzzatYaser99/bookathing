import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { doPasswordsMatch, isValidPassword } from '../authUtils';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((previous) => ({ ...previous, [name]: '' }));
    }

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = { email: '', otp: '', newPassword: '', confirmPassword: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }

    if (!formData.otp || formData.otp.length !== 4 || !/^\d{4}$/.test(formData.otp)) {
      errors.otp = 'OTP must be exactly 4 digits';
      isValid = false;
    }

    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
      isValid = false;
    } else if (!isValidPassword(formData.newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (!doPasswordsMatch(formData.newPassword, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
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
    setSuccess(false);

    const response = await authService.resetPassword({
      email: formData.email,
      otp: formData.otp,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (response.success) {
      setSuccess(true);
    } else {
      setError(response.message || 'Failed to reset password.');
    }

    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Reset password</h2>
                <p className="text-muted mb-0">Set a new password using your OTP</p>
              </div>

              {success && <Alert variant="success">Your password has been reset successfully.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {!success ? (
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
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="otp">OTP</Form.Label>
                    <Form.Control
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.otp}
                      disabled={loading}
                      maxLength={4}
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.otp}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="newPassword">New password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.newPassword}
                        disabled={loading}
                      />
                      <Button type="button" variant="link" className="position-absolute top-0 end-0" onClick={() => setShowPassword((value) => !value)}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">{validationErrors.newPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="confirmPassword">Confirm password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.confirmPassword}
                        disabled={loading}
                      />
                      <Button type="button" variant="link" className="position-absolute top-0 end-0" onClick={() => setShowConfirmPassword((value) => !value)}>
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">{validationErrors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Resetting...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </Form>
              ) : (
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => navigate('/login')}>Go to login</Button>
                  <Link to="/forgot-password" className="btn btn-outline-secondary">Request another code</Link>
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
