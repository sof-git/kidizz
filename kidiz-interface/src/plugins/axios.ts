import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'X-auth': localStorage.getItem('user') || '',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('user'); 
  if (token) {
    config.headers['X-auth'] = token;
  }
  return config;
});

export default axiosInstance;