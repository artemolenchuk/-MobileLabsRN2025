import { Task, TaskType } from '../types'; // Шлях виправлено!

export const initialTasks: Task[] = [
  {
    id: 't1',
    type: TaskType.CLICKS,
    description: 'Зробити 10 кліків',
    targetValue: 10,
    currentValue: 0,
    isCompleted: false,
  },
];