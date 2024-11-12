import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { colors } from '../../../theme';
import SafeScreen from '../../../components/SafeScreen';

const Home = () => {
  return (
    <SafeScreen>
      <ScrollView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <Text variant="headlineSmall" style={styles.greeting}>Olá, Usuário</Text>
          <Text variant="titleMedium" style={styles.balance}>Saldo Total</Text>
          <Text variant="displaySmall" style={styles.balanceValue}>R$ 5.234,50</Text>
        </Surface>

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

        <Text variant="titleMedium" style={styles.sectionTitle}>Resumo do Mês</Text>
        {/* Aqui virão os componentes de resumo */}
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
  sectionTitle: {
    marginLeft: 16,
    marginTop: 16,
    color: colors.text,
  },
});

export default Home; 