import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Text, Button, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import TransactionItem from './TransactionItem';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    loadTransactions,
    categories,
    filters,
    updateFilters,
    pagination 
  } = useFinances();

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Carregar mais transações quando chegar ao fim da lista
  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      loadTransactions();
    }
  };

  // Função para lidar com a seleção de data
  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(null);
      return;
    }

    if (selectedDate) {
      if (showDatePicker === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
    setShowDatePicker(null);
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {
      ...filters,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      categoryIds: selectedCategories,
    };
    console.log('Filtros aplicados:', { startDate, endDate, categories });
    updateFilters(newFilters);
    setFilterVisible(false);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategories([]);
    updateFilters({
      startDate: null,
      endDate: null,
      categoryIds: [],
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <SafeScreen>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

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
              onClose={() => {
                setSelectedFilters(current => 
                  current.filter(f => f !== filter)
                );
              }}
              style={styles.chip}
            >
              {filter}
            </Chip>
          ))}
        </View>

        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem item={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Nenhuma transação encontrada</Text>
            </View>
          )}
          ListFooterComponent={() => (
            loading && transactions.length > 0 ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : null
          )}
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

              <SegmentedButtons
                value={activeSubTab}
                onValueChange={setActiveSubTab}
                buttons={[
                  { value: 'details', label: 'Detalhes' },
                  { value: 'categories', label: 'Categorias' },
                ]}
                style={styles.segmentedButtons}
              />

              {activeSubTab === 'details' && (
                <View>
                  <Text style={styles.sectionLabel}>Período</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker('start')}
                    style={styles.dateButton}
                  >
                    {startDate
                      ? `Início: ${startDate.toLocaleDateString('pt-BR')}`
                      : 'Selecionar Data Inicial'}
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker('end')}
                    style={styles.dateButton}
                  >
                    {endDate
                      ? `Fim: ${endDate.toLocaleDateString('pt-BR')}`
                      : 'Selecionar Data Final'}
                  </Button>
                </View>
              )}

              {activeSubTab === 'categories' && (
                <View>
                  <Text style={styles.sectionLabel}>Categorias</Text>
                  {categories.map((category) => (
                    <Chip
                      key={category.id}
                      selected={selectedCategories.includes(category.id)}
                      onPress={() => {
                        setSelectedCategories(current => 
                          current.includes(category.id)
                            ? current.filter(id => id !== category.id)
                            : [...current, category.id]
                        );
                      }}
                      style={[
                        styles.chip,
                        selectedCategories.includes(category.id) 
                          ? styles.selectedChip 
                          : styles.unselectedChip
                      ]}
                    >
                      {category.name}
                    </Chip>
                  ))}
                </View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={showDatePicker === 'start' ? (startDate || new Date()) : (endDate || new Date())}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={showDatePicker === 'start' ? endDate : new Date()}
                  minimumDate={showDatePicker === 'end' ? startDate : undefined}
                />
              )}

              <View style={styles.modalButtons}>
                <Button 
                  mode="contained"
                  onPress={handleApplyFilters}
                  style={styles.applyButton}
                >
                  Aplicar Filtros
                </Button>

                <Button 
                  mode="outlined"
                  onPress={handleClearFilters}
                  style={styles.clearButton}
                >
                  Limpar Filtros
                </Button>

                <Button 
                  mode="text"
                  onPress={() => setFilterVisible(false)}
                  style={styles.closeButton}
                >
                  Fechar
                </Button>
              </View>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loader: {
    padding: 16,
  },
  modalButtons: {
    gap: 8,
    marginTop: 16,
  },
  applyButton: {
    marginBottom: 8,
  },
  clearButton: {
    marginBottom: 8,
  },
  closeButton: {
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 8,
  },
});

export default Transactions;