// 404 Not Found Page - Similar to Angular Component
// Displays when a route is not found

import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline-primary">Go to Login</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
