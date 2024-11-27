import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, ScrollView, Alert, Pressable } from 'react-native';
import { List, FAB, Divider, Text, Button, IconButton } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import AddAccountModal from '../AddTransaction/AddAccountModal';
import { colors } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Accounts = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { accounts, updateAccount, deleteAccount } = useFinances();

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setNewAccountName(account.name);
    setEditModalVisible(true);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewAccountName(selectedAccount.name);
  };

  const handleSaveAccount = async () => {
    try {
      await updateAccount(selectedAccount.id, {
        name: newAccountName,
        type: selectedAccount.type
      });
      setEditModalVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a conta. Tente novamente.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteAccount(selectedAccount.id);
              setEditModalVisible(false);
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert(
                'Não é possível excluir',
                'Esta conta possui transações vinculadas. Remova todas as transações desta conta antes de excluí-la.',
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

  // Filtra as contas por tipo
  const accountTypes = {
    DEBIT_CARD: 'Cartão de Débito',
    SAVING: 'Poupança',
    CREDIT_CARD: 'Cartão de Crédito',
    CASH: 'Dinheiro',
    INVESTMENT: 'Investimento',
    BUSINESS_CARD: 'Cartão Empresarial',
    OTHER: 'Outros',
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'DEBIT_CARD':
        return 'credit-card';
      case 'SAVING':
        return 'bank';
      case 'CREDIT_CARD':
        return 'credit-card-multiple';
      case 'CASH':
        return 'cash';
      case 'INVESTMENT':
        return 'chart-line';
      case 'BUSINESS_CARD':
        return 'briefcase';
      case 'OTHER':
        return 'help-circle';
      default:
        return 'wallet';
    }
  };

  const handleAddAccount = () => {
    setAddModalVisible(true);
  };

  const handleDismissAddModal = () => {
    setAddModalVisible(false);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {Object.keys(accountTypes).map((type) => (
            <List.Section key={type}>
              <List.Subheader>{accountTypes[type]}</List.Subheader>
              {accounts
                .filter((account) => account.type === type)
                .map((account, index) => (
                  <React.Fragment key={account.id}>
                    <List.Item
                      title={account.name}
                      left={props => <List.Icon {...props} icon={getAccountIcon(type)} />}
                      onPress={() => handleEditAccount(account)}
                    />
                    {index < accounts.filter(acc => acc.type === type).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
            </List.Section>
          ))}
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={handleAddAccount}
        />
        <AddAccountModal
          visible={addModalVisible}
          onDismiss={handleDismissAddModal}
          themeColor={colors.primary}
          initialType="DEBIT_CARD"
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
                    onPress={isEditing ? handleSaveAccount : handleStartEditing}
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
                      <Icon name="bank" size={20} color={colors.primary} />
                      <Text style={styles.label}>Nome da Conta</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        value={newAccountName}
                        onChangeText={setNewAccountName}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={colors.primary}
                        activeOutlineColor={colors.primary}
                      />
                    ) : (
                      <Text style={styles.value}>{selectedAccount?.name}</Text>
                    )}
                  </View>
                </View>

                {isEditing && (
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={handleSaveAccount}
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
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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

export default Accounts;
