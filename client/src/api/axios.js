import axios from 'axios';

// Create the instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches your Node server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The backend middleware expects the header key to be 'token'
      config.headers['token'] = token; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling (Optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout if token is invalid/expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;