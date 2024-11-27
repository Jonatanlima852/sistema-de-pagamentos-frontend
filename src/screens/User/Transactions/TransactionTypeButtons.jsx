import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const TransactionTypeButtons = ({ selectedType, onTypeChange }) => {
  return (
    <View style={styles.transactionTypeButtons}>
      <Button
        mode={selectedType === 'all' ? 'contained' : 'outlined'}
        onPress={() => onTypeChange('all')}
        style={[styles.typeButton, selectedType === 'all' && styles.activeButton]}
      >
        Todos
      </Button>
      <Button
        mode={selectedType === 'expense' ? 'contained' : 'outlined'}
        onPress={() => onTypeChange('expense')}
        style={[styles.typeButton, selectedType === 'expense' && styles.activeButton]}
      >
        Despesa
      </Button>
      <Button
        mode={selectedType === 'income' ? 'contained' : 'outlined'}
        onPress={() => onTypeChange('income')}
        style={[styles.typeButton, selectedType === 'income' && styles.activeButton]}
      >
        Receita
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: '#6200ea',
  },
});

export default TransactionTypeButtons;