import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { royalKnotApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: RoleType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginAsRole: (role: RoleType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<RoleType, { email: string; pass: string; first: string; last: string }> = {
  ROLE_ADMIN: {
    email: 'admin@royalknot.com',
    pass: 'Admin@123',
    first: 'Alexander',
    last: 'Sterling (Founder)',
  },
  ROLE_PLANNER: {
    email: 'planner@royalknot.com',
    pass: 'Planner@123',
    first: 'Isabella',
    last: 'Vance (Lead Planner)',
  },
  ROLE_CLIENT: {
    email: 'client@royalknot.com',
    pass: 'Client@123',
    first: 'Eleanor & Arjun',
    last: 'Sharma (Couple)',
  },
  ROLE_VENDOR: {
    email: 'vendor@royalknot.com',
    pass: 'Vendor@123',
    first: 'Chef Raghavendra',
    last: '(Royal Rasoi)',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // Default to client demonstration user for initial convenience
      loginAsRole('ROLE_CLIENT');
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const auth = await royalKnotApi.login(credentials);
      setToken(auth.token);
      setUser(auth.user);
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    } catch (err) {
      console.warn("Live API login fell back to demo credentials:", err);
      // Fallback to local demo persona
      const matchingRole = Object.keys(DEMO_USERS).find(r => DEMO_USERS[r as RoleType].email === credentials.email) as RoleType | undefined;
      if (matchingRole) {
        await loginAsRole(matchingRole);
      } else {
        throw err;
      }
    }
  };

  const loginAsRole = async (targetRole: RoleType) => {
    const demo = DEMO_USERS[targetRole];
    try {
      const auth = await royalKnotApi.login({ email: demo.email, password: demo.pass });
      setToken(auth.token);
      setUser(auth.user);
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    } catch (e) {
      // Offline / standalone fallback
      const mockUser: User = {
        id: targetRole === 'ROLE_ADMIN' ? 1 : targetRole === 'ROLE_PLANNER' ? 2 : targetRole === 'ROLE_CLIENT' ? 3 : 4,
        email: demo.email,
        firstName: demo.first,
        lastName: demo.last,
        phone: '+91 98765 43210',
        active: true,
        roles: [targetRole],
      };
      const mockToken = 'demo-jwt-token-' + targetRole;
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
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

