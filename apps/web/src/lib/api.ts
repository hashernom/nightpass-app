import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: maneja token expirado (401) intentando refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // El refresh token está en cookies HttpOnly, el backend lo leerá automáticamente
        await api.post('/auth/refresh');
        // El backend configurará nuevos cookies automáticamente
        return api(original);
      } catch {
        // Si el refresh falla, redirigir al login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
