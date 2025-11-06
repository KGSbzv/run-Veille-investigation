import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User as AppUser, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: (credentialResponse: any) => void;
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

  const createUserSession = useCallback((email: string, id: string) => {
    // This logic determines user role. In a real app, this would come from a backend.
    const isAdmin = email === 'nyh770@gmail.com';
    const newUser: AppUser = {
      id: id,
      email: email,
      role: isAdmin ? UserRole.ADMIN : UserRole.ANALYST,
      status: 'actif',
    };
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);
  
  const loginWithGoogle = useCallback((credentialResponse: any) => {
    try {
      const jwtToken = credentialResponse.credential;
      if (!jwtToken) {
          console.error("Google credential response did not contain a token.");
          return;
      }
      
      // Decode JWT payload (no signature verification needed on client-side for this purpose)
      const payloadBase64 = jwtToken.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      const email = payload.email;

      if (!email) {
          console.error("No email found in Google credential response payload");
          return;
      }
      
      createUserSession(email, payload.sub); // Use Google's unique subject ID as the user ID

    } catch (error) {
        console.error("Error decoding Google credential or logging in:", error);
    }
  }, [createUserSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    setUser(null);
    // @ts-ignore
    if (typeof google !== 'undefined') {
        // @ts-ignore
        google.accounts.id.disableAutoSelect();
    }
  }, []);
  
  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-dark-bg">
              <Spinner size={48} />
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
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