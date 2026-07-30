import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ai-talent-intelligence-platform-j1zt.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    // Checks 'jwtToken' first, falls back to 'token'
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unauthenticated or expired sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid credentials and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('role');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;