import React, { createContext, useState, useCallback, useEffect } from 'react';
import { financesService } from '../services/finances';

export const FinancesContext = createContext({});

export const FinancesProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    categoryId: null,
    accountId: null,
    type: null,
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
        // Carrega contas e categorias em paralelo pois são independentes
        const [accountsData, categoriesData] = await Promise.all([
          financesService.getAccounts(),
          financesService.getCategories(),
        ]);

        setAccounts(accountsData);
        setCategories(categoriesData);

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

      const data = await financesService.getTransactions(params);
      
      setTransactions(current => 
        reset ? data.transactions : [...current, ...data.transactions]
      );
      
      setPagination(prev => ({
        ...prev,
        page: reset ? 2 : prev.page + 1,
        hasMore: data.transactions.length === pagination.limit,
      }));
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
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
        loading,
        filters,
        pagination,
        loadAccounts,
        addAccount,
        loadCategories,
        addCategory,
        loadTransactions,
        addTransaction,
        updateFilters,
      }}
    >
      {children}
    </FinancesContext.Provider>
  );
}; 