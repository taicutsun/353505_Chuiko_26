import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    const googleToken = localStorage.getItem("google_access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (googleToken) {
      config.headers.Authorization = `Bearer ${googleToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
