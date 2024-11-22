import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons} from 'react-native-paper';
import {DropDown} from 'react-native-paper-dropdown'; 
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import {useFinances} from '../../../hooks/useFinances'


  

  const AddTransaction = () => {
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date());
    const { loading , error , categories} = useFinances()
    console.log('Categorias carregadas:', categories);
    const [showDropDown, setShowDropDown] = useState(false);

    const formattedCategories = categories?.map((category) => ({
      label: category.name, // Nome da categoria para exibição
      value: category.id,   // ID da categoria como valor
    })) || [];


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

          <DropDown
            label="Categoria"
            mode="outlined"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={category} 
            setValue={setCategory} 
            list={formattedCategories} 
            style={styles.input}
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