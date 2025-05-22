import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="ProductList">
            <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Каталог товарів' }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Кошик' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Оформлення замовлення' }} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Історія замовлень' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}