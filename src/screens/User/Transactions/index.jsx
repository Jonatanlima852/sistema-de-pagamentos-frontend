import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, Button, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
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
  const [activeSubTab, setActiveSubTab] = useState('details'); // Estado para subabas
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [startDate, setStartDate] = useState(null); // Data de Início
  const [endDate, setEndDate] = useState(null); // Data Final
  const [showDatePicker, setShowDatePicker] = useState(null); // Gerencia qual seletor de data é exibido
  const [categories, setCategories] = useState([]); // Categorias selecionadas

  const mockTransactions = [
    { id: 1, description: 'Salário', amount: '5000,00', type: 'income', date: '01/03/2024' },
    { id: 2, description: 'Aluguel', amount: '1500,00', type: 'expense', date: '05/03/2024' },
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

              {/* ALTERAÇÃO FEITA: Adicionando Subabas */}
              <SegmentedButtons
                value={activeSubTab}
                onValueChange={setActiveSubTab}
                buttons={[
                  { value: 'details', label: 'Detalhes' },
                  { value: 'categories', label: 'Categorias' },
                ]}
                style={styles.segmentedButtons}
              />

              {/* Conteúdo da Subaba "Detalhes" */}
              {activeSubTab === 'details' && (
                <View>
                  {/* Data */}
                  <Text style={styles.sectionLabel}>Data</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker('start')}
                    style={styles.dateButton}
                  >
                    {startDate
                      ? `Início: ${startDate.toLocaleDateString()}`
                      : 'Selecionar Data de Início'}
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker('end')}
                    style={styles.dateButton}
                  >
                    {endDate
                      ? `Fim: ${endDate.toLocaleDateString()}`
                      : 'Selecionar Data Final'}
                  </Button>
                </View>
              )}

              {/* Conteúdo da Subaba "Categorias" */}
              {activeSubTab === 'categories' && (
                <View>
                  <Text style={styles.sectionLabel}>Categorias</Text>
                  {['Salário', 'Aluguel'].map((category) => (
                    <Chip
                      key={category}
                      selected={categories.includes(category)}
                      onPress={() => {
                        if (categories.includes(category)) {
                          setCategories(categories.filter((cat) => cat !== category));
                        } else {
                          setCategories([...categories, category]);
                        }
                      }}
                      style={[styles.chip, categories.includes(category) ? styles.selectedChip : styles.unselectedChip]}
                      textStyle={styles.chipText}
                    >
                      {category}
                    </Chip>
                  ))}
                </View>
              )}

              <Button 
                mode="contained"
                onPress={() => {
                  // Fechar o modal e aplicar os filtros
                  console.log('Filtros aplicados:', { startDate, endDate, categories });
                  setFilterVisible(false);
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
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: '#D1C4E9',
  },
  unselectedChip: {
    backgroundColor: '#EDE7F6',
  },
  chipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
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
    minHeight: '70%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
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