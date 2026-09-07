import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

const BookingConfirmationPage = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const summary = localStorage.getItem('bookathing_booking_summary');
  const payment = localStorage.getItem('bookathing_payment_result');
  const booking = summary ? JSON.parse(summary) : null;

  useEffect(() => {
    const loadConfirmation = async () => {
      if (!booking?.id) {
        setLoading(false);
        return;
      }

      try {
        const confirmedPayment = await paymentService.getPaymentByBooking(booking.id);
        setPaymentDetails(confirmedPayment ?? (payment ? JSON.parse(payment) : null));
      } catch {
        setPaymentDetails(payment ? JSON.parse(payment) : null);
      } finally {
        setLoading(false);
      }
    };

    void loadConfirmation();
  }, [booking?.id, payment]);

  const resolvedPayment = paymentDetails ?? (payment ? JSON.parse(payment) : null);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-success">
            <Card.Body className="p-4 text-center">
              <Alert variant="success" className="mb-4">
                Booking confirmed successfully.
              </Alert>

              {loading ? (
                <div className="py-3"><Spinner animation="border" /></div>
              ) : (
                <>
                  <h2 className="mb-3">Ticket details</h2>
                  <p className="text-muted mb-4">Your reservation is ready.</p>

                  <div className="text-start">
                    <p><strong>Booking ID:</strong> {booking?.id || 'BK-1001'}</p>
                    <p><strong>Movie:</strong> {booking?.movieId || 'Sample Movie'}</p>
                    <p><strong>Seats:</strong> {booking?.seats?.join(', ') || 'A1, A2'}</p>
                    <p><strong>Payment:</strong> {resolvedPayment?.paymentMethod || 'Credit Card'}</p>
                    <p><strong>Total paid:</strong> ${booking?.total ?? resolvedPayment?.amount ?? 180}</p>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-center gap-2 mt-4">
                <Link to="/dashboard/bookings">
                  <Button variant="primary">View bookings</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline-primary">Continue browsing</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmationPage;
