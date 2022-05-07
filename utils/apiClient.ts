import axios from 'axios';

export function apiClient() {
  const client = axios.create({
    baseURL: 'http://localhost:3001'
  });

  client.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return client;
}

export default apiClient();
