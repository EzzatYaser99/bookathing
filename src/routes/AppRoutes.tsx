// AppRoutes - Similar to Angular Router Configuration
// Defines all application routes

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
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Browsing */}
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />

      {/* Public Routes - Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes - Dashboard */}
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

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
