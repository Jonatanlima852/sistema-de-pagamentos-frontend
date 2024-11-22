import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authService = {
  async register(userData) {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/login', credentials);
    setAuthToken(response.data.token);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/api/me');
    return response.data;
  },
};