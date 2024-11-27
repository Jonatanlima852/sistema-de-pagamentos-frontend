import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import TransactionTypeButtons from './TransactionTypeButtons';
import DateTimePicker from '@react-native-community/datetimepicker';

const TransactionFilters = ({ visible, onClose, filters, updateFilters }) => {
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [transactionType, setTransactionType] = useState(filters.transactionType || 'all');
  const [startDate, setStartDate] = useState(filters.startDate || null);
  const [endDate, setEndDate] = useState(filters.endDate || null);
  const [showDatePicker, setShowDatePicker] = useState(null);

  const handleApplyFilters = () => {
    updateFilters({
      ...filters,
      transactionType,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text variant="titleLarge" style={styles.modalTitle}>Filtros</Text>

          <SegmentedButtons
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            buttons={[
              { value: 'details', label: '', icon: 'filter-outline' },
              { value: 'categories', label: '', icon: 'tag-outline' },
            ]}
            style={styles.segmentedButtons}
          />

          {activeSubTab === 'details' && (
            <View>
              <TransactionTypeButtons
                selectedType={transactionType}
                onTypeChange={setTransactionType}
              />

              <Text style={styles.sectionLabel}>Período</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker('start')}
                style={styles.dateButton}
              >
                {startDate
                  ? `Início: ${new Date(startDate).toLocaleDateString('pt-BR')}`
                  : 'Selecionar Data Inicial'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker('end')}
                style={styles.dateButton}
              >
                {endDate
                  ? `Fim: ${new Date(endDate).toLocaleDateString('pt-BR')}`
                  : 'Selecionar Data Final'}
              </Button>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={showDatePicker === 'start' ? (startDate || new Date()) : (endDate || new Date())}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (showDatePicker === 'start') {
                  setStartDate(selectedDate);
                } else {
                  setEndDate(selectedDate);
                }
                setShowDatePicker(null);
              }}
              maximumDate={showDatePicker === 'start' ? endDate : new Date()}
              minimumDate={showDatePicker === 'end' ? startDate : undefined}
            />
          )}

          <View style={styles.modalButtons}>
            <Button mode="contained" onPress={handleApplyFilters} style={styles.applyButton}>
              Aplicar Filtros
            </Button>
            <Button mode="outlined" onPress={onClose} style={styles.clearButton}>
              Fechar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});

export default TransactionFilters;