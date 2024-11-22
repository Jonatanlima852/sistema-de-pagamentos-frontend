import { api } from './api';

export const financesService = {
  // Contas
  async createAccount(accountData) {
    const response = await api.post('/api/accounts', accountData);
    return response.data;
  },

  async getAccounts() {
    const response = await api.get('/api/accounts');
    return response.data;
  },

  async getAccount(id) {
    const response = await api.get(`/api/accounts/${id}`);
    return response.data;
  },

  async updateAccount(id, accountData) {
    const response = await api.put(`/api/accounts/${id}`, accountData);
    return response.data;
  },

  async deleteAccount(id) {
    await api.delete(`/api/accounts/${id}`);
  },

  // Categorias
  async createCategory(categoryData) {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/api/categories');
    return response.data;
  },

  async getCategory(id) {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    await api.delete(`/api/categories/${id}`);
  },

  // Transações
  async createTransaction(transactionData) {
    const response = await api.post('/api/transactions', transactionData);
    return response.data;
  },

  async getTransactions() {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  async getTransaction(id) {
    const response = await api.get(`/api/transactions/${id}`);
    return response.data;
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(`/api/transactions/${id}`, transactionData);
    return response.data;
  },

  async deleteTransaction(id) {
    await api.delete(`/api/transactions/${id}`);
  },
}; 