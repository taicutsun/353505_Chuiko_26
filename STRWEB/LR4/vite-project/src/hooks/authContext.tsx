import { createContext } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  provider: "google" | "local";
  isActive: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export type { AuthContextType, User };
