import React from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import TransactionItem from './TransactionItem';
import { colors } from '../../../theme';

const TransactionList = ({ transactions, loading, handleLoadMore }) => {
  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <TransactionItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>Nenhuma transação encontrada</Text>
        </View>
      )}
      ListFooterComponent={() => (
        loading && transactions.length > 0 ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : null
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loader: {
    padding: 16,
  },
});

export default TransactionList;