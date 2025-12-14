import api from "./index";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  provider: "google" | "local";
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get<{ user: User }>("/auth/me");
      return response.data;
    } catch (error) {
      // If we have a Google token but no JWT, use stored user data
      const googleToken = localStorage.getItem("google_access_token");
      const storedUserData = localStorage.getItem("google_user_data");

      if (googleToken && storedUserData) {
        const user = JSON.parse(storedUserData);
        return { user };
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  googleLogin: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
};
