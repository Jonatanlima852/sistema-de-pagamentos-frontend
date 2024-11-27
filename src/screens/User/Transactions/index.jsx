import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import TransactionList from './TransactionList';
import TransactionFilters from './TransactionFilters';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    loadTransactions, 
    pagination, 
    filters, 
    updateFilters 
  } = useFinances();

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Aplicar filtro de busca
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(transaction => {
        const descriptionMatch = transaction.description?.toLowerCase().includes(searchLower);
        const categoryMatch = transaction.category?.name?.toLowerCase().includes(searchLower);
        const accountMatch = transaction.account?.name?.toLowerCase().includes(searchLower);
        const amountMatch = transaction.amount?.toString().includes(searchLower);
        return descriptionMatch || categoryMatch || accountMatch || amountMatch;
      });
    }

    // Aplicar filtro de tipo de transação
    if (filters.transactionType && filters.transactionType !== 'all') {
      filtered = filtered.filter(transaction => {
        if (filters.transactionType === 'income') {
          return transaction.type === 'INCOME';
        } else if (filters.transactionType === 'expense') {
          return transaction.type === 'EXPENSE';
        }
        return true;
      });
    }

    // Aplicar filtro de categorias
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.categories.includes(transaction.categoryId)
      );
    }

    // Aplicar filtro de data
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        if (startDate && endDate) {
          return transactionDate >= startDate && transactionDate <= endDate;
        } else if (startDate) {
          return transactionDate >= startDate;
        } else if (endDate) {
          return transactionDate <= endDate;
        }
        return true;
      });
    }

    return filtered;
  }, [transactions, searchQuery, filters]);

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      loadTransactions();
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Buscar transação"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <Button
            icon="filter-variant"
            onPress={() => setFilterVisible(true)}
            mode="contained-tonal"
          >
            Filtros
          </Button>
        </View>

        <TransactionList 
          transactions={filteredTransactions} 
          loading={loading} 
          handleLoadMore={handleLoadMore} 
        />

        <TransactionFilters
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={filters}
          updateFilters={updateFilters}
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
  },
});

export default Transactions;