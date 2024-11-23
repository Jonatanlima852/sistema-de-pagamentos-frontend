import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';

const AddTransaction = () => {
  const { loading, error, categories = [], addTransaction } = useFinances();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Nova Transação</Text>

          <SegmentedButtons
            value={transactionType}
            onValueChange={setTransactionType}
            buttons={[
              { value: 'expense', label: 'Despesa' },
              { value: 'income', label: 'Receita' },
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

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item 
                label="Selecione uma categoria" 
                value="" 
                style={styles.pickerPlaceholder}
              />
              {categories.map((cat) => (
                <Picker.Item
                  key={cat.id}
                  label={cat.name}
                  value={cat.id.toString()}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>

          <Button
            mode="contained"
            onPress={() => console.log('Salvando...')}
            style={styles.button}
            loading={loading}
            disabled={loading || !amount || !description || !category}
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
  pickerContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
  },
  pickerItem: {
    color: colors.text,
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: colors.placeholder,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
  },
});

export default AddTransaction; 