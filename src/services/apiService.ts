import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BAR_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Centralized Mock Data for Demo Mode (Backend-less)
const MOCK_DATA: Record<string, any> = {
  "/news": [
    { id: "1", title: "Nueva propuesta de pavimentación para los barrios del Sur", excerpt: "La agrupación Acción Alvarado presentó un proyecto integral para mejorar la infraestructura vial...", date: "24 Mar 2026", category: "Propuestas", status: "publicado", imageUrl: "https://imgs.search.brave.com/kXtuaXk6aj-H8RDm_Dbhpc50361W09u8ygvrTBk0l50/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y2FudWVsYXMuZ292/LmFyL21lZGlhL2sy/L2l0ZW1zL2NhY2hl/LzcxNzg3YWVlY2Ew/ZGZiNTI1OTk0ZDhj/YzJmYWQ4YzgyX1hM/LmpwZw" },
    { id: "2", title: "Reunión vecinal exitosa en la Plaza Central", excerpt: "Más de 100 vecinos se acercaron a compartir sus inquietudes sobre el problema de la basura.", date: "22 Mar 2026", category: "Comunidad", status: "publicado", imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200" },
    { id: "3", title: "Informe: El estado de las cuentas municipales", excerpt: "Publicamos nuestro análisis detallado sobre el presupuesto del último año...", date: "20 Mar 2026", category: "Transparencia", status: "borrador", imageUrl: "https://imgs.search.brave.com/ztlPZQqqZImleCNh4LNbO4ez1U8UFSPuQCOcCOxAaUU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8w/Mi8yNS8wOS80NC9t/dW5pY2lwYWwtZWxl/Y3Rpb24tNDg3ODQw/NV9fMzQwLmpwZw" },
  ],
  "/complaints": [
    { id: "c1", lat: -38.2731, lng: -57.8404, description: "Bache profundo en Calle 27 e/ 24 y 22.", category: "Calles", status: "en proceso", createdAt: "24 Mar 2026" },
    { id: "c2", lat: -38.2711, lng: -57.8424, description: "Acumulación de basura fuera de hora.", category: "Basura", status: "pendiente", createdAt: "23 Mar 2026" },
    { id: "c3", lat: -38.2751, lng: -57.8444, description: "Luminaria rota calle 35 e/ 24 y 26", category: "Alumbrado", status: "resuelto", createdAt: "22 Mar 2026" },
    { id: "c4", lat: -38.2731, lng: -57.8590, description: "Robos en calle 49 e/ 44 y 46", category: "Seguridad", status: "pendiente", createdAt: "22 Mar 2026" },
  ],
  "/auth/login": {
    user: { id: "u1", name: "Admin Demo", email: "admin@accion.com", role: "admin" },
    token: "mock-jwt-token-for-demo-purposes",
  }
};

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

// Interceptor to handle unauthorized errors and fallback to Mock Data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error (backend offline) or if we want to force demo mode
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED';

    if (isNetworkError) {
      const url = error.config.url;
      console.warn(`[API OFFLINE] Mocking response for: ${url}`);

      // Find the appropriate mock data based on the requested path
      const mockPath = Object.keys(MOCK_DATA).find(path => url.includes(path));
      const mockResponse = mockPath ? MOCK_DATA[mockPath] : (url.includes('/id') ? MOCK_DATA['/news'][0] : []);

      return Promise.resolve({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      });
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
