import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../../theme';

const TransactionTypeButtons = ({ selectedType, onTypeChange }) => {
  const getButtonStyle = (type) => {
    switch(type) {
      case 'all':
        return {
          button: [
            styles.button,
            selectedType === 'all' && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }
          ],
          text: [
            styles.buttonText,
            { color: selectedType === 'all' ? 'white' : colors.primary }
          ]
        };
      case 'income':
        return {
          button: [
            styles.button,
            selectedType === 'income' && {
              backgroundColor: colors.success,
              borderColor: colors.success,
            }
          ],
          text: [
            styles.buttonText,
            { color: selectedType === 'income' ? 'white' : colors.success }
          ]
        };
      case 'expense':
        return {
          button: [
            styles.button,
            selectedType === 'expense' && {
              backgroundColor: colors.error,
              borderColor: colors.error,
            }
          ],
          text: [
            styles.buttonText,
            { color: selectedType === 'expense' ? 'white' : colors.error }
          ]
        };
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onTypeChange('all')}
        style={getButtonStyle('all').button}
        activeOpacity={0.7}
      >
        <Text style={getButtonStyle('all').text}>Todos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTypeChange('income')}
        style={getButtonStyle('income').button}
        activeOpacity={0.7}
      >
        <Text style={getButtonStyle('income').text}>Receitas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTypeChange('expense')}
        style={getButtonStyle('expense').button}
        activeOpacity={0.7}
      >
        <Text style={getButtonStyle('expense').text}>Despesas</Text>
      </TouchableOpacity>
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
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TransactionTypeButtons;