import { Card, Col, Container, Row } from 'react-bootstrap';

const OwnerDashboardPage = () => {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Owner dashboard</h2>
      <Row>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Theaters</h6>
              <h3 className="mb-0">4</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Screens</h6>
              <h3 className="mb-0">12</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Revenue</h6>
              <h3 className="mb-0">$28.4K</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerDashboardPage;
