import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Animated } from 'react-native';
import { Text, TextInput, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { currencyMask } from '../../../utils/masks';
import Toast from 'react-native-toast-message';
import AddAccountModal from './AddAccountModal';
import AddCategoryModal from './AddCategoryModal';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomPicker from '../../../components/CustomPicker';

const AddTransaction = () => {
  const { loading, error, categories = [], accounts = [], addTransaction } = useFinances();
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [themeColor, setThemeColor] = useState(colors.expense);
  const [showSuccessAnimation] = useState(new Animated.Value(0));
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);


  useEffect(() => {
    setThemeColor(transactionType === 'EXPENSE' ? colors.expense : colors.income);
  }, [transactionType]);

  // Filtra categorias por tipo
  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.type === transactionType
    );
  }, [categories, transactionType]);

  // Verifica se todos os campos obrigatórios estão preenchidos
  const isFormValid = useMemo(() => {
    return amount && description && category && account;
  }, [amount, description, category, account]);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setAccount('');
    setDate(new Date());
    setTransactionType('EXPENSE');
  };

  // Função para animar o sucesso
  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(showSuccessAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(showSuccessAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddTransaction = async () => {
    try {
      const transactionData = {
        type: transactionType,
        amount: parseFloat(amount.replace(/\D/g, '')) / 100, // Converte de centavos para reais
        description,
        date: date.toISOString(),
        categoryId: parseInt(category),
        accountId: parseInt(account),
        isRecurring: false
      };

      const response = await addTransaction(transactionData);

      if (response && !error) {
        animateSuccess();
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Transação salva com sucesso',
        });
        resetForm();
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível salvar a transação',
      });
      console.error('Erro ao adicionar transação:', err);
    }
  };

  // Memoize os callbacks de dismiss
  const handleDismissAccountModal = useCallback(() => {
    console.log('[AddTransaction] Closing account modal');
    setShowAddAccountModal(false);
  }, []);

  const handleDismissCategoryModal = useCallback(() => {
    setShowAddCategoryModal(false);
  }, []);

  const getAccountDisplayValue = (accountId) => {
    return accounts.find(acc => acc.id.toString() === accountId)?.name;
  };

  const getCategoryDisplayValue = (categoryId) => {
    return filteredCategories.find(cat => cat.id.toString() === categoryId)?.name;
  };

  // Function to handle account button press
  const handleOpenAccountModal = () => {
    console.log('[AddTransaction] Opening account modal');
    setShowAddAccountModal(true);
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text variant="headlineMedium" style={styles.title}>
              Nova Transação
            </Text>
          </View>

          <SegmentedButtons
            value={transactionType}
            onValueChange={(value) => {
              setTransactionType(value);
              setCategory('');
            }}
            buttons={[
              {
                value: 'EXPENSE',
                label: 'Despesa',
                style: {
                  borderColor: transactionType === 'EXPENSE' ? `${colors.expense}` : '#999',
                  borderWidth: transactionType === 'EXPENSE' ? 4 : 1,
                  backgroundColor: transactionType === 'EXPENSE' ? `${colors.expense}15` : 'transparent',
                },
                textColor: colors.expense,
              },
              {
                value: 'INCOME',
                label: 'Receita',
                style: {
                  borderColor: transactionType === 'INCOME' ? `${colors.income}` : '#999',
                  borderWidth: transactionType === 'INCOME' ? 4 : 1,
                  backgroundColor: transactionType === 'INCOME' ? `${colors.income}15` : 'transparent',
                },
                textColor: colors.income,
              },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Valor"
            value={`R$ ${amount}`}
            onChangeText={(text) => setAmount(currencyMask(text))}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={themeColor}
            activeOutlineColor={themeColor}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={[
              styles.input,
            ]}
            outlineColor={themeColor}
            activeOutlineColor={themeColor}
            theme={{
              colors: {
                placeholder: `${themeColor}99`,
              },
            }}
          />

          <CustomDatePicker
            label="Data"
            date={date}
            showPicker={showDatePicker}
            onPress={() => setShowDatePicker(true)}
            onDateChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            themeColor={themeColor}
            maximumDate={new Date()}
          />

          <CustomPicker
            label="Conta"
            selectedValue={account}
            onValueChange={setAccount}
            items={accounts}
            placeholder="Selecione uma conta"
            showPicker={showAccountPicker}
            setShowPicker={setShowAccountPicker}
            themeColor={themeColor}
            getDisplayValue={getAccountDisplayValue}
          />

          <CustomPicker
            label="Categoria"
            selectedValue={category}
            onValueChange={setCategory}
            items={filteredCategories}
            placeholder="Selecione uma categoria"
            showPicker={showCategoryPicker}
            setShowPicker={setShowCategoryPicker}
            themeColor={themeColor}
            getDisplayValue={getCategoryDisplayValue}
          />

          <Pressable
            onPress={handleAddTransaction}
            disabled={loading || !isFormValid}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isFormValid
                  ? pressed
                    ? `${themeColor}80`
                    : themeColor
                  : `${themeColor}40`,

                elevation: isFormValid
                  ? pressed
                    ? 0
                    : 4
                  : 0,
              }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                Salvar
              </Text>
            )}
          </Pressable>

          <View style={styles.bottomActions}>
            <Pressable
              onPress={handleOpenAccountModal}
              style={styles.actionButton}
            >
              <Icon name="bank-plus" size={24} color={themeColor} />
              <Text style={[styles.actionButtonText, { color: themeColor }]}>
                Nova Conta
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                console.log('[AddTransaction] Opening category modal');
                setShowAddCategoryModal(true);
              }}
              style={styles.actionButton}
            >
              <Icon name="shape-plus" size={24} color={themeColor} />
              <Text style={[styles.actionButtonText, { color: themeColor }]}>
                Nova Categoria
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Debug Information */}
      <Text style={styles.debugText}>
        Show Account Modal: {showAddAccountModal ? 'true' : 'false'}
      </Text>

      {/* Bottom Sheets */}
      <AddAccountModal
        visible={showAddAccountModal}
        onDismiss={handleDismissAccountModal}
        themeColor={colors.addAccount}
      />

      <AddCategoryModal
        visible={showAddCategoryModal}
        onDismiss={handleDismissCategoryModal}
        themeColor={themeColor}
        initialType={transactionType}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 28
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  title: {
    marginBottom: 24,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleUnderline: {
    height: 3,
    width: 60,
    backgroundColor: colors.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  segmentButton: {
    borderWidth: 2,
    flex: 1,
  },
  input: {
    marginTop: 20,
    marginBottom: 0,
    height: 54,
  },
  pickerWrapper: {
    marginTop: 16,
    marginBottom: 0,
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
  dateButton: {
    borderWidth: 2,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 24,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  debugText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 10,
  },
});

export default AddTransaction; 