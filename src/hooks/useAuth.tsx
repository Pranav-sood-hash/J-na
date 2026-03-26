import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_CONFIG } from '@/config/admin';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user - in production, this would come from a database
const MOCK_ADMIN_USER: AuthUser = {
  id: 'admin-001',
  email: ADMIN_CONFIG.email
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('auth_user');

      if (isLoggedIn) {
        const storedUser = JSON.parse(isLoggedIn);
        setUser(storedUser);
        setIsAdmin(storedUser.email === ADMIN_CONFIG.email);
      }

      setIsLoading(false);
    };

    // Simulate loading delay
    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Validate admin credentials
      if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
        // Store session
        localStorage.setItem('auth_user', JSON.stringify(MOCK_ADMIN_USER));

        // Set user
        setUser(MOCK_ADMIN_USER);
        setIsAdmin(true);

        return { error: null };
      } else {
        return { error: new Error('Invalid email or password') };
      }
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
