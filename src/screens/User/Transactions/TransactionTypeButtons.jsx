import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const TransactionTypeButtons = ({ selectedType, onTypeChange }) => {
  const buttons = [
    { label: 'Todos', value: 'all' },
    { label: 'Despesa', value: 'expense' },
    { label: 'Receita', value: 'income' },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <Button
        key={button.value}
        mode={selectedType === button.value ? 'contained' : 'outlined'}
        onPress={() => {
            onTypeChange(button.value); // Atualiza o estado corretamente
        }}
        style={[
            styles.button,
            selectedType === button.value && styles.selectedButton, // Aplica estilo quando selecionado
        ]}
        labelStyle={[
            styles.buttonText,
            selectedType === button.value && styles.selectedButtonText,
        ]}
        >
        {button.label}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#6200ea', // Cor de fundo padrão para selecionado
  },
  buttonText: {
    color: '#000',
  },
  selectedButtonText: {
    color: '#fff', // Cor de texto quando selecionado
  },
});

export default TransactionTypeButtons;