// Auth Context - mockup mode, no API calls

import { createContext, useContext, type ReactNode } from 'react';

interface MockUser {
  fullName: string;
  email: string;
  roleName: string;
}

interface AuthContextType {
  user: MockUser;
  logout: () => void;
}

const mockUser: MockUser = {
  fullName: 'Admin User',
  email: 'admin@example.com',
  roleName: 'Administrator',
};

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const logout = () => {
    // mockup: no-op
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider value={{ user: mockUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
