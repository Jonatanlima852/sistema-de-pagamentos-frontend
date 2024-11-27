import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../../../theme';

const TransactionTypeButtons = ({ selectedType, onTypeChange }) => {
  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={() => onTypeChange('all')}
        style={[
          styles.button,
          {
            backgroundColor: selectedType === 'all' ? `${colors.primary}15` : 'transparent',
            borderColor: selectedType === 'all' ? colors.primary : colors.border,
          }
        ]}
        textColor={colors.primary}
      >
        Todos
      </Button>
      <Button
        mode="outlined"
        onPress={() => onTypeChange('income')}
        style={[
          styles.button,
          {
            backgroundColor: selectedType === 'income' ? `${colors.success}15` : 'transparent',
            borderColor: selectedType === 'income' ? colors.success : colors.border,
          }
        ]}
        textColor={colors.success}
      >
        Receitas
      </Button>
      <Button
        mode="outlined"
        onPress={() => onTypeChange('expense')}
        style={[
          styles.button,
          {
            backgroundColor: selectedType === 'expense' ? `${colors.error}15` : 'transparent',
            borderColor: selectedType === 'expense' ? colors.error : colors.border,
          }
        ]}
        textColor={colors.error}
      >
        Despesas
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
  },
});

export default TransactionTypeButtons;