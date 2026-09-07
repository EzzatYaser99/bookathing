import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { offerService } from '../services/offerService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(true);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState<Array<{ code?: string; name?: string; type?: string; discount?: number; value?: number }>>([]);

  const selectedShowtime = useMemo(() => {
    const value = localStorage.getItem('bookathing_selected_showtime');
    return value ? JSON.parse(value) : null;
  }, []);

  const selectedSeats = useMemo(() => {
    const value = localStorage.getItem('bookathing_selected_seats');
    return value ? JSON.parse(value) : [];
  }, []);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const activeOffers = await offerService.getActiveOffers();
        setOffers(Array.isArray(activeOffers) ? activeOffers : []);
      } catch {
        setOffers([]);
      } finally {
        setOffersLoading(false);
      }
    };

    void loadOffers();
  }, []);

  const basePrice = Number(selectedShowtime?.price ?? selectedShowtime?.ticketPrice ?? 180);
  const subtotal = selectedSeats.length * basePrice;
  const discountValue = promoCode ? Math.min(subtotal * 0.1, 300) : 0;
  const total = subtotal - discountValue;

  const applyOffer = (code: string) => {
    setPromoCode(code);
    setError('');
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        movieId: selectedShowtime?.movieId || 'demo-movie',
        theaterId: selectedShowtime?.theaterId || 'demo-theater',
        showtimeId: selectedShowtime?.id || 'demo-showtime',
        seats: selectedSeats,
        promoCode: promoCode || undefined,
        basePrice,
      };

      const booking = await bookingService.createBooking(payload);
      localStorage.setItem('bookathing_booking_summary', JSON.stringify({
        ...booking,
        subtotal,
        discount: discountValue,
        total,
        seats: selectedSeats,
        movieId: payload.movieId,
        theaterId: payload.theaterId,
        showtimeId: payload.showtimeId,
      }));
      navigate('/booking/payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Booking summary</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Your selection</h5>
              <p className="mb-2"><strong>Showtime:</strong> {selectedShowtime ? new Date(selectedShowtime.startTime).toLocaleString() : 'N/A'}</p>
              <p className="mb-2"><strong>Seats:</strong> {selectedSeats.length ? selectedSeats.join(', ') : 'None selected'}</p>
              <p className="mb-0"><strong>Base price:</strong> ${basePrice}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Promo code</h5>
              <Form.Control
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Enter offer code"
              />
              <div className="mt-3 d-flex flex-wrap gap-2">
                {offersLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : offers.length > 0 ? (
                  offers.map((offer, index) => (
                    <Button key={`${offer.code ?? 'offer'}-${index}`} variant="outline-primary" size="sm" onClick={() => applyOffer(offer.code ?? '')}>
                      {offer.code ?? offer.name ?? 'Offer'}
                    </Button>
                  ))
                ) : (
                  <Button variant="outline-primary" size="sm" onClick={() => applyOffer('WELCOME10')}>
                    Try WELCOME10
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Order total</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Discount</span>
                <strong>-${discountValue}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span>Total</span>
                <strong>${total}</strong>
              </div>
              <Button variant="primary" className="w-100" onClick={handleCreateBooking} disabled={loading || selectedSeats.length === 0}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Continue to payment'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
