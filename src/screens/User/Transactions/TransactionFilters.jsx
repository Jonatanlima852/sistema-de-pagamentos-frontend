import React, { useState } from 'react';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  console.log('categorias', categories);
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

  const handleCategorySelection = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const renderCategories = (type) => {
    const typeCategories = categories?.filter(cat => cat.type === type) || [];

    return (
      <View style={styles.categorySection}>
        <Text variant="titleMedium" style={styles.categoryTitle}>
          {type === 'INCOME' ? 'Receitas' : 'Despesas'}
        </Text>
        <View style={styles.categoriesGrid}>
          {typeCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category.id) && {
                  backgroundColor: type === 'INCOME' 
                    ? `${colors.success}20` 
                    : `${colors.error}20`,
                  borderColor: type === 'INCOME' ? colors.success : colors.error,
                }
              ]}
              onPress={() => handleCategorySelection(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(category.id) && {
                    color: type === 'INCOME' ? colors.success : colors.error,
                    fontWeight: '500'
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
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
});

export default TransactionFilters;