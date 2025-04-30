import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => (
  <View style={styles.header}>
    <Image source={{ uri: 'https://surl.li/zgohbm' }} style={styles.logo} />
    <Text style={styles.title}>FirstMobileApp</Text>
  </View>
);

const Footer = () => (
  <Text style={styles.signature}>Оленчук Артем Олександрович, ВТ-23-2</Text>
);

export default function Layout() {
  return (
    <View style={styles.container}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarPosition: 'top',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Головна',
            tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: 'Галерея',
            tabBarIcon: ({ color, size }) => <FontAwesome name="image" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профіль',
            tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
          }}
        />
      </Tabs>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 100,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  signature: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    paddingBottom: 10,
    backgroundColor: '#f0f0f0',
  },
});