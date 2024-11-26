import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Animated, Platform, Pressable, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import PropTypes from 'prop-types';
import { currencyMask } from '../../../utils/masks';
import { Picker } from '@react-native-picker/picker';


const accountTypes = [
  { id: "SAVING", name: 'Poupança' },
  { id: "CREDIT_CARD", name: 'Cartão de Crédito' },
  { id: "DEBIT_CARD", name: 'Cartão de Débito' },
  { id: "CASH", name: 'Dinheiro' },
  { id: "INVESTMENT", name: 'Investimentos' },
  { id: "BUSINESS_CARD", name: 'Cartão da empresa' },
  { id: "OTHER", name: 'Outro' },
];

const AddAccountModal = ({ visible, onDismiss, themeColor }) => {
  const { addAccount, loading } = useFinances();
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('');
  const [showAccountTypePicker, setShowAccountTypePicker] = useState(false);


  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError('Nome da conta é obrigatório');
        return;
      }

      if (!accountType) {
        setError('Tipo de conta é obrigatório');
        return;
      }

      const accountData = {
        name: name.trim(),
        type: accountType,
        balance: parseFloat(initialBalance.replace(',', '.')) || 0,
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

  const renderAccountTypeSelector = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Tipo de Conta</Text>
          <Pressable
            onPress={() => setShowAccountTypePicker(true)}
            style={[
              styles.pickerButton,
              { borderColor: themeColor }
            ]}
          >
            <Text style={[styles.pickerButtonText, { color: accountType ? colors.text : colors.placeholder }]}>
              {accountType ? accountTypes.find(type => type.id === accountType)?.name : 'Selecione um tipo de conta'}
            </Text>
          </Pressable>

          <Modal
            visible={showAccountTypePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.iosPickerModal}>
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <Button
                    onPress={() => setShowAccountTypePicker(false)}
                    textColor={themeColor}
                  >
                    Fechar
                  </Button>
                </View>
                {accountTypes.map((type) => (
                  <List.Item
                    key={type.id}
                    title={type.name}
                    onPress={() => {
                      setAccountType(type.id);
                      setShowAccountTypePicker(false);
                    }}
                    style={[
                      styles.iosPickerItem,
                      accountType === type.id && styles.iosPickerItemSelected
                    ]}
                    titleStyle={[
                      styles.iosPickerItemText,
                      accountType === type.id && { color: themeColor }
                    ]}
                    right={props => 
                      accountType === type.id && 
                      <List.Icon {...props} icon="check" color={themeColor} />
                    }
                  />
                ))}
              </View>
            </View>
          </Modal>
        </View>
      );
    }

    return (
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Tipo de Conta</Text>
        <View style={[
          styles.pickerContainer,
          { borderColor: themeColor }
        ]}>
          <Picker
            selectedValue={accountType}
            onValueChange={setAccountType}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor={themeColor}
          >
            <Picker.Item
              enabled={false}
              label="Selecione um tipo de conta"
              value=""
              color={colors.placeholder}
            />
            {accountTypes.map((type) => (
              <Picker.Item
                key={type.id}
                label={type.name}
                value={type.id}
                color={themeColor}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
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

            {renderAccountTypeSelector()}

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
      </KeyboardAvoidingView>
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
  pickerWrapper: {
    marginTop: 0,
    marginBottom: 18,
  },
  pickerLabel: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
    height: 54,
  },
  picker: {
    width: '100%',
    height: 54,
    color: colors.text,
    marginLeft: -8,
  },
  pickerButton: {
    borderWidth: 2,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  iosPickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosPickerContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  iosPickerItem: {
    paddingVertical: 12,
  },
  iosPickerItemSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  iosPickerItemText: {
    fontSize: 16,
  },
});

export default AddAccountModal; 