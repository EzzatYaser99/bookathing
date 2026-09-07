import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { doPasswordsMatch, isValidEmail, isValidPassword } from '../authUtils';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: '',
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

  const validateAccountStep = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '', phone: '', otp: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const validateOtpStep = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '', phone: '', otp: '' };
    let isValid = true;

    if (!formData.otp || formData.otp.length !== 4 || !/^\d{4}$/.test(formData.otp)) {
      errors.otp = 'OTP must be exactly 4 digits';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateAccountStep()) {
      return;
    }

    setLoading(true);
    setError('');

    const response = await authService.sendSignupOtp({ email: formData.email });

    if (response.success) {
      setStep(2);
    } else {
      setError(response.message || 'Unable to send OTP.');
    }

    setLoading(false);
  };

  const handleCompleteSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateOtpStep()) {
      return;
    }

    setLoading(true);
    setError('');

    const response = await authService.completeSignup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      otp: formData.otp,
    });

    if (response.success) {
      navigate('/dashboard');
      return;
    }

    setError(response.message || 'Registration failed.');
    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Create your account</h2>
                <p className="text-muted mb-0">
                  {step === 1 ? 'Sign up and verify your email' : 'Enter the OTP sent to your email'}
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {step === 1 ? (
                <Form onSubmit={handleSendOtp} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Full name</Form.Label>
                    <Form.Control
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.name}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                  </Form.Group>

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
                    <Form.Label htmlFor="phone">Phone</Form.Label>
                    <Form.Control
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.phone}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.phone}</Form.Control.Feedback>
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
                      />
                      <Button type="button" variant="link" className="position-absolute top-0 end-0" onClick={() => setShowPassword((value) => !value)}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>
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
                    {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Sending OTP...</> : 'Send OTP'}
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleCompleteSignup} noValidate>
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

                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Verifying...</> : 'Verify & Create Account'}
                  </Button>

                  <div className="text-center mt-3">
                    <Button variant="link" className="p-0" onClick={() => setStep(1)}>
                      Change details
                    </Button>
                  </div>
                </Form>
              )}

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="fw-semibold text-decoration-none">Sign in</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
