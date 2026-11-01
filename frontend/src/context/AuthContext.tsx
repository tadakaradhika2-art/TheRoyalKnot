import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { royalKnotApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: RoleType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  loginAsRole: (role: RoleType) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<RoleType, { email: string; pass: string }> = {
  ROLE_ADMIN: {
    email: 'admin@royalknot.com',
    pass: 'Royal@2026!',
  },
  ROLE_PLANNER: {
    email: 'planner@royalknot.com',
    pass: 'Royal@2026!',
  },
  ROLE_CLIENT: {
    email: 'client@royalknot.com',
    pass: 'Royal@2026!',
  },
  ROLE_VENDOR: {
    email: 'vendor@royalknot.com',
    pass: 'Royal@2026!',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          const freshUser = await royalKnotApi.getMe();
          setToken(savedToken);
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (e) {
          // Token is invalid or expired: clear invalid session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const auth = await royalKnotApi.login(credentials);
      setToken(auth.token);
      setUser(auth.user);
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      return auth.user;
    } catch (error) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const loginAsRole = async (targetRole: RoleType): Promise<User> => {
    const demo = DEMO_USERS[targetRole];
    if (!demo) {
      throw new Error(`Demo account for role ${targetRole} not found`);
    }
    try {
      const auth = await royalKnotApi.login({ email: demo.email, password: demo.pass });
      setToken(auth.token);
      setUser(auth.user);
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      return auth.user;
    } catch (error) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const primaryRole: RoleType | null = user && user.roles && user.roles.length > 0 ? user.roles[0] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: primaryRole,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
