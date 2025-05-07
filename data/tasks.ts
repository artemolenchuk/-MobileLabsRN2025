import { Task, TaskType } from '@/types/index';

export const initialTasks: Task[] = [
  {
    id: 't1',
    type: TaskType.CLICKS,
    description: 'Зробити 10 кліків',
    targetValue: 10,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't2',
    type: TaskType.DOUBLE_CLICKS,
    description: 'Зробити подвійний клік 5 разів',
    targetValue: 5,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't3',
    type: TaskType.LONG_PRESS_DURATION,
    description: "Утримувати об'єкт 3 секунди",
    targetValue: 1,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't4',
    type: TaskType.PAN,
    description: "Перетягнути об'єкт",
    targetValue: 1,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't5a',
    type: TaskType.FLING_LEFT,
    description: 'Зробити свайп вліво',
    targetValue: 1,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't5b',
    type: TaskType.FLING_RIGHT,
    description: 'Зробити свайп вправо',
    targetValue: 1,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't6',
    type: TaskType.PINCH,
    description: "Змінити розмір об'єкта",
    targetValue: 1,
    currentValue: 0,
    isCompleted: false,
  },
  {
    id: 't7',
    type: TaskType.SCORE,
    description: 'Отримати 100 діамантів',
    targetValue: 100,
    currentValue: 0,
    isCompleted: false,
  },
];

export const tasksData = [
  { id: 1, name: "Зробити 10 кліків", completed: false },
  { id: 2, name: "5 подвійних кліків", completed: false },
  { id: 3, name: "Утримати об'єкт 3 секунди", completed: false },
  { id: 4, name: "Перетягнути об'єкт", completed: false },
  { id: 5, name: "Свайп вправо", completed: false },
  { id: 6, name: "Свайп вліво", completed: false },
  { id: 7, name: "Змінити розмір об'єкта", completed: false },
  { id: 8, name: "Отримати 100 діамантів", completed: false },
];