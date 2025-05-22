import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <Text style={styles.orderDate}>Дата: {order.date}</Text>
    <Text style={styles.orderDetails}>Кількість товарів: {order.itemsCount}</Text>
    <Text style={styles.orderTotal}>Загальна сума: ${order.totalAmount.toFixed(2)}</Text>
    <Text style={styles.itemsHeader}>Деталі замовлення:</Text>
    {order.items.map((item) => (
      <Text key={item.id} style={styles.itemDetail}>
        - {item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
      </Text>
    ))}
  </View>
);

const OrderHistoryScreen = () => {
  const orderHistory = useSelector((state) => state.orders.history);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Історія замовлень</Text>
      {orderHistory.length === 0 ? (
        <Text style={styles.emptyHistoryText}>Історія замовлень порожня.</Text>
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderItem order={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  itemsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 12,
    marginLeft: 10,
    color: '#555',
  },
  emptyHistoryText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default OrderHistoryScreen;