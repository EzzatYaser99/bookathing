import { apiRequest } from '../../../services/api';

const TOKEN_KEY = 'bookathing_access_token';
const REFRESH_TOKEN_KEY = 'bookathing_refresh_token';
const USER_KEY = 'bookathing_user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  otp?: string;
  confirmPassword?: string;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'owner' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

class AuthService {
  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private saveSession(user: AuthUser, accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async sendSignupOtp(data: { email: string }): Promise<AuthResponse> {
    try {
      const response = await apiRequest<{ message?: string }>('/auth/send-signup-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        success: true,
        message: response?.message || 'OTP sent successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to send OTP.',
      };
    }
  }

  async completeSignup(data: RegisterData): Promise<AuthResponse> {
    try {
      const payload = await apiRequest<{
        user?: AuthUser;
        accessToken?: string;
        refreshToken?: string;
        message?: string;
      }>('/auth/complete-signup', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          otp: data.otp,
        }),
      });

      if (payload.accessToken && payload.refreshToken) {
        this.saveSession(payload.user ?? { email: data.email, name: data.name, role: 'user' }, payload.accessToken, payload.refreshToken);
      }

      return {
        success: true,
        message: payload.message || 'Account created successfully.',
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed.',
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const payload = await apiRequest<{
        user?: AuthUser;
        accessToken?: string;
        refreshToken?: string;
        message?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (payload.accessToken && payload.refreshToken) {
        this.saveSession(payload.user ?? { email: credentials.email, role: 'user' }, payload.accessToken, payload.refreshToken);
      }

      return {
        success: true,
        message: payload.message || 'Logged in successfully.',
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Invalid email or password.',
      };
    }
  }

  async refreshToken(): Promise<{ accessToken?: string; refreshToken?: string } | null> {
    const currentRefreshToken = this.getRefreshToken();

    if (!currentRefreshToken) {
      return null;
    }

    try {
      const payload = await apiRequest<{ accessToken?: string; refreshToken?: string }>('auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      }, true);

      if (payload.accessToken && payload.refreshToken) {
        localStorage.setItem(TOKEN_KEY, payload.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
      }

      return payload;
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    try {
      const response = await apiRequest<{ message?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }, true);

      return {
        success: true,
        message: response?.message || 'If an account with that email exists, a reset code has been sent.',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Could not send reset OTP.',
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response = await apiRequest<{ message?: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword ?? data.newPassword,
        }),
      }, true);

      return {
        success: true,
        message: response?.message || 'Password has been reset successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to reset password.',
      };
    }
  }

  async logout(): Promise<void> {
    const currentToken = this.getToken();

    try {
      if (currentToken) {
        await apiRequest('/auth/logout', { method: 'POST' }, true);
      }
    } catch (error) {
      console.warn('Logout request failed, clearing local session.', error);
    } finally {
      this.clearSession();
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
