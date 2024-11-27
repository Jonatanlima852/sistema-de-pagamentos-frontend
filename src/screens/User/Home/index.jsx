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
  const {authData} = useAuth();
  console.log('auth:', { authData })

  // Maior despesa
  const largestExpense = transactions.length > 0
    ? transactions
      .filter((transaction) => transaction.type === 'EXPENSE' && transaction.amount != null)
      .reduce((prev, current) => (current.amount > prev.amount ? current : prev), { amount: 0, description: 'N/A', date: 'N/A' })
    : { amount: 0, description: 'N/A', date: 'N/A' };


  // Últimas 5 transações
  const latestTransactions = transactions.slice(0, 5);

  // Dados de receitas e despesas
  const totalIncome = transactions.length > 0
    ? transactions
      .filter((transaction) => transaction.type === 'INCOME' && transaction.amount != null)
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
    : 0;

  const totalExpense = transactions.length > 0
    ? transactions
      .filter((transaction) => transaction.type === 'EXPENSE' && transaction.amount != null)
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
    : 0;

  const balance = totalIncome - totalExpense;

  // Função simplificada para formatar as datas
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        // year: 'numeric' // descomente se quiser mostrar o ano
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        {/* Header atualizado */}
        <Surface style={styles.header} elevation={4}>
          <Text variant="headlineSmall" style={styles.greeting}>
            Bem-vindo de volta,{'\n'}
          </Text>
          <Text style={styles.userName}>{authData?.user?.name}!</Text>
          <View style={styles.balanceContainer}>
            <Text variant="titleMedium" style={styles.balance}>Saldo Total</Text>
            <Text variant="displaySmall" style={styles.balanceValue}>
              R$ {balance.toFixed(2)}
            </Text>
          </View>
        </Surface>

        {/* Cards de Resumo atualizados */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, styles.incomeCard]}>
            <Card.Content>
              <View style={styles.cardIconContainer}>
                {/* Aqui você pode adicionar um ícone */}
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>Receitas</Text>
              <Text variant="titleLarge" style={styles.cardValue}>R$ {totalIncome.toFixed(2)}</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, styles.expenseCard]}>
            <Card.Content>
              <View style={styles.cardIconContainer}>
                {/* Aqui você pode adicionar um ícone */}
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>Despesas</Text>
              <Text variant="titleLarge" style={styles.cardValue}>R$ {totalExpense.toFixed(2)}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Maior Despesa atualizada */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Maior Despesa do Mês</Text>
          <Card style={styles.largeExpenseCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                <Text style={styles.largeExpenseTitle}>{largestExpense.description}</Text>
                <Text style={styles.largeExpenseDate}>{formatDate(largestExpense.date)}</Text>
              </View>
              <Text style={styles.largeExpenseValue}>R$ {largestExpense.amount}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Últimas Transações atualizadas */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Últimas Transações</Text>
          <Card style={styles.transactionsCard}>
            <Card.Content>
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction) => (
                  <View
                    key={transaction?.id || Math.random().toString(36).substring(2, 15)}
                    style={styles.transactionRow}
                  >
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction?.description || 'Sem descrição'}
                      </Text>
                      <Text style={styles.transactionDate}>{formatDate(transaction?.date)}</Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction?.type === 'INCOME' ? styles.income : styles.expense,
                      ]}
                    >
                      {transaction?.type === 'INCOME' ? '+' : '-'} R${' '}
                      {typeof parseFloat(transaction?.amount) === 'number' ? parseFloat(transaction.amount).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyTransactions}>Nenhuma transação registrada</Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF', // Fundo mais claro e moderno
  },
  header: {
    padding: 24,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
  },
  greeting: {
    color: 'white',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 34,
    color: 'white',
    paddingBottom: 16,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  balance: {
    color: 'white',
    opacity: 0.9,
  },
  balanceValue: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: '#E8F5E9',
  },
  expenseCard: {
    backgroundColor: '#FFEBEE',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#424242',
    fontWeight: '500',
  },
  cardValue: {
    color: '#424242',
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#424242',
    fontWeight: '600',
  },
  largeExpenseCard: {
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFF',
  },
  largeExpenseTitle: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  largeExpenseDate: {
    fontSize: 14,
    color: '#757575',
  },
  largeExpenseValue: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 8,
  },
  transactionsCard: {
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFF',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    color: '#424242',
    fontSize: 15,
    fontWeight: '500',
  },
  transactionDate: {
    color: '#757575',
    fontSize: 13,
    marginTop: 4,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  income: {
    color: '#2E7D32',
  },
  expense: {
    color: '#C62828',
  },
  emptyTransactions: {
    textAlign: 'center',
    color: '#757575',
    padding: 16,
  },
});

export default Home;