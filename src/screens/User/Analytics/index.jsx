import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors } from '../../../theme';

const Analytics = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Análise Financeira</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Distribuição de Gastos</Text>
            <View style={styles.chartPlaceholder}>
              {/* Aqui virá o gráfico de pizza */}
              <Text>Gráfico de Distribuição</Text>
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