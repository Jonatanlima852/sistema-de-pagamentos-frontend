import React, { useState } from 'react';
import { View, Modal, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, SegmentedButtons, Divider, Portal, Chip } from 'react-native-paper';
import TransactionTypeButtons from './TransactionTypeButtons';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';

const TransactionFilters = ({ visible, onClose, filters, updateFilters }) => {
  const { categories } = useFinances();
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [transactionType, setTransactionType] = useState(filters.transactionType || 'all');
  const [startDate, setStartDate] = useState(filters.startDate || new Date());
  const [endDate, setEndDate] = useState(filters.endDate || new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);

  const handleApplyFilters = () => {
    updateFilters({
      ...filters,
      transactionType,
      startDate,
      endDate,
      categories: selectedCategories,
    });
    onClose();
  };

  const handleClearFilters = () => {
    setTransactionType('all');
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedCategories([]);
    updateFilters({
      transactionType: 'all',
      startDate: null,
      endDate: null,
      categories: [],
    });
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategories = (type) => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    
    return (
      <View style={styles.categoriesContainer}>
        <Text variant="titleMedium" style={styles.categoryTypeTitle}>
          {type === 'INCOME' ? 'Receitas' : 'Despesas'}
        </Text>
        <View style={styles.chipContainer}>
          {filteredCategories.map(category => (
            <Chip
              key={category.id}
              selected={selectedCategories.includes(category.id)}
              onPress={() => toggleCategory(category.id)}
              style={[
                styles.categoryChip,
                selectedCategories.includes(category.id) && {
                  backgroundColor: type === 'INCOME' ? `${colors.success}20` : `${colors.error}20`
                }
              ]}
              textStyle={{
                color: selectedCategories.includes(category.id)
                  ? (type === 'INCOME' ? colors.success : colors.error)
                  : colors.text
              }}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" style={styles.modalTitle}>Filtros</Text>
              <Button 
                mode="text" 
                onPress={handleClearFilters}
                textColor={colors.error}
              >
                Limpar
              </Button>
            </View>

            <Divider style={styles.divider} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <SegmentedButtons
                value={activeSubTab}
                onValueChange={setActiveSubTab}
                buttons={[
                  { 
                    value: 'details', 
                    label: 'Detalhes',
                    icon: 'text-box-outline'
                  },
                  { 
                    value: 'categories', 
                    label: 'Categorias',
                    icon: 'shape-outline'
                  },
                ]}
                style={styles.segmentedButtons}
              />

              {activeSubTab === 'details' && (
                <View style={styles.filterSection}>
                  <Text variant="titleMedium" style={styles.sectionLabel}>
                    Tipo de Transação
                  </Text>
                  <TransactionTypeButtons
                    selectedType={transactionType}
                    onTypeChange={setTransactionType}
                  />

                  <Text variant="titleMedium" style={[styles.sectionLabel, styles.dateLabel]}>
                    Período
                  </Text>
                  
                  <CustomDatePicker
                    label="Data Inicial"
                    date={startDate}
                    showPicker={showStartDatePicker}
                    onPress={() => setShowStartDatePicker(true)}
                    onDateChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        setStartDate(selectedDate);
                      }
                    }}
                    themeColor={colors.primary}
                    maximumDate={endDate}
                  />

                  <CustomDatePicker
                    label="Data Final"
                    date={endDate}
                    showPicker={showEndDatePicker}
                    onPress={() => setShowEndDatePicker(true)}
                    onDateChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        setEndDate(selectedDate);
                      }
                    }}
                    themeColor={colors.primary}
                    maximumDate={new Date()}
                  />
                </View>
              )}

              {activeSubTab === 'categories' && (
                <View style={styles.filterSection}>
                  {renderCategories('INCOME')}
                  {renderCategories('EXPENSE')}
                </View>
              )}
            </ScrollView>

            <Divider style={styles.divider} />

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
                onPress={onClose} 
                style={styles.closeButton}
              >
                Fechar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  segmentedButtons: {
    margin: 16,
  },
  filterSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  dateLabel: {
    marginTop: 24,
  },
  modalButtons: {
    padding: 16,
    gap: 8,
  },
  applyButton: {
    marginBottom: 8,
  },
  closeButton: {
    borderColor: colors.border,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    marginBottom: 12,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryTypeTitle: {
    marginBottom: 12,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
});

export default TransactionFilters;