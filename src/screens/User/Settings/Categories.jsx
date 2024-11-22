import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, FAB } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';

const Categories = () => {
  const handleAddCategory = () => {
    // Implementar lógica para adicionar categoria
    console.log('Adicionar categoria');
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader>Categorias de Despesas</List.Subheader>
          <List.Item
            title="Alimentação"
            left={props => <List.Icon {...props} icon="food" />}
          />
          <List.Item
            title="Transporte"
            left={props => <List.Icon {...props} icon="car" />}
          />
          {/* Adicionar mais categorias aqui */}
        </List.Section>
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddCategory}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Categories; 