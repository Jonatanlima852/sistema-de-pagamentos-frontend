import { api } from './api';

export const TagsService = {
  createTag: async (name) => {
    try {
      const response = await api.post('/api/tags', { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTags: async () => {
    try {
      const response = await api.get('/api/tags');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTag: async (id) => {
    try {
      const response = await api.get(`/api/tags/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTag: async (id, name) => {
    try {
      const response = await api.put(`/api/tags/${id}`, { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      await api.delete(`/api/tags/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  getTransactionsByTag: async (id) => {
    try {
      const response = await api.get(`/api/tags/${id}/transactions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default TagsService; 