import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5100';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('sipintar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('sipintar_token');
      sessionStorage.removeItem('sipintar_auth');
      // Only redirect if not already on signin page
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
