// Authentication service - Similar to Angular Service
// Handles all authentication-related API calls and state management

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Mock authentication service
// TODO: Replace with actual API calls when backend is ready
class AuthService {
  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      const mockResponse: AuthResponse = {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      this.setToken(mockResponse.token!);
      this.setUser(mockResponse.user!);

      return mockResponse;
    }

    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Register method
  async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call

    // Mock registration
    const mockResponse: AuthResponse = {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    };

    this.setToken(mockResponse.token!);
    this.setUser(mockResponse.user!);

    return mockResponse;
  }

  // Forgot password method
  async forgotPassword(_data: ForgotPasswordData): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call

    return {
      success: true,
      message: 'Password reset link sent to your email',
    };
  }

  // Reset password method
  async resetPassword(_data: ResetPasswordData): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set token in localStorage
  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Get user from localStorage
  getUser(): any {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user in localStorage
  private setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

// Export singleton instance
export const authService = new AuthService();
