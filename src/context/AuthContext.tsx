import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export type UserType = 'seeker' | 'provider';

// Define user interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  userType: UserType;
  notifications?: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  preferences?: {
    currency: string;
    language: string;
    newsletter: boolean;
  };
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<{ success: boolean; message: string }>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for testing
const dummyUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'seeker@example.com',
    password: 'seeker123', // In a real app, passwords would be hashed
    phone: '+90 533 123 4567',
    address: '123 Beach Road',
    city: 'Kyrenia',
    country: 'North Cyprus',
    userType: 'seeker' as UserType,
    notifications: {
      email: true,
      sms: false,
      app: true
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      newsletter: true
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'provider@example.com',
    password: 'provider123', // In a real app, passwords would be hashed
    phone: '+90 542 987 6543',
    address: '456 Mountain View',
    city: 'Famagusta',
    country: 'North Cyprus',
    userType: 'provider' as UserType,
    notifications: {
      email: true,
      sms: true,
      app: true
    },
    preferences: {
      currency: 'EUR',
      language: 'English',
      newsletter: false
    }
  }
];

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cyprusStaysUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('cyprusStaysUser');
      }
    }
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = dummyUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (foundUser) {
          // Remove password before storing in state
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          
          // Store in localStorage for persistence
          localStorage.setItem('cyprusStaysUser', JSON.stringify(userWithoutPassword));
          
          resolve({ success: true, message: 'Login successful' });
        } else {
          resolve({ success: false, message: 'Invalid email or password' });
        }
      }, 1000); // Simulate network delay
    });
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cyprusStaysUser');
  };
  
  // Register function
  const register = async (userData: Partial<User>, password: string): Promise<{ success: boolean; message: string }> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = dummyUsers.find(
          (u) => u.email.toLowerCase() === userData.email?.toLowerCase()
        );
        
        if (existingUser) {
          resolve({ success: false, message: 'Email already in use' });
        } else {
          // Create new user
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            password, // In a real app, this would be hashed
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            country: userData.country || '',
            userType: userData.userType || 'seeker',
            notifications: {
              email: true,
              sms: false,
              app: true
            },
            preferences: {
              currency: 'USD',
              language: 'English',
              newsletter: true
            }
          };
          
          // Add to dummy users (in a real app, this would be saved to a database)
          dummyUsers.push(newUser);
          
          // Remove password before storing in state
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          
          // Store in localStorage for persistence
          localStorage.setItem('cyprusStaysUser', JSON.stringify(userWithoutPassword));
          
          resolve({ success: true, message: 'Registration successful' });
        }
      }, 1000); // Simulate network delay
    });
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export dummy credentials for testing
export const dummyCredentials = {
  seeker: {
    email: 'seeker@example.com',
    password: 'seeker123'
  },
  provider: {
    email: 'provider@example.com',
    password: 'provider123'
  }
};
