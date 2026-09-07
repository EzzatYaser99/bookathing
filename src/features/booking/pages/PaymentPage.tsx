import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summary = localStorage.getItem('bookathing_booking_summary');
  const booking = summary ? JSON.parse(summary) : null;

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        bookingId: booking?.id || booking?.bookingId || 'demo-booking',
        amount: booking?.total ?? 180,
        paymentMethod,
      };

      const payment = await paymentService.processPayment(payload);
      localStorage.setItem('bookathing_payment_result', JSON.stringify(payment));
      navigate('/booking/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Payment</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select payment method</Form.Label>
                  <Form.Select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                    <option value="credit_card">Credit Card</option>
                    <option value="fawry">Fawry</option>
                    <option value="vodafone_cash">Vodafone Cash</option>
                    <option value="stripe">Stripe</option>
                  </Form.Select>
                </Form.Group>

                {paymentMethod === 'credit_card' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Card number</Form.Label>
                      <Form.Control placeholder="4242 4242 4242 4242" />
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry</Form.Label>
                          <Form.Control placeholder="MM/YY" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVC</Form.Label>
                          <Form.Control placeholder="123" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Amount</h5>
              <p className="display-6 mb-0">${booking?.total ?? 180}</p>
              <Button variant="primary" className="w-100 mt-4" onClick={handlePayment} disabled={loading || !booking}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Pay now'}
              </Button>
              {!booking && (
                <p className="text-muted small mt-2 mb-0">Create a booking before continuing to payment.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
