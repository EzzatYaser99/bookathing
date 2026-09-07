// Authentication utilities - Helper functions for auth-related operations
// Similar to Angular services/utils

import { authService } from './services/authService';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

// Get authentication token
export const getToken = (): string | null => {
  return authService.getToken();
};

// Get current user
export const getCurrentUser = (): any => {
  return authService.getUser();
};

// Logout user
export const logout = (): void => {
  authService.logout();
};

// Email validation regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Password match validation
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
