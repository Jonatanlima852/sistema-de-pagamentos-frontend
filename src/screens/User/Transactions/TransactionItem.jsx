import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';
import TransactionDetailsModal from './TransactionDetailsModal';
// import { useFinances } from '../../../context/FinancesContext';

const TransactionItem = ({ item }) => {
  const [visible, setVisible] = useState(false);
  // const { deleteTransaction } = useFinances();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleUpdate = async (updatedTransaction) => {
    // Implementar lógica de atualização
    console.log('Transação atualizada:', updatedTransaction);
  };

  const handleDelete = async (transactionId) => {
    // try {
    //   await deleteTransaction(transactionId);
    //   setVisible(false);
    // } catch (error) {
    //   console.error('Erro ao deletar transação:', error);
    // }
     // Implementar lógica de atualização
     console.log('Transação atualizada:', transactionId);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <View style={styles.transactionItem}>
          <View style={styles.leftContent}>
            <Icon 
              name={item.type.toUpperCase() === 'INCOME' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={24} 
              color={item.type.toUpperCase() === 'INCOME' ? colors.income : colors.expense}
            />
            <View style={styles.transactionInfo}>
              <Text variant="titleMedium" style={styles.description}>{item.description}</Text>
              <Text variant="bodyMedium" style={styles.date}>
                {formatDate(item.date)}
              </Text>
            </View>
          </View>
          <Text 
            variant="titleMedium" 
            style={[
              styles.amount,
              { color: item.type.toUpperCase() === 'INCOME' ? colors.income : colors.expense }
            ]}
          >
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>

      <TransactionDetailsModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        transaction={item}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    backgroundColor: colors.background,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontWeight: '500',
  },
  date: {
    color: colors.textLight,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontWeight: '600',
  },
});
  
export default TransactionItem;
