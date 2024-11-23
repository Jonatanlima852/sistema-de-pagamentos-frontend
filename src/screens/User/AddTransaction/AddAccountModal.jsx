import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Animated } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import PropTypes from 'prop-types';
import { currencyMask } from '../../../utils/masks';

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
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
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
            value={`R$ ${initialBalance}`}
            onChangeText={(text) => setInitialBalance(currencyMask(text))}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={themeColor}
            activeOutlineColor={themeColor}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: themeColor }]}
              loading={loading}
              disabled={loading}
            >
              Salvar
            </Button>

            <Button
              mode="outlined"
              onPress={onDismiss}
              style={[styles.button, styles.cancelButton]}
              textColor={colors.text}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

AddAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
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
    gap: 8,
    marginTop: 16,
  },
  button: {
    marginBottom: 8,
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