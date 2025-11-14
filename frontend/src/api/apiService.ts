// src/api/apiService.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore.js'; // Import our store

// 1. Create a new Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from the Zustand store
    const token = useAuthStore.getState().token;

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Continue with the request
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 3. Add a response interceptor (optional but good practice)
// This can be used to handle global errors, like auto-logging out
// if the token expires (401 error).
api.interceptors.response.use(
  (response) => response, // If response is good, just return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 (Unauthorized) error, it means our token is
      // bad or expired. Log the user out.
      console.log('Unauthorized, logging out...');
      useAuthStore.getState().logout();
      // Optionally, redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; // Export the configured Axios instance