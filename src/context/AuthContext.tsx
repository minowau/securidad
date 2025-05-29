import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  authStage: 'initial' | 'password' | 'behavioral' | 'complete';
  setAuthStage: (stage: 'initial' | 'password' | 'behavioral' | 'complete') => void;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  authStage: 'initial',
  setAuthStage: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStage, setAuthStage] = useState<'initial' | 'password' | 'behavioral' | 'complete'>('initial');

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setAuthStage('complete');
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      username,
      name: 'Alex Johnson',
      email: `${username}@example.com`,
      accounts: [
        { id: '101', name: 'Main Checking', balance: 2547.63, accountNumber: '****4321' },
        { id: '102', name: 'Savings', balance: 15750.42, accountNumber: '****8765' },
        { id: '103', name: 'Investment', balance: 32650.18, accountNumber: '****9012' }
      ]
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthStage('behavioral');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setAuthStage('initial');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        authStage,
        setAuthStage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};