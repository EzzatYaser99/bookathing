import { authService, type AuthUser } from './services/authService';

export const isAuthenticated = (): boolean => authService.isAuthenticated();
export const getToken = (): string | null => authService.getToken();
export const getCurrentUser = (): AuthUser | null => authService.getUser();
export const getRefreshToken = (): string | null => authService.getRefreshToken();
export const logout = async (): Promise<void> => { await authService.logout(); };
export const hasRole = (role: 'user' | 'owner' | 'admin'): boolean => {
  return getCurrentUser()?.role === role;
};
export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (password: string): boolean => password.length >= 8;
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => password === confirmPassword;
