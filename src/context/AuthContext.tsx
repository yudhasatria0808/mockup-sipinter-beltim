// Auth Context - mockup mode, no API calls
// Mendukung simulasi multi-level role: Operator, Administrator, User (Pimpinan)
// Mock login dengan credential statis + RBAC

import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = "operator" | "administrator" | "user";

export interface MockUser {
  fullName: string;
  email: string;
  roleName: string;
  role: UserRole;
}

interface MockCredential {
  username: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: MockUser;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const roleProfiles: Record<UserRole, MockUser> = {
  operator: {
    fullName: "Budi Santoso",
    email: "operator@sipintar.go.id",
    roleName: "Operator",
    role: "operator",
  },
  administrator: {
    fullName: "Admin SIPINTAR",
    email: "admin@sipintar.go.id",
    roleName: "Administrator",
    role: "administrator",
  },
  user: {
    fullName: "Bupati Belitung Timur",
    email: "pimpinan@sipintar.go.id",
    roleName: "User (Pimpinan)",
    role: "user",
  },
};

/**
 * Mock credentials untuk login.
 * Gunakan salah satu dari credential berikut:
 * - admin / admin123     → Administrator
 * - operator / operator123 → Operator
 * - pimpinan / pimpinan123 → User (Pimpinan)
 */
export const mockCredentials: MockCredential[] = [
  { username: "admin", password: "admin123", role: "administrator" },
  { username: "operator", password: "operator123", role: "operator" },
  { username: "pimpinan", password: "pimpinan123", role: "user" },
];

const AUTH_STORAGE_KEY = "sipintar_auth";

function getStoredAuth(): { isAuthenticated: boolean; role: UserRole } {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { isAuthenticated: false, role: "administrator" };
}

function setStoredAuth(isAuthenticated: boolean, role: UserRole) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated, role }));
}

function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

const AuthContext = createContext<AuthContextType>({
  user: roleProfiles.administrator,
  isAuthenticated: false,
  login: () => ({ success: false }),
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(stored.isAuthenticated);
  const [currentRole, setCurrentRole] = useState<UserRole>(stored.role);

  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const found = mockCredentials.find(
      (c) => c.username === username && c.password === password
    );

    if (found) {
      setIsAuthenticated(true);
      setCurrentRole(found.role);
      setStoredAuth(true, found.role);
      return { success: true };
    }

    return { success: false, message: "Username atau password salah" };
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearStoredAuth();
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setStoredAuth(true, role);
  };

  return (
    <AuthContext.Provider value={{ user: roleProfiles[currentRole], isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
