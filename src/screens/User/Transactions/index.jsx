import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, Button, Searchbar, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [startDate, setStartDate] = useState(null); // Data de Início
  const [endDate, setEndDate] = useState(null); // Data Final
  const [showDatePicker, setShowDatePicker] = useState(null); // Gerencia qual seletor de data é exibido

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

        {/* Modal de Filtros */}
        <Modal
          visible={filterVisible}
          onRequestClose={() => setFilterVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="titleLarge" style={styles.modalTitle}>Filtros</Text>

              {/* Botão para abrir o seletor de Data de Início */}
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker('start')}
                style={styles.dateButton}
              >
                {startDate
                  ? `Início: ${startDate.toLocaleDateString()}`
                  : 'Selecionar Data de Início'}
              </Button>

              {/* Botão para abrir o seletor de Data Final */}
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker('end')}
                style={styles.dateButton}
              >
                {endDate
                  ? `Fim: ${endDate.toLocaleDateString()}`
                  : 'Selecionar Data Final'}
              </Button>

              {/* Exibe o DateTimePicker */}
              {showDatePicker && (
                <DateTimePicker
                  value={
                    showDatePicker === 'start'
                      ? startDate || new Date()
                      : endDate || new Date()
                  }
                  mode="date"
                  display="calendar"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      if (showDatePicker === 'start') setStartDate(selectedDate);
                      if (showDatePicker === 'end') setEndDate(selectedDate);
                    }
                    setShowDatePicker(null); // Fecha o seletor
                  }}
                />
              )}

              <Button 
                mode="contained"
                onPress={() => {
                  // Fechar o modal e aplicar os filtros (implementação futura)
                  setFilterVisible(false);
                  console.log('Filtro aplicado:', { startDate, endDate });
                }}
                style={styles.applyButton}
              >
                Aplicar
              </Button>

              <Button 
                mode="outlined"
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
    minHeight: '90%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  closeButton: {
    marginBottom: 16,
  },
});

export default Transactions;