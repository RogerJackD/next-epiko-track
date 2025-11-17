// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { TokenService } from '@/services/auth/tokens';
import { LoginResponse } from '@/types/loginResponse';

type UserData = Omit<LoginResponse, 'token'>;

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = TokenService.getUserData();
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = () => {
    TokenService.clearAll();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}