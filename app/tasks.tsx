import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { useTasks } from '../context/TasksContext';

export default function TasksScreen() {
  const { tasks } = useTasks();

  const renderItem = ({ item }: { item: any }) => (
    <TaskItem task={item} />
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Ваше Завдання</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}