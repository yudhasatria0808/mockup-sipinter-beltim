// Auth Context - mockup mode, no API calls
// Mendukung simulasi multi-level role: Operator, Administrator, User (Pimpinan)

import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = "operator" | "administrator" | "user";

interface MockUser {
  fullName: string;
  email: string;
  roleName: string;
  role: UserRole;
}

interface AuthContextType {
  user: MockUser;
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

const AuthContext = createContext<AuthContextType>({
  user: roleProfiles.administrator,
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("administrator");

  const logout = () => {
    window.location.href = '/signin';
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <AuthContext.Provider value={{ user: roleProfiles[currentRole], logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
