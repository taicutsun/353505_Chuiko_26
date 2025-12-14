import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../api/auth";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: unknown;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  googleLogin: () => void;
  loginMutation: unknown;
  registerMutation: unknown;
  logoutMutation: unknown;
}

export type { LoginRequest, RegisterRequest, AuthResponse, User };
