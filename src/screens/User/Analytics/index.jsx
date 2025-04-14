import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFinances } from '../../../hooks/useFinances';

const Analytics = () => {
  const { transactions, categories, accounts } = useFinances();
  const [expenseData, setExpenseData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [expenseAccountData, setExpenseAccountData] = useState(null);
  const [incomeAccountData, setIncomeAccountData] = useState(null);

  useEffect(() => {
    processData();
  }, [transactions, categories, accounts]);

  const processData = () => {
    if (!transactions.length || !categories.length || !accounts.length) return;

    // Processa dados de despesas
    const expenses = transactions.filter(txn => txn.type === 'EXPENSE');
    

    // Configura dados para gráfico de despesas por categoria
    const expenseCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: expenses
          .filter(exp => exp.categoryId === cat.id)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setExpenseData({
      labels: expenseCategories.map(cat => cat.name),
      datasets: [{
        data: expenseCategories.map(cat => cat.total)
      }]
    });

    // Processa dados de receitas
    const incomes = transactions.filter(txn => txn.type === 'INCOME');
    
    // Configura dados para gráfico de receitas por categoria
    const incomeCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: incomes
          .filter(inc => inc.categoryId === cat.id)
          .reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setIncomeData({
      labels: incomeCategories.map(cat => cat.name),
      datasets: [{
        data: incomeCategories.map(cat => cat.total)
      }]
    });

    // Agrupa transações por mês
    const monthlyTransactions = transactions.reduce((acc, txn) => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!acc[monthKey]) {
        acc[monthKey] = { expenses: 0, incomes: 0, timestamp: date.getTime() };
      }
      if (txn.type === 'EXPENSE') {
        acc[monthKey].expenses += parseFloat(txn.amount);
      } else {
        acc[monthKey].incomes += parseFloat(txn.amount);
      }
      return acc;
    }, {});

    // Ordena os meses cronologicamente
    const months = Object.entries(monthlyTransactions)
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([month]) => month);
    
    setMonthlyData({
      labels: months,
      datasets: [
        {
          data: months.map(month => monthlyTransactions[month].expenses),
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: months.map(month => monthlyTransactions[month].incomes),
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['Despesas', 'Receitas']
    });

    // Processa dados de despesas por conta
    const expenseAccounts = accounts
      .map(acc => ({
        id: acc.id,
        name: acc.name,
        total: expenses
          .filter(exp => exp.accountId === acc.id)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      }))
      .filter(acc => acc.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setExpenseAccountData({
      labels: expenseAccounts.map(acc => acc.name),
      data: expenseAccounts.map(acc => acc.total),
      colors: [
        '#FF1010',
        '#FF7034',
        '#FF9F40',
        '#FFCD56',
        '#FFE56C'
      ]
    });

    // Processa dados de receitas por conta
    const incomeAccounts = accounts
      .map(acc => ({
        id: acc.id,
        name: acc.name,
        total: incomes
          .filter(inc => inc.accountId === acc.id)
          .reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
      }))
      .filter(acc => acc.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setIncomeAccountData({
      labels: incomeAccounts.map(acc => acc.name),
      data: incomeAccounts.map(acc => acc.total),
      colors: [
        '#00CC66',
        '#4BC0C0',
        '#36A2EB',
        '#9966FF',
        '#C9B3FF'
      ]
    });
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Análise Financeira</Text>

          {/* Gráfico de Previsão de gasto */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>📊 Previsão de Gastos e Lucros</Text>
              <Text style={styles.paragraph}>
                Com base na média dos seus gastos dos últimos 3 meses, você deve gastar <Text style={{ color: '#C62828', fontWeight: 'bold' }}>R$ 2.400</Text> no próximo mês.
              </Text>
              <Text style={styles.paragraph}>
                Com base na média dos seus ganhos, você deve lucrar <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>R$ 1.000</Text> no próximo mês.
              </Text>
              <Text style={styles.paragraph}>
                <Text style={{ fontWeight: 'bold' }}>Saldo previsto: </Text>
                <Text style={{ color: '#C62828', fontWeight: 'bold' }}>R$ -1.400</Text>
              </Text>
              <Text style={styles.paragraph}>
                Sugestão: tente reduzir seus gastos com <Text style={{ fontWeight: 'bold' }}>Joguei no bixo</Text> e <Text style={{ fontWeight: 'bold' }}>Compras de início de mês</Text>.
              </Text>
            </Card.Content>
          </Card>


          {/* Gráfico de Despesas por Categoria */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Categorias de Despesas</Text>
              {!expenseData ? (
                <Text>Carregando dados...</Text>
              ) : expenseData.datasets[0].data.every(value => value === 0) ? (
                <Text>Nenhuma despesa registrada</Text>
              ) : (
                <BarChart
                  data={expenseData}
                  width={Dimensions.get('window').width - 64}
                  height={240}
                  yAxisLabel="R$ "
                  yAxisInterval={1} 
                  fromZero={true}
                  withHorizontalLabels={false}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    barPercentage: 1,
                  }}
                  style={{
                    marginVertical: 14,
                    borderRadius: 16
                  }}
                  showValuesOnTopOfBars={true}
                  withInnerLines={true}
                  segments={4} 
                />
              )}
            </Card.Content>
          </Card>

          {/* Gráfico de Receitas por Categoria */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Categorias de Receitas</Text>
              {!incomeData ? (
                <Text>Carregando dados...</Text>
              ) : incomeData.datasets[0].data.every(value => value === 0) ? (
                <Text>Nenhuma receita registrada</Text>
              ) : (
                <BarChart
                  data={incomeData}
                  width={Dimensions.get('window').width - 64}
                  height={240}
                  yAxisLabel="R$ "
                  yAxisInterval={1} 
                  fromZero={true}
                  withHorizontalLabels={false}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    barPercentage: 1,
                  }}
                  style={{
                    marginVertical: 14,
                    borderRadius: 16
                  }}
                  showValuesOnTopOfBars={true}
                  withInnerLines={true}
                  segments={4} 
                />
              )}
            </Card.Content>
          </Card>

          {/* Gráfico de Evolução Mensal */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Evolução Mensal</Text>
              {!monthlyData ? (
                <Text>Carregando dados...</Text>
              ) : (
                <LineChart
                  data={monthlyData}
                  width={Dimensions.get('window').width - 64}
                  height={220}
                  withHorizontalLabels={false}
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    style: {
                    },
                    propsForDots: {
                      r: "3",
                      strokeWidth: "1",
                    }
                  }}
                  bezier
                  style={{
                    borderRadius: 16,
                    marginVertical: 8,
                    marginLeft: 0
                  }}
                />
              )}
            </Card.Content>
          </Card>

          {/* Gráfico de Pizza - Despesas por Conta */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Contas de Despesas</Text>
              {!expenseAccountData || expenseAccountData.data.length === 0 ? (
                <Text>Nenhuma despesa registrada</Text>
              ) : (
                <View style={styles.pieContainer}>
                  <PieChart
                    data={expenseAccountData.labels.map((label, index) => ({
                      name: label,
                      population: expenseAccountData.data[index],
                      color: expenseAccountData.colors[index],
                      legendFontColor: colors.text,
                      legendFontSize: 12,
                    }))}
                    width={Dimensions.get('window').width - 64}
                    height={220}
                    chartConfig={{
                      backgroundColor: colors.background,
                      backgroundGradientFrom: colors.background,
                      backgroundGradientTo: colors.background,
                      decimalPlaces: 0,
                      color: (opacity = 1) => colors.text,
                      labelColor: (opacity = 1) => colors.text,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft={"0"}
                    hasLegend={true}
                    center={[10, 0]}
                    absolute
                    avoidFalseZero={true}
                  />
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Gráfico de Pizza - Receitas por Conta */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Contas de Receitas</Text>
              {!incomeAccountData ? (
                <Text>Carregando dados...</Text>
              ) : incomeAccountData.data.every(value => value === 0) ? (
                <Text>Nenhuma receita registrada</Text>
              ) : (
                <View style={styles.pieContainer}>
                  <PieChart
                    data={incomeAccountData.labels.map((label, index) => ({
                      name: label,
                      population: incomeAccountData.data[index],
                      color: incomeAccountData.colors[index],
                      legendFontColor: colors.text,
                      legendFontSize: 10,
                    }))}
                    width={Dimensions.get('window').width - 64}
                    height={220}
                    chartConfig={{
                      backgroundColor: colors.background,
                      backgroundGradientFrom: colors.background,
                      backgroundGradientTo: colors.background,
                      decimalPlaces: 0,
                      color: (opacity = 1) => colors.text,
                      labelColor: (opacity = 1) => colors.text,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    hasLegend={true}
                    center={[10, 0]}
                    absolute
                  />
                </View>
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
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    alignItems: "center",
    paddingTop: 28
  },
  title: {
    marginBottom: 24,
    color: colors.text,
    alignItems: "center",
    fontWeight: '700',
    fontSize: 28
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  pieContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  bullet: {
    marginLeft: 8,
    marginBottom: 4,
    color: colors.text,
    fontSize: 14
  },  
});

export default Analytics; 