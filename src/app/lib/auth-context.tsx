import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: 'recruiter' | 'candidate', company?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (in production, this would be in a database)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@jobportal.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'recruiter@techcorp.com',
    name: 'Jane Smith',
    role: 'recruiter',
    company: 'TechCorp',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'john@email.com',
    name: 'John Doe',
    role: 'candidate',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check against mock users or stored users
    const allUsers = [...MOCK_USERS];
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      allUsers.push(...JSON.parse(storedUsers));
    }

    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: 'recruiter' | 'candidate',
    company?: string
  ) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const allUsers = [...MOCK_USERS];
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      allUsers.push(...JSON.parse(storedUsers));
    }

    if (allUsers.some(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      company,
      createdAt: new Date().toISOString(),
    };

    // Store user
    const updatedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    updatedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
