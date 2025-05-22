import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { setUserInfo } from '../store/slices/userSlice';
import { addOrder } from '../store/slices/ordersSlice';
import { validateEmail } from '../utils/validation';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { name, email } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);

  const handleCheckout = () => {
    if (!localName.trim() || !localEmail.trim()) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля.');
      return;
    }
    if (!validateEmail(localEmail)) {
      Alert.alert('Помилка', 'Будь ласка, введіть коректний email.');
      return;
    }

    dispatch(setUserInfo({ name: localName, email: localEmail }));

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      itemsCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      totalAmount: totalAmount,
      items: cartItems, 
    };

    dispatch(addOrder(newOrder));
    dispatch(clearCart());

    Alert.alert('Успіх!', 'Ваше замовлення успішно оформлено!');
    navigation.navigate('ProductList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Оформлення замовлення</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше ім'я"
        value={localName}
        onChangeText={setLocalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Ваш Email"
        value={localEmail}
        onChangeText={setLocalEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.summaryText}>Товарів у кошику: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Text>
      <Text style={styles.summaryText}>Загальна сума: ${totalAmount.toFixed(2)}</Text>
      <Button title="Підтвердити замовлення" onPress={handleCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CheckoutScreen;