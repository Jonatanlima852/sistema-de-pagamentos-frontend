import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, ProgressBar, FAB } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';

const Limits = () => {
  const handleAddLimit = () => {
    // Implementar lógica para adicionar limite
    console.log('Adicionar limite');
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader>Limites de Gastos</List.Subheader>
          <List.Item
            title="Alimentação"
            description="R$ 800 / R$ 1.000"
            right={() => (
              <View style={styles.progressContainer}>
                <ProgressBar progress={0.8} style={styles.progressBar} />
              </View>
            )}
          />
          {/* Adicionar mais limites aqui */}
        </List.Section>
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddLimit}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    width: 100,
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Limits; 