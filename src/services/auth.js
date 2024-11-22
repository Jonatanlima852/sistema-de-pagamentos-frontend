import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Se estiver no Expo Go
  if (Constants.appOwnership === 'expo') {
    return REACT_APP_API_URL;
  }
  return REACT_APP_API_URL || 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Para debug
console.log('API URL:', getBaseUrl());

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
    console.log(process.env.REACT_APP_API_URL)
    const response = await api.post('/api/login', credentials);
    setAuthToken(response.data.token);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/api/me');
    return response.data;
  },
};