import axios from 'axios';
import { logout, isTokenExpired } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedRequests = [];

const processFailedRequests = (token) => {
  failedRequests.forEach((prom) => prom.resolve(token));
  failedRequests = [];
};

api.interceptors.request.use(
  async (config) => {
    // Cookie-based: no Authorization header; cookies sent automatically
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // Attempt refresh using cookie-based endpoint
      try {
        await axios.post('http://localhost:3000/api/auth-service/user/refresh-token', null, { withCredentials: true });
        return api(error.config);
      } catch (e) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;