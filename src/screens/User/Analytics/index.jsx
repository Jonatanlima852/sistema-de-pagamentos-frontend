import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFinances } from '../../../hooks/useFinances';

const Analytics = () => {
  const { transactions, categories, accounts, tags } = useFinances();
  const [expenseData, setExpenseData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [expenseAccountData, setExpenseAccountData] = useState(null);
  const [incomeAccountData, setIncomeAccountData] = useState(null);
  const [expensiveTagsData, setExpensiveTagsData] = useState(null);
  const [cheapTagsData, setCheapTagsData] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    processData();
  }, [transactions, categories, accounts, tags]);

  const processData = () => {
    if (!transactions.length || !categories.length || !accounts.length) return;

    const expenses = transactions.filter(txn => txn.type === 'EXPENSE');
    const incomes = transactions.filter(txn => txn.type === 'INCOME');

    // Processa dados de tags
    processTags(transactions);

    // Lógica de previsão melhorada
    const now = new Date();
    const monthsBack = 6; // Aumentado para considerar mais dados históricos

    const getMonthlyTrends = (txns) => {
      const grouped = {};
      const monthlyTotals = {};

      // Agrupar por mês e categoria
      txns.forEach(txn => {
        const date = new Date(txn.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Agrupar por descrição
        if (!grouped[txn.description]) grouped[txn.description] = {};
        if (!grouped[txn.description][monthKey]) grouped[txn.description][monthKey] = 0;
        grouped[txn.description][monthKey] += parseFloat(txn.amount);
        
        // Agrupar por categoria
        const category = categories.find(c => c.id === txn.categoryId)?.name || 'Sem categoria';
        if (!grouped[category]) grouped[category] = {};
        if (!grouped[category][monthKey]) grouped[category][monthKey] = 0;
        grouped[category][monthKey] += parseFloat(txn.amount);
        
        // Total mensal
        if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
        monthlyTotals[monthKey] += parseFloat(txn.amount);
      });

      // Calcular média, tendência e projeção para próximos 3 meses
      const filteredMonths = Object.keys(monthlyTotals)
        .sort()
        .filter(mKey => {
          const [y, m] = mKey.split('-').map(Number);
          const date = new Date(y, m - 1);
          return (now - date) / (1000 * 60 * 60 * 24 * 30) <= monthsBack;
        });

      // Verificar se há pelo menos 3 meses de dados
      if (filteredMonths.length < 3) {
        return { items: [], trend: 0, projection: 0 };
      }

      // Calcular tendência de crescimento/decrescimento
      const firstMonth = filteredMonths[0];
      const lastMonth = filteredMonths[filteredMonths.length - 1];
      const monthsCount = filteredMonths.length;
      
      const firstValue = monthlyTotals[firstMonth] || 0;
      const lastValue = monthlyTotals[lastMonth] || 0;
      
      // Calcular coeficiente de tendência mensal
      let trend = 0;
      if (monthsCount > 1 && firstValue > 0) {
        trend = (lastValue - firstValue) / (monthsCount - 1);
      }

      // Média dos últimos 3 meses (mais recente)
      const recentMonths = filteredMonths.slice(-3);
      const average = recentMonths.reduce((sum, m) => sum + (monthlyTotals[m] || 0), 0) / recentMonths.length;
      
      // Projeção considerando a média e tendência
      const projection = average + trend;
      
      // Intervalo de confiança (±15%)
      const margin = projection * 0.15;
      const minProjection = Math.max(0, projection - margin);
      const maxProjection = projection + margin;

      // Principais itens com média e tendência
      const items = Object.entries(grouped)
        .map(([description, values]) => {
          const monthKeys = Object.keys(values).filter(k => filteredMonths.includes(k));
          if (monthKeys.length < 3) return null;
          
          const avg = monthKeys.reduce((sum, key) => sum + values[key], 0) / monthKeys.length;
          
          // Calcular tendência do item específico
          const firstItemValue = values[firstMonth] || 0;
          const lastItemValue = values[lastMonth] || 0;
          let itemTrend = 0;
          if (monthsCount > 1 && firstItemValue > 0) {
            itemTrend = (lastItemValue - firstItemValue) / (monthsCount - 1);
          }
          
          return {
            description,
            average: avg,
            trend: itemTrend,
            isIncreasing: itemTrend > 0
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.average - a.average)
        .slice(0, 5);

      return {
        items,
        trend,
        projection,
        minProjection,
        maxProjection,
        isIncreasing: trend > 0
      };
    };

    const expenseTrends = getMonthlyTrends(expenses);
    const incomeTrends = getMonthlyTrends(incomes);

    setForecast({
      expenseForecast: expenseTrends.projection,
      incomeForecast: incomeTrends.projection,
      balance: incomeTrends.projection - expenseTrends.projection,
      minExpense: expenseTrends.minProjection,
      maxExpense: expenseTrends.maxProjection,
      minIncome: incomeTrends.minProjection,
      maxIncome: incomeTrends.maxProjection,
      expenseTrend: expenseTrends.trend,
      incomeTrend: incomeTrends.trend,
      topExpenses: expenseTrends.items,
      topIncomes: incomeTrends.items,
      isExpenseIncreasing: expenseTrends.isIncreasing,
      isIncomeIncreasing: incomeTrends.isIncreasing
    });

    // Existing graph data setup (unchanged)
    const expenseCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: expenses.filter(exp => exp.categoryId === cat.id).reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setExpenseData({
      labels: expenseCategories.map(cat => cat.name),
      datasets: [{ data: expenseCategories.map(cat => cat.total) }]
    });

    const incomeCategories = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: incomes.filter(inc => inc.categoryId === cat.id).reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setIncomeData({
      labels: incomeCategories.map(cat => cat.name),
      datasets: [{ data: incomeCategories.map(cat => cat.total) }]
    });

    const monthlyTransactions = transactions.reduce((acc, txn) => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!acc[monthKey]) acc[monthKey] = { expenses: 0, incomes: 0, timestamp: date.getTime() };
      if (txn.type === 'EXPENSE') acc[monthKey].expenses += parseFloat(txn.amount);
      else acc[monthKey].incomes += parseFloat(txn.amount);
      return acc;
    }, {});

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

  // Função para processar dados de tags
  const processTags = (transactions) => {
    if (!transactions || !transactions.length || !tags || !tags.length) return;

    // Mapeamento das tags para seus totais
    const tagsTotals = {};
    
    // Para cada transação, acumula o valor para cada tag associada
    transactions.forEach(transaction => {
      if (transaction.tags && transaction.tags.length > 0) {
        transaction.tags.forEach(tag => {
          if (!tagsTotals[tag.id]) {
            tagsTotals[tag.id] = {
              id: tag.id,
              name: tag.name,
              total: 0
            };
          }
          tagsTotals[tag.id].total += parseFloat(transaction.amount || 0);
        });
      }
    });

    // Converte em array para ordenação
    const tagsArray = Object.values(tagsTotals);

    // Tags mais caras (maiores valores)
    const mostExpensiveTags = [...tagsArray]
      .filter(tag => tag.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Tags mais baratas (menores valores)
    const cheapestTags = [...tagsArray]
      .filter(tag => tag.total > 0)
      .sort((a, b) => a.total - b.total)
      .slice(0, 5);

    setExpensiveTagsData({
      labels: mostExpensiveTags.map(tag => tag.name),
      datasets: [{ data: mostExpensiveTags.map(tag => tag.total) }]
    });

    setCheapTagsData({
      labels: cheapestTags.map(tag => tag.name),
      datasets: [{ data: cheapestTags.map(tag => tag.total) }]
    });
  };

  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Análise Financeira</Text>

          {forecast && (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>📊 Previsão de Gastos e Lucros</Text>
                
                <Text style={styles.paragraph}>
                  No próximo mês, você deve gastar entre <Text style={{ color: '#C62828', fontWeight: 'bold' }}>{`R$ ${forecast.minExpense?.toFixed(2) || 0}`}</Text> e <Text style={{ color: '#C62828', fontWeight: 'bold' }}>{`R$ ${forecast.maxExpense?.toFixed(2) || 0}`}</Text>
                  {forecast.expenseTrend > 0 ? 
                    <Text style={{ color: '#C62828' }}> (tendência de aumento ↑)</Text> : 
                    forecast.expenseTrend < 0 ? 
                    <Text style={{ color: '#2E7D32' }}> (tendência de redução ↓)</Text> : 
                    ''
                  }
                </Text>
                
                <Text style={styles.paragraph}>
                  Previsão de receitas entre <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{`R$ ${forecast.minIncome?.toFixed(2) || 0}`}</Text> e <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{`R$ ${forecast.maxIncome?.toFixed(2) || 0}`}</Text>
                  {forecast.incomeTrend > 0 ? 
                    <Text style={{ color: '#2E7D32' }}> (tendência de aumento ↑)</Text> : 
                    forecast.incomeTrend < 0 ? 
                    <Text style={{ color: '#C62828' }}> (tendência de redução ↓)</Text> : 
                    ''
                  }
                </Text>
                
                <Text style={styles.paragraph}>
                  <Text style={{ fontWeight: 'bold' }}>Saldo previsto: </Text>
                  <Text style={{ color: forecast.balance < 0 ? '#C62828' : '#2E7D32', fontWeight: 'bold' }}>{`R$ ${forecast.balance.toFixed(2)}`}</Text>
                </Text>
                
                {forecast.topExpenses && forecast.topExpenses.length > 0 && (
                  <View style={styles.recommendationBox}>
                    <Text style={[styles.paragraph, {fontWeight: 'bold'}]}>Análise de despesas:</Text>
                    {forecast.topExpenses.slice(0, 3).map((e, i) => (
                      <Text key={i} style={styles.paragraph}>
                        • {e.description}: <Text style={{fontWeight: 'bold'}}>{`R$ ${e.average.toFixed(2)}`}</Text>
                        {e.trend > 5 ? 
                          <Text style={{ color: '#C62828' }}> (aumentando ↑)</Text> : 
                          e.trend < -5 ? 
                          <Text style={{ color: '#2E7D32' }}> (diminuindo ↓)</Text> : 
                          <Text> (estável)</Text>
                        }
                      </Text>
                    ))}
                    <Text style={[styles.paragraph, {marginTop: 4}]}>
                      {forecast.isExpenseIncreasing ? 
                        'Atenção: suas despesas estão aumentando. Considere revisar os gastos acima.' : 
                        'Boa notícia: suas despesas estão estáveis ou diminuindo.'
                      }
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Gráfico de Tags Mais Caras */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Tags Mais Caras</Text>
              {!expensiveTagsData ? (
                <Text>Carregando dados...</Text>
              ) : expensiveTagsData.datasets[0].data.length === 0 ? (
                <Text>Nenhuma tag registrada</Text>
              ) : (
                <BarChart
                  data={expensiveTagsData}
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
                    color: (opacity = 1) => `rgba(48, 63, 159, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    barPercentage: 0.8,
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

          {/* Gráfico de Tags Mais Baratas */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Top 5 Tags Mais Baratas</Text>
              {!cheapTagsData ? (
                <Text>Carregando dados...</Text>
              ) : cheapTagsData.datasets[0].data.length === 0 ? (
                <Text>Nenhuma tag registrada</Text>
              ) : (
                <BarChart
                  data={cheapTagsData}
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
                    color: (opacity = 1) => `rgba(121, 85, 72, ${opacity})`,
                    labelColor: (opacity = 1) => colors.text,
                    barPercentage: 0.8,
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
  paragraph: {
    color: colors.text,
    marginBottom: 8,
    fontSize: 14
  },
  recommendationBox: {
    marginTop: 8,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
});

export default Analytics;