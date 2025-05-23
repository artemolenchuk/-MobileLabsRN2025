import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля.', [{ text: 'Зрозуміло' }]);
      return;
    }
    if (!validateEmail(localEmail)) {
      Alert.alert('Помилка', 'Будь ласка, введіть коректний email.', [{ text: 'Зрозуміло' }]);
      return;
    }

    dispatch(setUserInfo({ name: localName, email: localEmail }));

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), // Форматування дати
      itemsCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      totalAmount: totalAmount,
      items: cartItems,
    };

    dispatch(addOrder(newOrder));
    dispatch(clearCart());

    Alert.alert('Успіх!', 'Ваше замовлення успішно оформлено!', [
      { text: 'ОК', onPress: () => navigation.navigate('ProductList') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Оформлення замовлення</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше ім'я"
        placeholderTextColor="#999"
        value={localName}
        onChangeText={setLocalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Ваш Email"
        placeholderTextColor="#999"
        value={localEmail}
        onChangeText={setLocalEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Товарів у кошику: <Text style={styles.summaryValue}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Text></Text>
        <Text style={styles.summaryText}>Загальна сума: <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text></Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleCheckout}>
        <Text style={styles.confirmButtonText}>Підтвердити замовлення</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
    textAlign: 'center',
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default CheckoutScreen;