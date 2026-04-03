import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL can be set via REACT_APP_BASE_URL env variable, defaulting to localhost for development
  baseURL: process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : 'http://localhost:5001',
  // baseURL: 'http://localhost:5001', // local
  // baseURL: 'http://13.55.24.8:5001', // live
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
