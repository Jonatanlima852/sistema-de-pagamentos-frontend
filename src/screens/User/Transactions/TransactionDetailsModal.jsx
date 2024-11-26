import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme';

const TransactionDetailsModal = ({ visible, onDismiss, transaction }) => {
  if (!transaction) return null;

  const themeColor = transaction.type.toUpperCase() === 'INCOME' ? colors.income : colors.expense;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>Detalhes da Transação</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeIcon}
            />
          </View>

          <View style={styles.iconContainer}>
            <Icon 
              name={transaction.type.toUpperCase() === 'INCOME' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={48} 
              color={themeColor}
            />
            <Text 
              variant="headlineMedium" 
              style={[styles.amount, { color: themeColor }]}
            >
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Icon name="text-box-outline" size={20} color={themeColor} />
                <Text style={styles.label}>Descrição</Text>
              </View>
              <Text style={styles.value}>{transaction.description}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Icon name="calendar" size={20} color={themeColor} />
                <Text style={styles.label}>Data</Text>
              </View>
              <Text style={styles.value}>{formatDate(transaction.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Icon name="swap-horizontal" size={20} color={themeColor} />
                <Text style={styles.label}>Tipo</Text>
              </View>
              <Text style={styles.value}>
                {transaction.type.toUpperCase() === 'INCOME' ? 'Receita' : 'Despesa'}
              </Text>
            </View>

            {transaction.category && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <Icon name="tag-outline" size={20} color={themeColor} />
                  <Text style={styles.label}>Categoria</Text>
                </View>
                <Text style={styles.value}>{transaction.category.name}</Text>
              </View>
            )}

            {transaction.account && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <Icon name="bank-outline" size={20} color={themeColor} />
                  <Text style={styles.label}>Conta</Text>
                </View>
                <Text style={styles.value}>{transaction.account.name}</Text>
              </View>
            )}

            {transaction.notes && (
              <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                  <Icon name="note-text-outline" size={20} color={themeColor} />
                  <Text style={styles.label}>Observações</Text>
                </View>
                <Text style={styles.value}>{transaction.notes}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: pressed ? `${themeColor}15` : 'transparent' }
              ]}
            >
              <Text style={[styles.closeButtonText, { color: themeColor }]}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    color: colors.text,
  },
  closeIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 16,
  },
  amount: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.outline,
    marginVertical: 20,
  },
  detailsContainer: {
    gap: 24,
  },
  detailRow: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  buttonContainer: {
    marginTop: 32,
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

export default TransactionDetailsModal; 