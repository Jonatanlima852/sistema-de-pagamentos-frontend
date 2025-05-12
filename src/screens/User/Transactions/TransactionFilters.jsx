import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, SegmentedButtons, Divider, Chip } from 'react-native-paper';
import TransactionTypeButtons from './TransactionTypeButtons';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TransactionFilters = ({ visible, onClose, filters, updateFilters }) => {
  const { categories, tags } = useFinances();
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [transactionType, setTransactionType] = useState(filters.transactionType || 'all');
  const [startDate, setStartDate] = useState(filters.startDate || new Date());
  const [endDate, setEndDate] = useState(filters.endDate || new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
  const [selectedTags, setSelectedTags] = useState(filters.tags || []);
  const insets = useSafeAreaInsets();
  
  // Referência para o Modalize
  const modalizeRef = useRef(null);
  
  // Abrir/fechar o modal baseado na prop visible
  useEffect(() => {
    if (visible && modalizeRef.current) {
      modalizeRef.current.open();
    } else if (!visible && modalizeRef.current) {
      modalizeRef.current.close();
    }
  }, [visible]);
  
  // Handle dismiss sem usar evento sintético diretamente
  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleApplyFilters = () => {
    updateFilters({
      ...filters,
      transactionType,
      startDate,
      endDate,
      categories: selectedCategories,
      tags: selectedTags,
    });
    handleDismiss();
  };

  const handleClearFilters = () => {
    setTransactionType('all');
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedCategories([]);
    setSelectedTags([]);
    updateFilters({
      transactionType: 'all',
      startDate: null,
      endDate: null,
      categories: [],
      tags: [],
    });
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
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

  const renderTags = () => {
    if (!tags || tags.length === 0) {
      return (
        <Text variant="bodyMedium" style={styles.noTagsText}>
          Nenhuma tag disponível
        </Text>
      );
    }
    
    return (
      <View style={styles.tagsContainer}>
        <Text variant="titleMedium" style={styles.tagsTitle}>
          Tags
        </Text>
        <View style={styles.chipContainer}>
          {tags.map(tag => (
            <Chip
              key={tag.id}
              selected={selectedTags.includes(tag.id)}
              onPress={() => toggleTag(tag.id)}
              style={[
                styles.tagChip,
                selectedTags.includes(tag.id) && {
                  backgroundColor: `${colors.primary}20`
                }
              ]}
              textStyle={{
                color: selectedTags.includes(tag.id)
                  ? colors.primary
                  : colors.text
              }}
            >
              {tag.name}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const modalHeight = Dimensions.get('window').height * 0.85;

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalHeight={modalHeight}
        threshold={100}
        velocity={840}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
        withHandle={true}
        handlePosition="outside"
        onClose={handleDismiss}
        handleStyle={{ backgroundColor: colors.primary, width: 50, height: 5, marginTop: 30 }}
        modalStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        adjustToContentHeight={false}
        HeaderComponent={
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={styles.modalTitle}>Filtros de Transações</Text>
            <Button 
              mode="text" 
              onPress={handleClearFilters}
              textColor={colors.error}
              style={styles.clearButton}
            >
              Limpar
            </Button>
          </View>
        }
        FooterComponent={
          <View style={[styles.modalButtons, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
            <Button 
              mode="contained" 
              onPress={handleApplyFilters} 
              style={styles.applyButton}
            >
              Aplicar Filtros
            </Button>
          </View>
        }
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <SegmentedButtons
            value={activeSubTab}
            onValueChange={(value) => {
              setActiveSubTab(value);
            }}
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
              { 
                value: 'tags', 
                label: 'Tags',
                icon: 'tag-outline'
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
                onTypeChange={(type) => {
                  setTransactionType(type);
                }}
              />

              <Text variant="titleMedium" style={[styles.sectionLabel, styles.dateLabel]}>
                Período
              </Text>
              
              <CustomDatePicker
                label="Data Inicial"
                date={startDate}
                showPicker={showStartDatePicker}
                onPress={() => {
                  setShowStartDatePicker(true);
                }}
                onDateChange={(event, selectedDate) => {
                  if (event && event.persist) {
                    event.persist();
                  }
                  
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
                onPress={() => {
                  setShowEndDatePicker(true);
                }}
                onDateChange={(event, selectedDate) => {
                  if (event && event.persist) {
                    event.persist();
                  }
                  
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

          {activeSubTab === 'tags' && (
            <View style={styles.filterSection}>
              {renderTags()}
            </View>
          )}

          {activeSubTab === 'categories' && selectedCategories.length > 0 && (
            <View style={styles.selectedCategoriesInfo}>
              <Text variant="bodyMedium" style={styles.selectedCount}>
                Categorias selecionadas: {selectedCategories.length}
              </Text>
              <Text variant="bodySmall" style={styles.selectedCategoriesNames}>
                {categories
                  .filter(cat => selectedCategories.includes(cat.id))
                  .map(cat => cat.name)
                  .join(', ')}
              </Text>
            </View>
          )}

          {activeSubTab === 'tags' && selectedTags.length > 0 && (
            <View style={styles.selectedTagsInfo}>
              <Text variant="bodyMedium" style={styles.selectedCount}>
                Tags selecionadas: {selectedTags.length}
              </Text>
              <Text variant="bodySmall" style={styles.selectedTagsNames}>
                {tags
                  .filter(tag => selectedTags.includes(tag.id))
                  .map(tag => tag.name)
                  .join(', ')}
              </Text>
            </View>
          )}
        </ScrollView>
      </Modalize>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    marginTop: 24,
    fontWeight: 'bold',
    fontSize: 22,
  },
  clearButton: {
    marginRight: -8,
  },
  segmentedButtons: {
    marginVertical: 20,
  },
  filterSection: {
    paddingBottom: 24,
  },
  sectionLabel: {
    marginBottom: 16,
    fontWeight: '600',
    fontSize: 18,
  },
  dateLabel: {
    marginTop: 30,
  },
  modalButtons: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 20,
  },
  applyButton: {
    marginBottom: 0,
    borderRadius: 12,
    paddingVertical: 6,
    height: 54,
  },
  categoriesContainer: {
    marginBottom: 28,
  },
  categoryTypeTitle: {
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 18,
  },
  tagsContainer: {
    marginBottom: 28,
  },
  tagsTitle: {
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 18,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  selectedCategoriesInfo: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  selectedTagsInfo: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  selectedCount: {
    fontWeight: '600',
  },
  selectedCategoriesNames: {
    marginTop: 6,
    color: colors.placeholder,
    lineHeight: 20,
  },
  selectedTagsNames: {
    marginTop: 6,
    color: colors.placeholder,
    lineHeight: 20,
  },
  noTagsText: {
    color: colors.placeholder,
    marginTop: 8,
    marginBottom: 16,
    fontStyle: 'italic',
  },
});

export default TransactionFilters;