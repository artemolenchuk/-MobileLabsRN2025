import { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTasks } from '../context/TasksContext';
import { TaskType } from '../types/index';

const SINGLE_TAP_POINTS = 1;
const DOUBLE_TAP_POINTS = SINGLE_TAP_POINTS * 2;
const LONG_PRESS_POINTS = 5;
const LONG_PRESS_DURATION = 800;
const FLING_MAX_POINTS = 10;
const PINCH_BONUS_POINTS = 15;
const MAX_SCALE = 3;
const MIN_SCALE = 0.5;

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

export default function GameScreen() {
  const [score, setScore] = useState(0);
  const { updateTaskProgress, updateTotalScore } = useTasks();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);

  const incrementScore = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    updateTotalScore(newScore);
  };

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((_event, success) => {
      if (!success) return;

      runOnJS(incrementScore)(SINGLE_TAP_POINTS);
      runOnJS(updateTaskProgress)(TaskType.CLICKS, 1);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (!success) return;

      runOnJS(incrementScore)(DOUBLE_TAP_POINTS);
      runOnJS(updateTaskProgress)(TaskType.DOUBLE_CLICKS, 1);
    });

  const longPress = Gesture.LongPress()
    .minDuration(LONG_PRESS_DURATION)
    .onEnd((_event, success) => {
      if (!success) return;

      runOnJS(incrementScore)(LONG_PRESS_POINTS);
      runOnJS(updateTaskProgress)(TaskType.LONG_PRESS_DURATION, 1);
    });

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onChange(event => {
      const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
      const objectWidth = 170; 
      const objectHeight = 170; 

      const maxX = screenWidth / 2 - objectWidth / 2;
      const maxY = screenHeight / 2 - objectHeight / 2 - 150 

      const newTranslateX = startX.value + event.translationX;
      const newTranslateY = startY.value + event.translationY;

      translateX.value = Math.max(-maxX, Math.min(newTranslateX, maxX));
      translateY.value = Math.max(-maxY, Math.min(newTranslateY, maxY));
    })
    .onEnd((event, success) => {
      if (success) {
        const distance = Math.sqrt(
          event.translationX ** 2 + event.translationY ** 2
        );
        if (distance > 10) {
          runOnJS(updateTaskProgress)(TaskType.PAN, 1);
        }
      }
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd((_event, success) => {
      if (!success) return;
      const randomPoints = Math.floor(Math.random() * FLING_MAX_POINTS) + 1;
      runOnJS(incrementScore)(randomPoints);
      runOnJS(updateTaskProgress)(TaskType.FLING_LEFT, 1);
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd((_event, success) => {
      if (!success) return;
      const randomPoints = Math.floor(Math.random() * FLING_MAX_POINTS) + 1;
      runOnJS(incrementScore)(randomPoints);
      runOnJS(updateTaskProgress)(TaskType.FLING_RIGHT, 1);
    });

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      startScale.value = scale.value;
    })
    .onChange(event => {
      const newScale = startScale.value * event.scale;

      scale.value = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
    })
    .onEnd(() => {
      if (scale.value !== 1) {
        runOnJS(incrementScore)(PINCH_BONUS_POINTS);
        runOnJS(updateTaskProgress)(TaskType.PINCH, 1);
      }
      scale.value = withSpring(1);
    });

  const tapAndLongPressAndFling = Gesture.Exclusive(
    doubleTap,
    longPress,
    singleTap
  );

  const combinedGestures = Gesture.Simultaneous(
    tapAndLongPressAndFling,
    pan,
    pinch,
    flingLeft,
    flingRight
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <ImageBackground
      source={require('../assets/images/image.png')}
      style={styles.background}
    >
      <Text style={styles.scoreText}>Діаманти: {score}</Text>
      <Text style={styles.instructionText}>
        Клікай, затискай, свайпай, тягни, масштабуй! Твої діаманти чекають!
      </Text>
      <GestureDetector gesture={combinedGestures}>
        <Animated.Image
          style={[styles.interactiveObject, animatedStyle]}
          source={require('../assets/images/Diamond_Ore_JE5_BE5.png')}
        />
      </GestureDetector>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  instructionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 200,
    paddingHorizontal: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  interactiveObject: {
    width: 170,
    height: 170,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  objectText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});