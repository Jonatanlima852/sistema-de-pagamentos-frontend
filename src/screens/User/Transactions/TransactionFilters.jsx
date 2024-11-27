import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import TransactionTypeButtons from './TransactionTypeButtons';
import DateSelector from './DateSelector';

const TransactionFilters = ({ visible, onClose, filters, updateFilters }) => {
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [transactionType, setTransactionType] = useState(filters.transactionType || 'all');
  const [startDate, setStartDate] = useState(filters.startDate || null);
  const [endDate, setEndDate] = useState(filters.endDate || null);

  const handleApplyFilters = () => {
    updateFilters({
      ...filters,
      transactionType,
      startDate,
      endDate,
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

          {/* Alteração: Exibindo os nomes no SegmentedButtons */}
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
              <TransactionTypeButtons
                selectedType={transactionType}
                onTypeChange={setTransactionType}
              />

              <Text style={styles.sectionLabel}>Período</Text>

              {/* Substituímos os botões e o DateTimePicker pelo DateSelector */}
              <DateSelector
                startDate={startDate}
                endDate={endDate}
                onSelectDates={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onClear={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              />
            </View>
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
  modalButtons: {
    gap: 8,
    marginTop: 16,
  },
  applyButton: {
    marginBottom: 8,
    backgroundColor: '#6200ea',
  },
  clearButton: {
    marginBottom: 8,
  },
});

export default TransactionFilters;