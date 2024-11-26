import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, FAB , Divider} from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';




const Categories = () => {
  const handleAddCategory = () => {
    // Implementar lógica para adicionar categoria
    console.log('Adicionar categoria');
  };
  const handleEditCategory = () => {
    console.log('Editar categoria');
  }
  const { categories } = useFinances();
  console.log('categorias: ', { categories })

  const expenseCategories = categories.filter(category => category.type === 'EXPENSE');
  const incomeCategories = categories.filter(category => category.type === 'INCOME');

  return (
    <SafeScreen>
      <View style={styles.container}>
        <List.Section>
          <List.Subheader>Categorias de Despesas</List.Subheader>
          {categories && expenseCategories.map((category, index) => (
            <React.Fragment key={category.id}>
              <List.Item
                title={category.name}
                left={props => <List.Icon {...props} icon="cart" color='red'/>}
                onPress={() => handleEditCategory(category)}
              />
              {index < expenseCategories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Section>
        <List.Section>
          <List.Subheader>Categorias de Receitas</List.Subheader>
          {categories && incomeCategories.map((category, index) => (
            <React.Fragment key={category.id}>
              <List.Item
                title={category.name}
                left={props => <List.Icon {...props} icon="cash-multiple" color='green'/>}
                onPress={() => handleEditCategory(category)}
              />
              {index < incomeCategories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
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