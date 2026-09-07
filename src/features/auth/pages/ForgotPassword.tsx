import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidEmail } from '../authUtils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (validationError) setValidationError('');
    if (error) setError('');
  };

  const validateForm = () => {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const response = await authService.forgotPassword({ email });

    if (response.success) {
      setSuccess(true);
    } else {
      setError(response.message || 'Failed to send reset code.');
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
                <h2 className="fw-bold mb-1">Forgot password?</h2>
                <p className="text-muted mb-0">
                  {success ? 'Reset code sent successfully' : 'Enter your email to receive a password reset code'}
                </p>
              </div>

              {success && <Alert variant="success">A reset code has been sent to your email.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {!success ? (
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      isInvalid={!!validationError}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      'Send reset code'
                    )}
                  </Button>
                </Form>
              ) : (
                <div className="d-grid gap-2">
                  <Link to="/reset-password" className="btn btn-primary">Reset password</Link>
                  <Link to="/login" className="btn btn-outline-secondary">Back to login</Link>
                </div>
              )}

              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">Back to login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
