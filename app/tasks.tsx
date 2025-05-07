import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { useTasks } from '../context/TasksContext';
import { Task } from '../types/index';

export default function TasksScreen() {
  const { tasks } = useTasks();

  // Раніше тут був useEffect з console.log, тепер його немає.
  // useEffect(() => {
  //   console.log('Завдання в TasksScreen:', tasks);
  // }, [tasks]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem task={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ваші Завдання</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});