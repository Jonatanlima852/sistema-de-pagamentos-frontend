import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';

const AddCategoryModal = ({ visible, onDismiss, themeColor, initialType }) => {
  const { addCategory, loading } = useFinances();
  const [name, setName] = useState('');
  const [type, setType] = useState(initialType);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError('Nome da categoria é obrigatório');
        return;
      }

      const categoryData = {
        name: name.trim(),
        type,
      };

      await addCategory(categoryData);
      onDismiss();
      setName('');
      setError('');
    } catch (err) {
      setError('Erro ao criar categoria. Tente novamente.');
      console.error('Erro ao criar categoria:', err);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.title}>Nova Categoria</Text>
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            {
              value: 'EXPENSE',
              label: 'Despesa',
              style: {
                borderColor: type === 'EXPENSE' ? colors.expense : '#999',
                borderWidth: type === 'EXPENSE' ? 2 : 1,
              },
            },
            {
              value: 'INCOME',
              label: 'Receita',
              style: {
                borderColor: type === 'INCOME' ? colors.income : '#999',
                borderWidth: type === 'INCOME' ? 2 : 1,
              },
            },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Nome da Categoria"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          outlineColor={themeColor}
          activeOutlineColor={themeColor}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={[styles.button, styles.cancelButton]}
            textColor={colors.text}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, { backgroundColor: themeColor }]}
            loading={loading}
            disabled={loading}
          >
            Salvar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.background,
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddCategoryModal; 