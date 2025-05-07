import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TasksProvider } from '../context/TasksContext';

const colors = {
  minecraftGreen: '#728F46',
  minecraftBrown: '#8B572A',
  minecraftGray: '#A0A0A0',
  minecraftBlue: '#6495ED',
  minecraftLightBlue: '#ADD8E6',
  minecraftDarkGreen: '#556B2F',
  minecraftStone: '#8B8680',
  minecraftDirt: '#8B4513',
};

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
        tabBarActiveTintColor: colors.minecraftGreen,
        tabBarInactiveTintColor: colors.minecraftGray,
        tabBarLabelStyle: {

        },
        tabBarStyle: {
          backgroundColor: colors.minecraftBrown,
          height: 70,
          paddingBottom: 10,
          borderTopWidth: 0,
        },
      })}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Minecraft Clicker',
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
    <GestureHandlerRootView style={styles.container}>
      <TasksProvider>
        <TabLayout />
      </TasksProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});