import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Animated, Modal, Button, Platform } from 'react-native';
import { Text, TextInput, SegmentedButtons, List } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { currencyMask } from '../../../utils/masks';
import Toast from 'react-native-toast-message';
import AddAccountModal from './AddAccountModal';
import AddCategoryModal from './AddCategoryModal';

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
    setShowAddAccountModal(false);
  }, []);

  const handleDismissCategoryModal = useCallback(() => {
    setShowAddCategoryModal(false);
  }, []);

  const renderAccountPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Conta</Text>
          <Pressable
            onPress={() => setShowAccountPicker(true)}
            style={[
              styles.pickerButton,
              { borderColor: themeColor }
            ]}
          >
            <Text style={[styles.pickerButtonText, { color: account ? colors.text : colors.placeholder }]}>
              {account ? accounts.find(acc => acc.id.toString() === account)?.name : 'Selecione uma conta'}
            </Text>
          </Pressable>

          <Modal
            visible={showAccountPicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.iosPickerModal}>
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <Pressable
                    onPress={() => setShowAccountPicker(false)}
                    style={({ pressed }) => [
                      styles.closeButton,
                      { 
                        opacity: pressed ? 0.7 : 1,
                        borderWidth: 1,
                        borderColor: `${themeColor}50`,
                        borderRadius: 8,
                      }
                    ]}
                  >
                    <Text style={[styles.closeButtonText, { color: themeColor }]}>
                      Fechar
                    </Text>
                  </Pressable>
                </View>
                {accounts.map((acc) => (
                  <List.Item
                    key={acc.id}
                    title={acc.name}
                    onPress={() => {
                      setAccount(acc.id.toString());
                      setShowAccountPicker(false);
                    }}
                    style={[
                      styles.iosPickerItem,
                      account === acc.id.toString() && styles.iosPickerItemSelected
                    ]}
                    titleStyle={[
                      styles.iosPickerItemText,
                      account === acc.id.toString() && { color: themeColor }
                    ]}
                    right={props => 
                      account === acc.id.toString() && 
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

    // Android Picker
    return (
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Conta</Text>
        <View style={[styles.pickerContainer, { borderColor: themeColor }]}>
          <Picker
            selectedValue={account}
            onValueChange={setAccount}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor={themeColor}
          >
            <Picker.Item
              enabled={false}
              label="Selecione uma conta"
              value=""
              color={colors.placeholder}
            />
            {accounts.map((acc) => (
              <Picker.Item
                key={acc.id}
                label={acc.name}
                value={acc.id.toString()}
                color={themeColor}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderCategoryPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Categoria</Text>
          <Pressable
            onPress={() => setShowCategoryPicker(true)}
            style={[
              styles.pickerButton,
              { borderColor: themeColor }
            ]}
          >
            <Text style={[styles.pickerButtonText, { color: category ? colors.text : colors.placeholder }]}>
              {category ? filteredCategories.find(cat => cat.id.toString() === category)?.name : 'Selecione uma categoria'}
            </Text>
          </Pressable>

          <Modal
            visible={showCategoryPicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.iosPickerModal}>
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <Pressable
                    onPress={() => setShowCategoryPicker(false)}
                    style={({ pressed }) => [
                      styles.closeButton,
                      { 
                        opacity: pressed ? 0.7 : 1,
                        borderWidth: 1,
                        borderColor: `${themeColor}50`,
                        borderRadius: 8,
                      }
                    ]}
                  >
                    <Text style={[styles.closeButtonText, { color: themeColor }]}>
                      Fechar
                    </Text>
                  </Pressable>
                </View>
                {filteredCategories.map((cat) => (
                  <List.Item
                    key={cat.id}
                    title={cat.name}
                    onPress={() => {
                      setCategory(cat.id.toString());
                      setShowCategoryPicker(false);
                    }}
                    style={[
                      styles.iosPickerItem,
                      category === cat.id.toString() && styles.iosPickerItemSelected
                    ]}
                    titleStyle={[
                      styles.iosPickerItemText,
                      category === cat.id.toString() && { color: themeColor }
                    ]}
                    right={props => 
                      category === cat.id.toString() && 
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

    // Android Picker
    return (
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Categoria</Text>
        <View style={[styles.pickerContainer, { borderColor: themeColor }]}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor={themeColor}
          >
            <Picker.Item
              enabled={false}
              label="Selecione uma categoria"
              value=""
              color={colors.placeholder}
            />
            {filteredCategories.map((cat) => (
              <Picker.Item
                key={cat.id}
                label={cat.name}
                value={cat.id.toString()}
                color={themeColor}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
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

          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Data</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={({ pressed }) => [
                styles.dateButton,
                {
                  borderColor: themeColor,
                  backgroundColor: pressed ? `${themeColor}30` : `${themeColor}15`,
                }
              ]}
            >
              <View style={styles.dateButtonContent}>
                <Text style={[styles.dateButtonText, { color: themeColor }]}>
                  {date.toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          {renderAccountPicker()}
          {renderCategoryPicker()}

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
              onPress={() => setShowAddAccountModal(true)}
              style={styles.actionButton}
            >
              <Icon name="bank-plus" size={24} color={themeColor} />
              <Text style={[styles.actionButtonText, { color: themeColor }]}>
                Nova Conta
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowAddCategoryModal(true)}
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

      {/* Modais */}
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
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 24,
    color: colors.text,
    fontWeight: 'bold',
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
  modalContainer: {
    backgroundColor: colors.background,
    padding: 20,
    margin: 20,
    borderRadius: 8,
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
    paddingBottom: 20,
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
  closeButton: {
    padding: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddTransaction; 