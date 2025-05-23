import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../store/slices/cartSlice';

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

      <View style={styles.cartItemBottomRow}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Кількість:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            onChangeText={handleQuantityChange}
            value={String(item.quantity)}
            maxLength={3}
          />
        </View>

        <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <Text style={styles.removeButtonText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Кошик порожній. Додайте щось!</Text>
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
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutButtonText}>Оформити замовлення</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F0F4F8',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cartItemName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  cartItemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#555',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 50,
    textAlign: 'center',
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  removeButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 80,
    color: '#777',
    fontWeight: '500',
  },
});

export default CartScreen;
