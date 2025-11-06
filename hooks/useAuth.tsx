import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User as AppUser, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER_STORAGE_KEY = 'cacrs-mock-user';

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const isAdmin = email === 'nyh770@gmail.com';
    const mockUser: AppUser = {
      id: `mock-${Date.now()}`,
      email: email,
      role: isAdmin ? UserRole.ADMIN : UserRole.ANALYST,
    };
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    setUser(null);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-dark-bg">
              <Spinner size={48} />
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};