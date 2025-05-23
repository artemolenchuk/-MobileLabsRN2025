import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="ProductList"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'ProductList':
                    iconName = 'list';
                    break;
                  case 'Cart':
                    iconName = 'cart';
                    break;
                  case 'Checkout':
                    iconName = 'card';
                    break;
                  case 'OrderHistory':
                    iconName = 'time';
                    break;
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Каталог' }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Кошик' }} />
            <Tab.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Замовлення' }} />
            <Tab.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Історія' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
