import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Modal, Portal, Button, Searchbar, Chip } from 'react-native-paper';
import { colors } from '../../../theme';

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionInfo}>
      <Text variant="titleMedium">{item.description}</Text>
      <Text variant="bodyMedium" style={{ color: colors.textLight }}>{item.date}</Text>
    </View>
    <Text 
      variant="titleMedium" 
      style={{ color: item.type === 'income' ? colors.success : colors.error }}
    >
      R$ {item.amount}
    </Text>
  </View>
);

const Transactions = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const mockTransactions = [
    { id: 1, description: 'Salário', amount: '5000,00', type: 'income', date: '01/03/2024' },
    { id: 2, description: 'Aluguel', amount: '1500,00', type: 'expense', date: '05/03/2024' },
    // Adicione mais itens mock aqui
  ];

  return (
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

      <View style={styles.filterChips}>
        {selectedFilters.map((filter) => (
          <Chip 
            key={filter} 
            onClose={() => {/* Remove filter */}}
            style={styles.chip}
          >
            {filter}
          </Chip>
        ))}
      </View>

      <FlatList
        data={mockTransactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Filtros</Text>
          {/* Conteúdo do modal de filtros */}
        </Modal>
      </Portal>
    </View>
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
  filterChips: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  transactionInfo: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
  },
});

export default Transactions; 