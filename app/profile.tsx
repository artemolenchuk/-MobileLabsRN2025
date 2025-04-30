import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  registrationTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#999', padding: 8, borderRadius: 5, marginBottom: 10 },
});

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password === confirmPassword) {
      alert('Дякуємо за реєстрацію!');
    } else {
      alert('Паролі не співпадають!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.registrationTitle}>Реєстрація</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Пароль</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Пароль ще раз</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Text style={styles.label}>Прізвище</Text>
      <TextInput style={styles.input} value={surname} onChangeText={setSurname} />

      <Text style={styles.label}>Ім’я</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Button title="Зареєструватися" onPress={handleRegister} />
    </View>
  );
}