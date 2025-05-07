import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTasks } from '../context/TasksContext';
import { TaskType } from '../types';

export default function GameScreen() {
  const [score, setScore] = useState(0);
  const { updateTaskProgress } = useTasks();

  const scale = useSharedValue(1);

  // Визначаємо onPressOut ПЕРЕД тим, як вона використовується в tap
  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const incrementScore = () => {
    setScore(prevScore => prevScore + 1);
    // Оновлюємо прогрес завдання "Зробити 10 кліків"
    updateTaskProgress(TaskType.CLICKS, 1);
  };

  // Визначаємо ТІЛЬКИ жест натискання
  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      scale.value = withSpring(0.9);
    })
    .onEnd((_event, success) => {
      runOnJS(onPressOut)();
      if (success) {
        runOnJS(incrementScore)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', position: 'absolute', top: 30 }}>Рахунок: {score}</Text>
        {/* Використовуємо GestureDetector ТІЛЬКИ з жестом натискання */}
        <GestureDetector gesture={tap}>
          <Animated.View style={[{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'blue' }, animatedStyle]} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}