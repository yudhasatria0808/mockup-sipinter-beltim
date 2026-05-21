import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../services/api';

export type UserRole = "operator" | "administrator" | "user";

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roleName: string;
  roleId: string;
  role: UserRole;
  permissions: MenuPermission[];
}

export interface MenuPermission {
  menuId: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  hasAccess: boolean;
}

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// Demo credentials — kept for quick login buttons
export const mockCredentials = [
  { username: "admin", password: "admin123", role: "administrator" as UserRole },
  { username: "operator", password: "operator123", role: "operator" as UserRole },
  { username: "pimpinan", password: "pimpinan123", role: "user" as UserRole },
];

const AUTH_STORAGE_KEY = "sipintar_auth";
const TOKEN_KEY = "sipintar_token";

function mapRoleNameToRole(roleName: string): UserRole {
  const lower = roleName.toLowerCase();
  if (lower.includes("admin")) return "administrator";
  if (lower.includes("operator")) return "operator";
  return "user";
}

const defaultUser: AuthUser = {
  id: '',
  username: '',
  fullName: '',
  email: '',
  roleName: '',
  roleId: '',
  role: 'administrator',
  permissions: [],
};

function getStoredAuth(): { isAuthenticated: boolean; user: AuthUser } {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { isAuthenticated: false, user: defaultUser };
}

function setStoredAuth(isAuthenticated: boolean, user: AuthUser) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated, user }));
}

function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(stored.isAuthenticated);
  const [currentUser, setCurrentUser] = useState<AuthUser>(stored.user);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // 1. Login to get token
      const loginRes = await api.post('/api/auth/login', { username, password });
      const loginData = loginRes.data;

      if (!loginData.success) {
        return { success: false, message: loginData.message || 'Login gagal' };
      }

      const { token, fullName, email, roleName, roleId, userId } = loginData.data;

      // Store token
      sessionStorage.setItem(TOKEN_KEY, token);

      // 2. Fetch user permissions
      let permissions: MenuPermission[] = [];
      try {
        const meRes = await api.get('/api/auth/me');
        if (meRes.data.success) {
          permissions = meRes.data.data.permissions || [];
        }
      } catch {
        // Non-critical — continue without permissions
      }

      const user: AuthUser = {
        id: userId,
        username,
        fullName,
        email,
        roleName,
        roleId,
        role: mapRoleNameToRole(roleName),
        permissions,
      };

      setIsAuthenticated(true);
      setCurrentUser(user);
      setStoredAuth(true, user);

      return { success: true };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosErr.response?.status === 401) {
          return { success: false, message: 'Username atau password salah' };
        }
        if (axiosErr.response?.status === 403) {
          return { success: false, message: 'Akun tidak aktif' };
        }
        return { success: false, message: axiosErr.response?.data?.message || 'Login gagal' };
      }
      return { success: false, message: 'Tidak dapat terhubung ke server' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(defaultUser);
    clearStoredAuth();
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
