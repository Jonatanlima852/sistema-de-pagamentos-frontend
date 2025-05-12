import React, { createContext, useState, useCallback, useEffect } from 'react';
import { financesService } from '../services/finances';
import TagsService from '../services/tags';

export const FinancesContext = createContext({});

export const FinancesProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    categoryId: null,
    accountId: null,
    type: null,
    tags: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    hasMore: true,
  });

  // Carregamento inicial de dados essenciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega contas, categorias e tags em paralelo pois são independentes
        const [accountsData, categoriesData, tagsData] = await Promise.all([
          financesService.getAccounts(),
          financesService.getCategories(),
          TagsService.getTags(),
        ]);


        setAccounts(accountsData);
        setCategories(categoriesData);
        setTags(tagsData);

        // Carrega apenas a primeira página de transações
        await loadTransactions(true);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Accounts
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await financesService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (accountData) => {
    try {
      const newAccount = await financesService.createAccount(accountData);
      setAccounts(current => [...current, newAccount]);
      return newAccount;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  }, []);

  const updateAccount = useCallback(async (id, accountData) => {
    try {
      const updatedAccount = await financesService.updateAccount(id, accountData);
      setAccounts(current => 
        current.map(account => 
          account.id === id ? updatedAccount : account
        )
      );
      return updatedAccount;
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      throw error;
    }
  }, []);

  const deleteAccount = useCallback(async (id) => {
    try {
      await financesService.deleteAccount(id);
      setAccounts(current => 
        current.filter(account => account.id !== id)
      );
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  }, []);

  // Categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await financesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = await financesService.createCategory(categoryData);
      setCategories(current => [...current, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const updatedCategory = await financesService.updateCategory(id, categoryData);
      setCategories(current => 
        current.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      return updatedCategory;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await financesService.deleteCategory(id);
      setCategories(current => 
        current.filter(category => category.id !== id)
      );
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  }, []);

  // Tags
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TagsService.getTags();
      setTags(data);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTag = useCallback(async (name) => {
    try {
      const newTag = await TagsService.createTag(name);
      setTags(current => [...current, newTag]);
      return newTag;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  }, []);

  const updateTag = useCallback(async (id, name) => {
    try {
      const updatedTag = await TagsService.updateTag(id, name);
      setTags(current => 
        current.map(tag => 
          tag.id === id ? updatedTag : tag
        )
      );
      return updatedTag;
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      throw error;
    }
  }, []);

  const deleteTag = useCallback(async (id) => {
    try {
      await TagsService.deleteTag(id);
      setTags(current => 
        current.filter(tag => tag.id !== id)
      );
    } catch (error) {
      console.error('Erro ao deletar tag:', error);
      throw error;
    }
  }, []);

  const getTransactionsByTag = useCallback(async (tagId) => {
    try {
      return await TagsService.getTransactionsByTag(tagId);
    } catch (error) {
      console.error('Erro ao buscar transações por tag:', error);
      throw error;
    }
  }, []);

  // Transactions com paginação e filtros
  const loadTransactions = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setPagination(prev => ({ ...prev, page: 1, hasMore: true }));
      }

      if (!pagination.hasMore && !reset) return;

      setLoading(true);
      const params = {
        page: reset ? 1 : pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await financesService.getTransactions(params);
      
      // Garantir que temos um array de transações válido
      const transactionsData = Array.isArray(response) ? response : 
                             (response?.data?.transactions || response?.transactions || []);
      

      setTransactions(current => 
        reset ? transactionsData : [...current, ...transactionsData]
      );
      
      // Verifica se há mais páginas baseado no tamanho do array recebido
      const hasMore = Array.isArray(transactionsData) && 
                     transactionsData.length === pagination.limit;
      
      setPagination(prev => ({
        ...prev,
        page: reset ? 2 : prev.page + 1,
        hasMore,
      }));
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Em caso de erro, garantir que hasMore seja false para evitar loops
      setPagination(prev => ({ ...prev, hasMore: false }));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.hasMore, filters]);

  const addTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await financesService.createTransaction(transactionData);
      setTransactions(current => [newTransaction, ...current]);
      return newTransaction;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }, []);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const updatedTransaction = await financesService.updateTransaction(id, transactionData);
      setTransactions(current => 
        current.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      return updatedTransaction;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await financesService.deleteTransaction(id);
      setTransactions(current => 
        current.filter(transaction => transaction.id !== id)
      );
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    loadTransactions(true); // Recarrega com novos filtros
  }, [loadTransactions]);

  return (
    <FinancesContext.Provider
      value={{
        accounts,
        categories,
        transactions,
        tags,
        loading,
        filters,
        pagination,
        loadAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        loadCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        loadTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateFilters,
        loadTags,
        addTag,
        updateTag,
        deleteTag,
        getTransactionsByTag,
      }}
    >
      {children}
    </FinancesContext.Provider>
  );
}; 