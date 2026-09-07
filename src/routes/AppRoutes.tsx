import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import Dashboard from '../features/dashboard/pages/Dashboard';
import MyBookings from '../features/dashboard/pages/MyBookings';
import Favorites from '../features/dashboard/pages/Favorites';
import Profile from '../features/dashboard/pages/Profile';
import Settings from '../features/dashboard/pages/Settings';
import Home from '../features/browsing/pages/Home';
import MovieDetails from '../features/browsing/pages/MovieDetails';
import ShowtimesPage from '../features/booking/pages/ShowtimeSelectionPage';
import SeatSelectionPage from '../features/booking/pages/SeatSelectionPage';
import CheckoutPage from '../features/booking/pages/CheckoutPage';
import PaymentPage from '../features/booking/pages/PaymentPage';
import BookingConfirmationPage from '../features/booking/pages/BookingConfirmationPage';
import OwnerDashboardPage from '../features/owner/pages/OwnerDashboardPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import NotFound from '../pages/NotFound';
import ProtectedRoute, { RoleProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />
      <Route path="/booking/seats" element={<SeatSelectionPage />} />
      <Route path="/booking/checkout" element={<CheckoutPage />} />
      <Route path="/booking/payment" element={<PaymentPage />} />
      <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['owner', 'admin']}>
            <OwnerDashboardPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </RoleProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
