import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
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
          transactions={transactions} 
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