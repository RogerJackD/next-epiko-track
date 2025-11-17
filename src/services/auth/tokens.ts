// services/auth/tokens.ts

import { LoginResponse } from "@/types/loginResponse";

export const TokenService = {
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Nuevos métodos para manejar datos del usuario
  setUserData(userData: Omit<LoginResponse, 'token'>) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  },

  getUserData(): Omit<LoginResponse, 'token'> | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  removeUserData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
    }
  },

  // Método para limpiar todo
  clearAll() {
    this.removeToken();
    this.removeUserData();
  }
};