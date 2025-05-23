import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <Text style={styles.orderDate}>Дата: {order.date}</Text>
    <Text style={styles.orderDetails}>Кількість товарів: <Text style={styles.orderValue}>{order.itemsCount}</Text></Text>
    <Text style={styles.orderTotal}>Загальна сума: <Text style={styles.orderValue}>${order.totalAmount.toFixed(2)}</Text></Text>
    <Text style={styles.itemsHeader}>Деталі замовлення:</Text>
    {order.items.map((item) => (
      <Text key={item.id} style={styles.itemDetail}>
        • {item.name} (x{item.quantity}) - <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
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
        <Text style={styles.emptyHistoryText}>Історія замовлень порожня. Зробіть перше замовлення!</Text>
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
    padding: 15,
    backgroundColor: '#F0F4F8',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderValue: {
    fontWeight: '600',
    color: '#333',
  },
  orderTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  itemsHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  itemDetail: {
    fontSize: 13,
    marginLeft: 10,
    color: '#555',
    marginBottom: 3,
  },
  itemPrice: {
    fontWeight: '600',
    color: '#333',
  },
  emptyHistoryText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 80,
    color: '#777',
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;