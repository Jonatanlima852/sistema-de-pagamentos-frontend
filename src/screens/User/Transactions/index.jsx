import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, Button, Searchbar, Chip } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';

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

        <Modal
          visible={filterVisible}
          onRequestClose={() => setFilterVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleLarge" style={styles.modalTitle}>Filtros</Text>
              {/* Conteúdo do modal de filtros */}
              <Button 
                mode="contained"
                onPress={() => setFilterVisible(false)}
                style={styles.closeButton}
              >
                Fechar
              </Button>
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default Transactions; 