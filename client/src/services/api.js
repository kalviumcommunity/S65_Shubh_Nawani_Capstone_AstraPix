import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  // Ensure HTTPS for production
  if (import.meta.env.PROD) {
    config.url = config.url.replace('http://', 'https://');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_CERT_AUTHORITY_INVALID') {
      console.error('Certificate Error. Retrying with HTTPS...');
      const retryConfig = {
        ...error.config,
        url: error.config.url.replace('http://', 'https://')
      };
      return axios(retryConfig);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
