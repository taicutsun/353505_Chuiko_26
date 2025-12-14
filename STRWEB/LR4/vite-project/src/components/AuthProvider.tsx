import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AuthContextType,
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../hooks/authUtils";
import { AuthContext } from "../contexts/AuthContext";

const TOKEN_KEY = "auth_token";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const googleToken = localStorage.getItem("google_access_token");
    const userData = localStorage.getItem("google_user_data");

    if (token || (googleToken && userData)) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        try {
          const parsedUser = userData ? JSON.parse(userData) : null;
          setUser(parsedUser);
        } catch {
          console.error("Failed to parse user data");
        }
        setIsLoading(false);
      }, 0);
    } else {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Frontend-only login - store mock user data
    const mockUser: User = {
      id: "1",
      email: credentials.email || "user@example.com",
      name: "Test User",
      role: "user",
      provider: "local",
      isActive: true,
    };

    localStorage.setItem(TOKEN_KEY, "mock-token");
    setUser(mockUser);
    queryClient.setQueryData(["currentUser"], { user: mockUser });

    return {
      user: mockUser,
      token: "mock-token",
    };
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Frontend-only register
    const mockUser: User = {
      id: "1",
      email: userData.email || "user@example.com",
      name: userData.name || "Test User",
      role: "user",
      provider: "local",
      isActive: true,
    };

    localStorage.setItem(TOKEN_KEY, "mock-token");
    setUser(mockUser);
    queryClient.setQueryData(["currentUser"], { user: mockUser });

    return {
      user: mockUser,
      token: "mock-token",
    };
  };

  const logout = () => {
    // Clear everything immediately - frontend only auth
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("token_expires");
    localStorage.removeItem("google_user_data");
    setUser(null);
    queryClient.setQueryData(["currentUser"], null);
    queryClient.clear();
  };

  const googleLogin = () => {
    // Mock Google login
    const mockUser: User = {
      id: "1",
      email: "googleuser@example.com",
      name: "Google User",
      role: "user",
      provider: "google",
      isActive: true,
      avatar: "https://via.placeholder.com/40",
    };

    localStorage.setItem("google_access_token", "mock-google-token");
    localStorage.setItem("google_user_data", JSON.stringify(mockUser));
    setUser(mockUser);
    queryClient.setQueryData(["currentUser"], { user: mockUser });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error: null,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    googleLogin,
    loginMutation: null,
    registerMutation: null,
    logoutMutation: null,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
