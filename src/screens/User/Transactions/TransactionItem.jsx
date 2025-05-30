import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';
import TransactionDetailsModal from './TransactionDetailsModal';
import { useFinances } from '../../../hooks/useFinances';

const TransactionItem = ({ item }) => {
  const [visible, setVisible] = useState(false);
  const { updateTransaction, deleteTransaction } = useFinances();

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
    try {
      const { id, ...updateData } = updatedTransaction;
      await updateTransaction(id, updateData);
      setVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a transação. Tente novamente.');
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await deleteTransaction(Number(transactionId));
      setVisible(false);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const themeColor = item.type.toUpperCase() === 'INCOME' ? colors.income : colors.expense;

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <View style={styles.transactionItem}>
          <View style={styles.leftContent}>
            <Icon 
              name={item.type.toUpperCase() === 'INCOME' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={24} 
              color={themeColor}
            />
            <View style={styles.transactionInfo}>
              <Text variant="titleMedium" style={styles.description}>
                {item.description}
              </Text>
              <Text variant="bodyMedium" style={styles.date}>
                {formatDate(item.date)}
              </Text>
              
              {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {item.tags.slice(0, 2).map(tag => (
                    <Chip
                      key={tag.id}
                      compact
                      style={[styles.tagChip, { borderColor: themeColor }]}
                      textStyle={[styles.tagText, { color: themeColor }]}
                    >
                      {tag.name}
                    </Chip>
                  ))}
                  {item.tags.length > 2 && (
                    <Chip
                      compact
                      style={[styles.tagChip, { borderColor: themeColor }]}
                      textStyle={[styles.tagText, { color: themeColor }]}
                    >
                      +{item.tags.length - 2}
                    </Chip>
                  )}
                </View>
              )}
            </View>
          </View>
          <Text 
            variant="titleMedium" 
            style={[
              styles.amount,
              { color: themeColor }
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
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
  },
  tagChip: {
    height: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  tagText: {
    fontSize: 10,
  },
});
  
export default TransactionItem;
