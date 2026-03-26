import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BAR_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BAR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on 401 (token expired or invalid)
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
