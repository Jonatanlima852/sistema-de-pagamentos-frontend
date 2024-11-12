import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';

const AddTransaction = () => {
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());

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

          <TextInput
            label="Categoria"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="chevron-down" />}
          />

          <Button 
            mode="contained" 
            onPress={() => {/* Lógica para salvar */}}
            style={styles.button}
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
  },
  button: {
    marginTop: 24,
  },
});

export default AddTransaction; 