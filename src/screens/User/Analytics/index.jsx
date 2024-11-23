import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';
import { useFinances } from '../../../hooks/useFinances';

const Analytics = () => {
  const { transactions, categories } = useFinances();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (transactions && categories) {
      processChartData();
    }
  }, [transactions, categories]);

  const processChartData = () => {
    // Data de 6 meses atrás
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Filtrar transações de gastos nos últimos 6 meses
    const recentExpenses = transactions.filter(
      (txn) =>
        txn.type === 'EXPENSE' && new Date(txn.date) >= sixMonthsAgo
    );

    // Agrupar por categoria e somar os valores
    const categorySums = {};

    recentExpenses.forEach((txn) => {
      const categoryId = txn.categoryId;
      if (categorySums[categoryId]) {
        categorySums[categoryId] += txn.amount;
      } else {
        categorySums[categoryId] = txn.amount;
      }
    });

    // Converter para array e ordenar por valor decrescente
    const categorySumsArray = Object.keys(categorySums).map(
      (categoryId) => ({
        categoryId,
        total: categorySums[categoryId],
      })
    );

    categorySumsArray.sort((a, b) => b.total - a.total);

    // Obter as top 6 categorias
    const topCategories = categorySumsArray.slice(0, 6);

    // Obter nomes das categorias
    const data = topCategories.map((item) => {
      const category = categories.find(
        (cat) => cat.id === parseInt(item.categoryId)
      );
      return {
        category: category ? category.name : 'Desconhecido',
        total: item.total,
      };
    });

    setChartData(data);
  };

  // Resto do componente...


  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>Análise Financeira</Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">
                Top 6 Categorias por Valor de Gastos
              </Text>
              <View style={styles.chartContainer}>
                {chartData.length > 0 ? (
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 30 }}
                  >
                    <VictoryAxis
                      style={{
                        tickLabels: {
                          angle: -45,
                          textAnchor: 'end',
                          fontSize: 10,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(x) => `R$${x}`}
                    />
                    <VictoryBar
                      data={chartData}
                      x="category"
                      y="total"
                      style={{
                        data: { fill: colors.primary },
                      }}
                      labels={({ datum }) => `R$${datum.total.toFixed(2)}`}
                      labelComponent={
                        <VictoryLabel
                          dy={-10}
                          style={{ fontSize: 10, fill: colors.text }}
                        />
                      }
                    />
                  </VictoryChart>
                ) : (
                  <Text>Carregando gráfico...</Text>
                )}
              </View>
            </Card.Content>
          </Card>


          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Evolução Mensal</Text>
              <View style={styles.chartPlaceholder}>
                {/* Aqui virá o gráfico de linha */}
                <Text>Gráfico de Evolução</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Previsão de Gastos</Text>
              <View style={styles.chartPlaceholder}>
                {/* Aqui virá o gráfico de previsão */}
                <Text>Gráfico de Previsão</Text>
              </View>
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
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Analytics; 