import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach JWT token automatically if stored in localStorage
API.interceptors.request.use((config) => {
  // Checks 'jwtToken' first, falls back to 'token' if not found
  const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;