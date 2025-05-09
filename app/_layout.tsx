import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'gray',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyle,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitleStyle,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Файловий провідник' }} />
      <Stack.Screen name="editor" options={{ title: 'Редактор файлів' }} />
    </Stack>
  );
}