import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../../theme';

const TransactionItem = ({ item }) => {
    // Formata o valor para moeda brasileira
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };
  
    // Formata a data para o padrão brasileiro
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
    };
  
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text variant="titleMedium">{item.description}</Text>
          <Text variant="bodyMedium" style={{ color: colors.textLight }}>
            {formatDate(item.date)}
          </Text>
        </View>
        <Text 
          variant="titleMedium" 
          style={{ 
            color: item.type.toUpperCase() === 'INCOME' ? colors.success : colors.error 
          }}
        >
          {formatCurrency(item.amount)}
        </Text>
      </View>
    );
};
  
export default TransactionItem;
