import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Surface, Card } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
// import { styles } from './styles';
import { useFinances } from '../../../hooks/useFinances';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';

const Home = () => {
  const { transactions } = useFinances();
  console.log(transactions)
  const { user } = useAuth();

  // Maior despesa
  const largestExpense = transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((prev, current) => (current.amount > prev.amount ? current : prev), transactions[0]);

  // Últimas 5 transações
  const latestTransactions = transactions.slice(0, 5);

  // Dados de receitas e despesas
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'INCOME')
    // .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    // .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        {/* Cabeçalho com saldo total */}
        <Surface style={styles.header} elevation={2}>
          <Text variant="headlineSmall" style={styles.greeting}>Olá, {largestExpense?.user || 'Usuário'}</Text>
          <Text variant="titleMedium" style={styles.balance}>Saldo Total</Text>
          <Text variant="displaySmall" style={styles.balanceValue}>
            R$ {balance.toFixed(2)}
          </Text>
        </Surface>

        {/* Resumo de Receitas e Despesas */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: colors.success }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Receitas</Text>
              {/* <Text variant="titleLarge" style={styles.cardValue}>R$ {totalIncome.toFixed(2)}</Text> */}
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: colors.error }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Despesas</Text>
              {/* <Text variant="titleLarge" style={styles.cardValue}>R$ {totalExpense.toFixed(2)}</Text> */}
            </Card.Content>
          </Card>
        </View>

        {/* Maior Despesa */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Maior Despesa</Text>
          <Card style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                {/* <Text style={styles.transactionTitle}>{largestExpense.description}</Text> */}
                {/* <Text style={styles.transactionDate}>{largestExpense.date}</Text> */}
              </View>
              {/* <Text style={styles.transactionValue}>R$ {largestExpense.amount.toFixed(2)}</Text> */}
            </Card.Content>
          </Card>
        </View>

        {/* Últimas Transações */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Últimas Transações</Text>
          {latestTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionRow}>
              {/* <Text style={styles.transactionDescription}>{transaction.description}</Text> */}
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'INCOME' ? styles.income : styles.expense,
                ]}
              >
                {/* {transaction.type === 'INCOME' ? '+' : '-'} R$ {transaction.amount.toFixed(2)} */}
              </Text>
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
    padding: 16,
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textLight,
    opacity: 0.6,
  },
  transactionValue: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
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