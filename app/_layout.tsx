import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TasksProvider } from '../context/TasksContext';

function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'] = 'alert-circle';

          if (route.name === 'index') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'tasks') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f0f0f0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Гра',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='tasks'
        options={{
          title: 'Завдання',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TasksProvider>
        <TabLayout />
      </TasksProvider>
    </GestureHandlerRootView>
  );
}