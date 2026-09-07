import { Card, Col, Container, Row } from 'react-bootstrap';

const AdminDashboardPage = () => {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin dashboard</h2>
      <Row>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Movies</h6>
              <h3 className="mb-0">160</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Active offers</h6>
              <h3 className="mb-0">23</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Bookings</h6>
              <h3 className="mb-0">12.8K</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;
