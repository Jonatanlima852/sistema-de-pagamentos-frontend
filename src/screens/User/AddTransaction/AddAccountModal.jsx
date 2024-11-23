import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, TextInput, Button } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';

const AddAccountModal = ({ visible, onDismiss, themeColor }) => {
  const { addAccount, loading } = useFinances();
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError('Nome da conta é obrigatório');
        return;
      }

      const accountData = {
        name: name.trim(),
        initialBalance: parseFloat(initialBalance.replace(',', '.')) || 0,
      };

      await addAccount(accountData);
      onDismiss();
      setName('');
      setInitialBalance('');
      setError('');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
      console.error('Erro ao criar conta:', err);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={styles.title}>Nova Conta</Text>
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TextInput
          label="Nome da Conta"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          outlineColor={themeColor}
          activeOutlineColor={themeColor}
        />

        <TextInput
          label="Saldo Inicial (opcional)"
          value={initialBalance}
          onChangeText={setInitialBalance}
          keyboardType="numeric"
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

export default AddAccountModal; 