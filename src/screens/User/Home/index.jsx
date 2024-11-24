import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface, Divider } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';

const Home = () => {
  const usuario = 'petismo';

  // Mock de transações
  const transactions = [
    { id: 1, description: 'Aluguel', amount: '1.500,00', type: 'expense', date: '05/03/2024' },
    { id: 2, description: 'Mercado', amount: '800,00', type: 'expense', date: '10/03/2024' },
    { id: 3, description: 'Salário', amount: '5.000,00', type: 'income', date: '01/03/2024' },
    { id: 4, description: 'Internet', amount: '200,00', type: 'expense', date: '15/03/2024' },
    { id: 5, description: 'Manutenção de equipamento', amount: '3000,00', type: 'expense', date: '24/03/2024' },
    { id: 6, description: 'Imposto', amount: '15000,00', type: 'expense', date: '30/03/2024' },
    { id: 7, description: 'Carro', amount: '3000,00', type: 'expense', date: '30/03/2024' },
  ];

  // Calcular maior despesa
  const largestExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((prev, current) =>
      parseFloat(current.amount.replace('.', '').replace(',', '.')) >
      parseFloat(prev.amount.replace('.', '').replace(',', '.'))
        ? current
        : prev
    );

  // Últimas 3 transações
  const latestTransactions = transactions.slice(0, 6);

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        {/* Cabeçalho com saldo total */}
        <Surface style={styles.header} elevation={2}>
          <Text variant="headlineSmall" style={styles.greeting}>Olá, {usuario}</Text>
          <Text variant="titleMedium" style={styles.balance}>Saldo Total</Text>
          <Text variant="displaySmall" style={styles.balanceValue}>R$ 5.234,50</Text>
        </Surface>

        {/* Seção de Receitas e Despesas */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: colors.success }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Receitas</Text>
              <Text variant="titleLarge" style={styles.cardValue}>R$ 7.500,00</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: colors.error }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Despesas</Text>
              <Text variant="titleLarge" style={styles.cardValue}>R$ 2.265,50</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Seção da maior despesa */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Maior Despesa</Text>
          <Card style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                <Text variant="bodyMedium" style={styles.transactionTitle}>{largestExpense.description}</Text>
                <Text variant="bodySmall" style={styles.transactionDate}>{largestExpense.date}</Text>
              </View>
              <Text variant="displaySmall" style={styles.transactionValue}>R$ {largestExpense.amount}</Text>
            </Card.Content>
          </Card>
        </View>


        {/* Seção das últimas 3 transações */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Últimas Transações</Text>
          {latestTransactions.map((transaction) => (
            <View key={transaction.id}>
              <View style={styles.transactionRow}>
                <Text variant="bodyMedium" style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text variant="bodyMedium" style={[styles.transactionAmount, transaction.type === 'income' ? styles.income : styles.expense]}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount}
                </Text>
              </View>
              <Divider />
            </View>
          ))}
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
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    color: 'white',
    marginBottom: 8,
  },
  balance: {
    color: 'white',
    opacity: 0.8,
  },
  balanceValue: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
  },
  cardTitle: {
    color: 'white',
    opacity: 0.9,
  },
  cardValue: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: colors.text,
  },
  transactionCard: {
    borderRadius: 12,
    padding: 16,
  },
  transactionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionDate: {
    color: colors.textLight,
    marginBottom: 4,
    fontSize: 14,
  },  
  transactionValue: {
    color: colors.error,
    fontWeight: 'bold',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  transactionDescription: {
    color: colors.text,
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  income: {
    color: colors.success,
  },
  expense: {
    color: colors.error,
  },
});

export default Home;