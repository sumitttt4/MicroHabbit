import { User } from '../types';

class AuthService {
  /**
   * Mock login function
   */
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          id: '1', 
          email, 
          isPremium: false 
        });
      }, 1000);
    });
  }

  /**
   * Mock Google login function
   */
  async loginWithGoogle(): Promise<User> {
    // Simulate Google OAuth
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          id: '1', 
          email: 'user@gmail.com', 
          isPremium: false 
        });
      }, 1000);
    });
  }

  /**
   * Mock register function
   */
  async register(email: string, password: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          id: '1', 
          email, 
          isPremium: false 
        });
      }, 1000);
    });
  }

  /**
   * Mock logout function
   */
  async logout(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}

export const authService = new AuthService();
