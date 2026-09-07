// ProtectedRoute component - Similar to Angular Route Guard
// Protects routes that require authentication

import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../features/auth/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
