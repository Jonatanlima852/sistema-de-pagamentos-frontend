import React, { useState }from 'react';
import { View, StyleSheet , Modal, TextInput, ScrollView, Alert, Pressable} from 'react-native';
import { List, FAB , Divider, Text, Button, IconButton} from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import AddCategoryModal from '../AddTransaction/AddCategoryModal';
import { colors } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';




const Categories = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { categories, updateCategory, deleteCategory } = useFinances();

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setEditModalVisible(true);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewCategoryName(selectedCategory.name);
  };

  const handleSaveCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, {
        name: newCategoryName,
        type: selectedCategory.type
      });
      setEditModalVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a categoria. Tente novamente.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Categoria',
      'Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteCategory(selectedCategory.id);
              setEditModalVisible(false);
            } catch (error) {
              console.error('Erro ao excluir categoria:', error);
              
                Alert.alert(
                  'Não é possível excluir',
                  'Esta categoria possivelmente possui transações vinculadas. Remova todas as transações desta categoria antes de excluí-la.',
                  [{ text: 'OK' }]
                );

            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


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
            <View style={styles.header}>
              <View style={styles.headerActions}>
                <IconButton
                  icon={isEditing ? "content-save" : "pencil"}
                  size={24}
                  iconColor={colors.primary}
                  onPress={isEditing ? handleSaveCategory : handleStartEditing}
                  style={styles.actionIcon}
                />
                <IconButton
                  icon="delete-outline"
                  size={24}
                  iconColor={colors.error}
                  onPress={handleDelete}
                  style={styles.actionIcon}
                />
              </View>
              <Text variant="titleLarge" style={styles.title}>Detalhes</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setEditModalVisible(false)}
                style={styles.closeIcon}
              />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Icon name="tag-outline" size={20} color={colors.primary} />
                    <Text style={styles.label}>Nome da Categoria</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      mode="outlined"
                      style={styles.input}
                      outlineColor={colors.primary}
                      activeOutlineColor={colors.primary}
                    />
                  ) : (
                    <Text style={styles.value}>{selectedCategory?.name}</Text>
                  )}
                </View>
              </View>

              {isEditing && (
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSaveCategory}
                    style={[styles.button, { backgroundColor: colors.primary }]}
                  >
                    Salvar Alterações
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  >
                    Cancelar
                  </Button>
                </View>
              )}

              {!isEditing && (
                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={() => setEditModalVisible(false)}
                    style={({ pressed }) => [
                      styles.closeButton,
                      { backgroundColor: pressed ? `${colors.primary}15` : 'transparent' }
                    ]}
                  >
                    <Text style={[styles.closeButtonText, { color: colors.primary }]}>Fechar</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '40%',
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
  },
  actionIcon: {
    marginLeft: -4,
  },
  title: {
    textAlign: 'center',
    color: colors.text,
    flex: 1,
  },
  closeIcon: {
    marginRight: -8,
  },
  detailsContainer: {
    gap: 24,
  },
  detailRow: {
    minHeight: 54,
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    paddingLeft: 28,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.background,
    marginLeft: 28,
    marginTop: 4,
    height: 40,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 8,
  },
  button: {
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: colors.text,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Categories; 