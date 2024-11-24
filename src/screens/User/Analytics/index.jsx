import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFinances } from '../../../hooks/useFinances';

const Analytics = () => {
  const { transactions, categories } = useFinances();
  const [expenseData, setExpenseData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    processData();
  }, [transactions, categories]);

  const processData = () => {
    if (!transactions.length || !categories.length) return;

    // Processa dados de despesas
    const expenses = transactions.filter(txn => txn.type === 'EXPENSE');
    
    // Processa dados de receitas
    const incomes = transactions.filter(txn => txn.type === 'INCOME');

    // Configura dados para gráfico de despesas por categoria
    const expenseCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: expenses
          .filter(exp => exp.categoryId === cat.id)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Encontra o maior valor para calcular a escala
    const maxValue = Math.max(...expenseCategories.map(cat => cat.total));
    // Arredonda para a próxima potência de 10
    const roundedMax = Math.ceil(maxValue / Math.pow(10, Math.floor(Math.log10(maxValue)))) 
      * Math.pow(10, Math.floor(Math.log10(maxValue)));
    // Calcula o intervalo para 5 divisões
    const yAxisInterval = roundedMax / 5;

    setExpenseData({
      labels: expenseCategories.map(cat => cat.name),
      datasets: [{
        data: expenseCategories.map(cat => cat.total)
      }],
      // Adiciona a configuração do eixo Y
      yAxisInterval,
      maxValue: roundedMax
    });

    // Configura dados para gráfico de receitas por categoria
    const incomeCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: incomes
          .filter(inc => inc.categoryId === cat.id)
          .reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
      }))
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
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Análise Financeira</Text>

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
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    style: {
                      borderRadius: 0
                    },
                    formatYLabel: (value) => Math.abs(value).toString(),
                    barPercentage: 1,
                    // Configuração dos intervalos do eixo Y
                    yAxisInterval: expenseData?.yAxisInterval,
                    // Força o valor máximo do eixo Y
                    max: expenseData?.maxValue
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  showValuesOnTopOfBars={true}
                  withInnerLines={true}
                  segments={4} // Força 5 segmentos no eixo Y
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
                  chartConfig={{
                    backgroundColor: colors.background,
                    backgroundGradientFrom: colors.background,
                    backgroundGradientTo: colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: colors.primary
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
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
  },
  title: {
    marginBottom: 24,
    color: colors.text,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
});

export default Analytics; 