import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    
    if (!error.response) {
      throw new Error('Network error - please check your connection');
    }

    const { status, data } = error.response;
    
    if (status === 404) {
      throw new Error(data?.error || 'Resource not found');
    }
    
    if (status === 500) {
      throw new Error(data?.error || 'Internal server error');
    }

    throw new Error(data?.error || `Request failed with status ${status}`);
  }
);

export default apiClient;