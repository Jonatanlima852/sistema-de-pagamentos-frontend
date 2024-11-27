import { api, setAuthToken } from './api';

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

  update: async (userData) => {
    try {
      const response = await api.put('/users', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async () => {
    try {
      await api.delete('/users');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export { setAuthToken };