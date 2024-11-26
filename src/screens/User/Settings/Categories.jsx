import React, { useState }from 'react';
import { View, StyleSheet , Modal, TextInput, ScrollView} from 'react-native';
import { List, FAB , Divider, Text, Button} from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import AddCategoryModal from '../AddTransaction/AddCategoryModal';
import { colors } from '../../../theme';




const Categories = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleEditCategory = (category) => {
    console.log('Editar categoria');
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setEditModalVisible(true);
  }

  const handleSaveCategory = () => {
    if (selectedCategory) {
      console.log(`Categoria editada: ${selectedCategory.name} -> ${newCategoryName}`);
      // Lógica para salvar o nome da categoria editada (API, hook, etc.)
    }
    setEditModalVisible(false);
    setSelectedCategory(null);
    setNewCategoryName('');
  };

  const { categories } = useFinances();
  console.log('categorias: ', { categories })

  const expenseCategories = categories.filter(category => category.type === 'EXPENSE');
  const incomeCategories = categories.filter(category => category.type === 'INCOME');

  const handleAddCategory = () => {
    setAddModalVisible(true);
  };

  const handleDismissAddModal = () => {
    setAddModalVisible(false);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

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
        </ScrollView>

      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddCategory}
      />
      <AddCategoryModal
          visible={addModalVisible}
          onDismiss={handleDismissAddModal}
          themeColor={colors.primary}
          initialType="EXPENSE"
        />
      <Modal
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Editar Categoria
            </Text>
            <TextInput
              style={styles.input}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Novo nome da categoria"
            />
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleSaveCategory} style={styles.saveButton}>
                Salvar
              </Button>
              <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
});

export default Categories; 