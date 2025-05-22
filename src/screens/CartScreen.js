import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateItemQuantity, clearCart } from '../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleQuantityChange = (text) => {
    const newQuantity = parseInt(text);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      dispatch(updateItemQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  return (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <Text>Кількість: </Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          onChangeText={handleQuantityChange}
          value={String(item.quantity)}
        />
      </View>
      <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      <Button title="Видалити" onPress={handleRemove} color="red" />
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Кошик порожній.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CartItem item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Загальна сума: ${totalAmount.toFixed(2)}</Text>
        {cartItems.length > 0 && (
          <Button title="Оформити замовлення" onPress={() => navigation.navigate('Checkout')} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 40,
    textAlign: 'center',
    marginLeft: 5,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default CartScreen;