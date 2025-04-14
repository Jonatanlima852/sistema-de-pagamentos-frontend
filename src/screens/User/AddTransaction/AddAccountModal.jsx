import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable, 
  Platform, 
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { colors } from '../../../theme';
import { useFinances } from '../../../hooks/useFinances';
import PropTypes from 'prop-types';
import { currencyMask } from '../../../utils/masks';
import { Picker } from '@react-native-picker/picker';
import { Portal } from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Definição estática fora do componente para evitar recriações
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
  const insets = useSafeAreaInsets();
  
  // Referências para modais
  const modalizeRef = useRef(null);
  const pickerModalizeRef = useRef(null);
  
  // Abrir/fechar o modal baseado na prop visible
  useEffect(() => {
    if (visible && modalizeRef.current) {
      modalizeRef.current.open();
    } else if (!visible && modalizeRef.current) {
      modalizeRef.current.close();
    }
  }, [visible]);

  // Gerenciadores de eventos memorizados para evitar recriações
  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const handleNameChange = useCallback((text) => {
    setName(text);
  }, []);

  const handleBalanceChange = useCallback((text) => {
    setInitialBalance(currencyMask(text));
  }, []);

  const handleAccountTypeChange = useCallback((value) => {
    setAccountType(value);
  }, []);

  const handleShowTypePicker = useCallback(() => {
    setShowAccountTypePicker(true);
  }, []);

  const handleHideTypePicker = useCallback(() => {
    setShowAccountTypePicker(false);
  }, []);

  const handleSubmit = useCallback(async () => {
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
        balance: parseFloat(initialBalance.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      };

      await addAccount(accountData);
      setName('');
      setInitialBalance('');
      setAccountType('');
      setError('');
      handleDismiss();
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
      console.error('Erro ao criar conta:', err);
    }
  }, [name, accountType, initialBalance, addAccount, handleDismiss]);

  // Valores memoizados para evitar recálculos
  const modalHeight = useMemo(() => 
    Math.min(Dimensions.get('window').height * 0.85, 600), 
  []);

  const accountTypeDisplayText = useMemo(() => 
    accountType 
      ? accountTypes.find(type => type.id === accountType)?.name 
      : 'Selecione um tipo de conta',
  [accountType]);

  // Componentes memoizados para evitar recriações
  const pickerModalHeader = useMemo(() => (
    <View style={styles.pickerModalHeader}>
      <Text style={styles.pickerModalTitle}>Selecione o tipo de conta</Text>
    </View>
  ), []);

  const renderAccountTypeSelector = useCallback(() => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Tipo de Conta</Text>
          <Pressable
            onPress={handleShowTypePicker}
            style={[
              styles.pickerButton,
              { borderColor: themeColor }
            ]}
          >
            <Text 
              style={[
                styles.pickerButtonText, 
                { color: accountType ? colors.text : colors.placeholder }
              ]}
            >
              {accountTypeDisplayText}
            </Text>
          </Pressable>

          <Portal>
            <Modalize
              ref={pickerModalizeRef}
              adjustToContentHeight
              visible={showAccountTypePicker}
              onClose={handleHideTypePicker}
              modalStyle={styles.pickerModalContent}
              handleStyle={{ backgroundColor: themeColor, width: 50, height: 5 }}
              handlePosition="outside"
              disableScrollIfPossible
              HeaderComponent={pickerModalHeader}
            >
              <View style={styles.pickerModalScroll}>
                {accountTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.pickerModalItem,
                      accountType === type.id && [
                        styles.pickerModalItemSelected,
                        { backgroundColor: `${themeColor}15` }
                      ]
                    ]}
                    onPress={() => {
                      handleAccountTypeChange(type.id);
                      handleHideTypePicker();
                    }}
                  >
                    <Text style={[
                      styles.pickerModalItemText,
                      accountType === type.id && { color: themeColor }
                    ]}>
                      {type.name}
                    </Text>
                    {accountType === type.id && (
                      <View style={[styles.pickerModalItemCheck, { backgroundColor: themeColor }]}>
                        <Text style={styles.pickerModalItemCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Modalize>
          </Portal>
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
            onValueChange={handleAccountTypeChange}
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
                color={colors.text}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }, [accountType, themeColor, accountTypeDisplayText, showAccountTypePicker, handleShowTypePicker, handleHideTypePicker, handleAccountTypeChange, pickerModalHeader]);

  // Título memoizado
  const headerComponent = useMemo(() => (
    <Text variant="titleLarge" style={styles.title}>Nova Conta</Text>
  ), []);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalHeight={500}
        threshold={100}
        velocity={840}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
        withHandle={true}
        handlePosition="outside"
        onClose={handleDismiss}
        handleStyle={{ backgroundColor: themeColor, width: 50, height: 5, marginTop: 30 }}
        modalStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        adjustToContentHeight={false}
        disableScrollIfPossible
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent, 
              { paddingBottom: insets.bottom + 20 }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {headerComponent}

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TextInput
              label="Nome da Conta"
              value={name}
              onChangeText={handleNameChange}
              mode="outlined"
              style={styles.input}
              outlineColor={themeColor}
              activeOutlineColor={themeColor}
            />

            {renderAccountTypeSelector()}

            <TextInput
              label="Saldo Inicial (opcional)"
              value={`R$ ${initialBalance}`}
              onChangeText={handleBalanceChange}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={themeColor}
              activeOutlineColor={themeColor}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[
                  styles.saveButton,
                  { backgroundColor: themeColor }
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    Salvar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modalize>
    </Portal>
  );
};

AddAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  themeColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 24,
  },
  title: {
    marginBottom: 24,
    marginTop: 24,
    textAlign: 'center',
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 24,
  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.background,
    height: 56,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 32,
  },
  saveButton: {
    borderRadius: 12,
    padding: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 15,
  },
  pickerWrapper: {
    marginTop: 0,
    marginBottom: 24,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.7,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
    height: 56,
  },
  picker: {
    width: '100%',
    height: 56,
    color: colors.text,
    marginLeft: -8,
  },
  pickerButton: {
    borderWidth: 2,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pickerModalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
    alignItems: 'center',
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerModalScroll: {
    maxHeight: 300,
    paddingBottom: 16,
  },
  pickerModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline + '30',
  },
  pickerModalItemSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  pickerModalItemText: {
    fontSize: 16,
  },
  pickerModalItemCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModalItemCheckText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AddAccountModal; 