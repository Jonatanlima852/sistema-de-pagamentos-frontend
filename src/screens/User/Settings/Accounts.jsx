import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { List, FAB, Divider, Text, Button } from 'react-native-paper';
import SafeScreen from '../../../components/SafeScreen';
import { useFinances } from '../../../hooks/useFinances';
import AddAccountModal from '../AddTransaction/AddAccountModal';
import { colors } from '../../../theme';

const Accounts = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccountName, setNewAccountName] = useState('');

  const handleEditAccount = (account) => {
    console.log('Editar conta');
    setSelectedAccount(account);
    setNewAccountName(account.name);
    setEditModalVisible(true);
  };

  const handleSaveAccount = () => {
    if (selectedAccount) {
      console.log(`Conta editada: ${selectedAccount.name} -> ${newAccountName}`);
      // Lógica para salvar o nome da conta editada (API, hook, etc.)
    }
    setEditModalVisible(false);
    setSelectedAccount(null);
    setNewAccountName('');
  };

  const { accounts } = useFinances(); // Supõe que o hook useFinances retorna contas
  console.log('accounts: ', { accounts });

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
              <Text variant="titleLarge" style={styles.modalTitle}>
                Editar Conta
              </Text>
              <TextInput
                style={styles.input}
                value={newAccountName}
                onChangeText={setNewAccountName}
                placeholder="Novo nome da conta"
              />
              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={handleSaveAccount} style={styles.saveButton}>
                  Salvar
                </Button>
                <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                  Cancelar
                </Button>
              </View>
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

export default Accounts;
