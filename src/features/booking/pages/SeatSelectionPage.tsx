import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { seatService } from '../services/seatService';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: string;
  type: string;
}

const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedShowtime = localStorage.getItem('bookathing_selected_showtime');
    const showtime = selectedShowtime ? JSON.parse(selectedShowtime) : null;

    const fetchSeats = async () => {
      if (!showtime?.screenId) {
        setSeats([]);
        setLoading(false);
        return;
      }

      const payload = await seatService.getSeatLayout(showtime.screenId, showtime.id);
      setSeats(payload?.seats ?? []);
      setLoading(false);
    };

    void fetchSeats();
  }, []);

  const seatRows = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      grouped[seat.row] = grouped[seat.row] ?? [];
      grouped[seat.row].push(seat);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((previous) =>
      previous.includes(seatId) ? previous.filter((id) => id !== seatId) : [...previous, seatId],
    );
  };

  const handleContinue = () => {
    localStorage.setItem('bookathing_selected_seats', JSON.stringify(selectedSeats));
    navigate('/booking/checkout');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Select your seats</h2>
      <div className="mb-4 text-center">
        <div className="mx-auto border rounded bg-light py-2 px-4 d-inline-block">SCREEN</div>
      </div>

      {seats.length === 0 ? (
        <Alert variant="info">No seat layout is available yet for this showtime.</Alert>
      ) : (
        <Card className="p-3 shadow-sm">
          {seatRows.map(([row, rowSeats]) => (
            <div key={row} className="d-flex justify-content-center gap-2 my-2 flex-wrap">
              {rowSeats.sort((a, b) => a.number - b.number).map((seat) => {
                const selected = selectedSeats.includes(seat.id);
                const disabled = seat.status === 'booked';

                return (
                  <Button
                    key={seat.id}
                    variant={selected ? 'primary' : disabled ? 'secondary' : seat.type === 'vip' ? 'warning' : 'outline-primary'}
                    size="sm"
                    disabled={disabled}
                    onClick={() => toggleSeat(seat.id)}
                    className="px-3"
                  >
                    {seat.number}
                  </Button>
                );
              })}
            </div>
          ))}
        </Card>
      )}

      <div className="mt-4 d-flex justify-content-between align-items-center">
        <span className="text-muted">Selected: {selectedSeats.length}</span>
        <Button variant="primary" onClick={handleContinue} disabled={selectedSeats.length === 0}>
          Continue to checkout
        </Button>
      </div>
    </Container>
  );
};

export default SeatSelectionPage;
