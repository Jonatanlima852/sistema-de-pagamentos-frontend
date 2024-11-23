import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';

const AddTransaction = () => {
  const { loading, error, categories = [], accounts = [], addTransaction } = useFinances();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');

  // Filtra categorias por tipo
  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.type === transactionType
    );
  }, [categories, transactionType]);

  console.log('filteredCategories', filteredCategories);


  const handleAddTransaction = () => {
    addTransaction({
      type: transactionType.toUpperCase(),
      amount,
      description,
      categoryId: parseInt(category),
      accountId: parseInt(account)
    });
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Nova Transação</Text>

          <SegmentedButtons
            value={transactionType}
            onValueChange={(value) => {
              setTransactionType(value);
              setCategory(''); // Limpa categoria ao mudar tipo
            }}
            buttons={[
              { value: 'EXPENSE', label: 'Despesa' },
              { value: 'INCOME', label: 'Receita' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Valor"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Affix text="R$" />}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Conta</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={account}
                onValueChange={setAccount}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor={colors.text}
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
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor={colors.text}
                placeholder="Selecione uma categoria"
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
                      color={colors.text}
                    />
                  ))}

              </Picker>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleAddTransaction}
            style={styles.button}
            loading={loading}
            disabled={loading || !amount || !description || !category || !account}
          >
            Salvar
          </Button>
        </View>
      </ScrollView>
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
  title: {
    marginBottom: 24,
    color: colors.text,
  },
  segmentedButton: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  pickerWrapper: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 4,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: colors.text,
    marginLeft: -8, // Ajusta o alinhamento do texto
  },
  button: {
    marginTop: 24,
  },
});

export default AddTransaction; 