import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../features/auth/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: Array<'user' | 'owner' | 'admin'>;
}> = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  const role = user?.role ?? 'user';

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }

    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
